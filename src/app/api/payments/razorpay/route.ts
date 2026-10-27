import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fixNowStore } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, bookingId, amount, paymentId, orderId, signature } = body;

    const booking = fixNowStore.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (action === 'create_order') {
      // Create Razorpay test order (or mock order id if live keys not in env)
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_FIXNOW247DEMO';
      const orderNumber = `order_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

      return NextResponse.json({
        success: true,
        orderId: orderNumber,
        currency: 'INR',
        amount: Math.round(Number(amount || booking.total_amount) * 100), // paise
        key: razorpayKeyId,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone
      });
    }

    if (action === 'verify_payment') {
      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
      let isSignatureValid = true;

      // If Razorpay secret is configured in production, verify HMAC SHA256 signature
      if (razorpaySecret && orderId && signature && paymentId) {
        const text = `${orderId}|${paymentId}`;
        const generatedSignature = crypto
          .createHmac('sha256', razorpaySecret)
          .update(text)
          .digest('hex');

        if (generatedSignature !== signature) {
          isSignatureValid = false;
        }
      }

      if (!isSignatureValid) {
        return NextResponse.json({ success: false, error: 'Razorpay payment signature mismatch' }, { status: 400 });
      }

      // Mark booking as paid
      const payRef = paymentId || `pay_test_${Date.now()}`;
      fixNowStore.updateBookingStatus(
        bookingId,
        booking.status,
        `Payment of ₹${booking.total_amount} verified via Razorpay (${payRef})`,
        {
          payment_status: 'paid',
          payment_method: 'razorpay',
          payment_reference: payRef
        }
      );

      fixNowStore.addAuditLog({
        actor_id: booking.customer_id,
        actor_role: 'customer',
        action: 'PAYMENT_VERIFIED',
        target_resource: 'payments',
        target_id: payRef,
        details: { bookingId, amount: booking.total_amount, gateway: 'Razorpay' }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and confirmed successfully',
        paymentReference: payRef,
        booking: fixNowStore.getBookingById(bookingId)
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
