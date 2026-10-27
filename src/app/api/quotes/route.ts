import { NextResponse } from 'next/server';
import { fixNowStore } from '@/lib/store';
import { GST_RATE } from '@/lib/constants';
import { ServiceQuote } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, providerId, diagnosisNotes, items, estimatedMinutes = 60, warrantyDays = 30 } = body;

    if (!bookingId || !providerId || !items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Missing required quote fields' }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * Number(item.quantity)), 0);
    const gstTax = Math.round(subtotal * GST_RATE);
    const totalAmount = subtotal + gstTax;

    const quote: ServiceQuote = {
      id: `quote-${Date.now()}`,
      booking_id: bookingId,
      provider_id: providerId,
      diagnosis_notes: diagnosisNotes || 'Diagnosis completed. Parts and repair services estimated.',
      items: items.map((item: any, idx: number) => ({
        id: `qi-${idx}-${Date.now()}`,
        description: item.description,
        type: item.type || 'part',
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        total: Number(item.unit_price) * Number(item.quantity)
      })),
      subtotal,
      gst_tax: gstTax,
      total_amount: totalAmount,
      estimated_completion_minutes: Number(estimatedMinutes),
      warranty_days: Number(warrantyDays),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const success = fixNowStore.submitServiceQuote(bookingId, quote);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Could not attach quote to booking' }, { status: 422 });
    }

    const updated = fixNowStore.getBookingById(bookingId);
    return NextResponse.json({ success: true, quote, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, action } = body; // action: 'approve' | 'reject'

    if (!bookingId || !action) {
      return NextResponse.json({ success: false, error: 'Missing bookingId or action' }, { status: 400 });
    }

    if (action === 'approve') {
      const ok = fixNowStore.approveQuote(bookingId);
      if (!ok) {
        return NextResponse.json({ success: false, error: 'Quote approval failed' }, { status: 422 });
      }
    } else {
      fixNowStore.updateBookingStatus(bookingId, 'CANCELLED', 'Customer declined repair quote estimate');
    }

    const updated = fixNowStore.getBookingById(bookingId);
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
