import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Consumer Protection</Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cancellation & Refund Policy</h1>
          <p className="text-xs text-slate-500">Transparent cancellation rules and dispute resolution guidelines</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed bg-white">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Customer Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>
                <strong>During Searching / Before Assignment:</strong> Free cancellation with 100% refund of any authorized deposit.
              </li>
              <li>
                <strong>Within 5 minutes of Specialist Assignment:</strong> Free cancellation.
              </li>
              <li>
                <strong>After Specialist is En Route (Departed):</strong> A nominal travel reimbursement fee (₹150) is charged to compensate the technician for fuel and dispatch time.
              </li>
              <li>
                <strong>After Arrival at Location:</strong> Full base inspection visit charge is applicable.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Provider No-Show Guarantee</h2>
            <p className="text-xs">
              If an assigned provider fails to arrive within 20 minutes past the estimated arrival time due to unreasonable delay or equipment breakdown, the customer can reassign the booking for free or receive a complete full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. 30-Day Workmanship Warranty Refunds</h2>
            <p className="text-xs">
              All approved appliance and automotive repairs come with a standard 30-day service warranty. In the rare event a recurring failure cannot be resolved by subsequent technician visits, the labour charge is eligible for a full refund upon operational review.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Refund Processing Time</h2>
            <p className="text-xs">
              Approved refunds are credited back to the original source instrument (UPI / Debit Card / Netbanking) within 3 to 5 business days via Razorpay gateway channels.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
