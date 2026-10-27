'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  QrCode,
  Banknote,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'cash'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  useEffect(() => {
    const data = fixNowStore.getBookingById(bookingId);
    if (data) {
      setBooking({ ...data });
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading invoice details...
      </div>
    );
  }

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      if (paymentMethod === 'cash') {
        fixNowStore.updateBookingStatus(
          bookingId,
          booking.status,
          'Customer opted for Cash payment on physical handover',
          {
            payment_status: 'cash_pending',
            payment_method: 'cash'
          }
        );
        router.push(`/booking/confirmation/${bookingId}`);
        return;
      }

      // Razorpay or UPI simulation via server endpoint
      const orderRes = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          bookingId: booking.id,
          amount: booking.total_amount
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway');
      }

      // Simulate client payment authorization
      const fakePaymentId = `pay_rzp_test_${Date.now()}`;
      const verifyRes = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_payment',
          bookingId: booking.id,
          paymentId: fakePaymentId,
          orderId: orderData.orderId,
          signature: 'sig_valid_test_mock'
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        router.push(`/booking/confirmation/${bookingId}`);
      } else {
        alert(verifyData.error || 'Payment verification failed');
      }
    } catch (e: any) {
      alert('Payment processing error: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Secure Payment Checkout</h1>
            <p className="text-xs text-slate-500">Booking #{booking.booking_number} • 256-Bit SSL Encrypted</p>
          </div>
          <Badge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Payment Method Selector */}
          <div className="md:col-span-7 space-y-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Select Payment Mode
              </h3>

              <div className="space-y-3">
                {/* Razorpay Test Mode */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-brand-600 bg-brand-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>Razorpay Gateway</span>
                        <span className="text-[10px] bg-blue-100 text-brand-800 font-bold px-2 py-0.5 rounded">
                          Test Mode
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">Cards, Netbanking, Wallets</div>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-brand-600" />
                </label>

                {/* UPI Instant */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Instant UPI Payment</div>
                      <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-emerald-600" />
                </label>

                {/* Cash on Handover */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-amber-600 bg-amber-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Cash on Handover / Delivery</div>
                      <div className="text-xs text-slate-500">Pay directly to technician after completion</div>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-amber-600" />
                </label>
              </div>

              {paymentMethod === 'upi' && (
                <div className="pt-2 animate-in fade-in">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter UPI VPA / Handle</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}
            </Card>

            <div className="p-4 bg-slate-100 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Zero raw card data is ever stored on this server. Payments are tokenized and verified through PCI-DSS Level 1 compliant infrastructure.
              </span>
            </div>
          </div>

          {/* Right Column: Order Invoice Breakdown */}
          <div className="md:col-span-5 space-y-6">
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-brand-600" />
                  Itemized Bill
                </h3>
                <span className="text-xs text-slate-500">Tax Invoice</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Base Inspection / Visit Charge</span>
                  <span>₹{booking.base_charge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance / Logistics Fee</span>
                  <span>₹{booking.distance_charge}</span>
                </div>
                {booking.emergency_surcharge > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Emergency Priority Dispatch</span>
                    <span>₹{booking.emergency_surcharge}</span>
                  </div>
                )}
                {booking.parts_charge > 0 && (
                  <div className="flex justify-between">
                    <span>Approved Spares & Parts</span>
                    <span>₹{booking.parts_charge}</span>
                  </div>
                )}
                {booking.labour_charge > 0 && (
                  <div className="flex justify-between">
                    <span>Approved Labour Fee</span>
                    <span>₹{booking.labour_charge}</span>
                  </div>
                )}
                {booking.fuel_charge > 0 && (
                  <div className="flex justify-between">
                    <span>Fuel & HazMat Handling Fee</span>
                    <span>₹{booking.fuel_charge}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span>Statutory GST (18%)</span>
                  <span>₹{booking.gst_tax}</span>
                </div>

                <div className="flex justify-between font-black text-base text-slate-900 pt-3 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span>₹{booking.total_amount}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4"
                isLoading={isProcessing}
                onClick={handlePayNow}
                leftIcon={<ShieldCheck className="w-5 h-5" />}
              >
                Pay ₹{booking.total_amount} Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
