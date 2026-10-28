import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Consumer Protection</Badge>
          <h1 className="text-3xl font-black text-[#252B2B] tracking-tight">Cancellation & Refund Policy</h1>
          <p className="text-xs text-[#687474]">Transparent cancellation rules and dispute resolution guidelines</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-[#687474] leading-relaxed bg-white border border-[#E6E8E5]">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">1. Customer Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#687474]">
              <li>
                <strong className="text-[#252B2B]">During Searching / Before Assignment:</strong> Free cancellation with 100% refund of any authorized deposit.
              </li>
              <li>
                <strong className="text-[#252B2B]">Within 5 minutes of Specialist Assignment:</strong> Free cancellation.
              </li>
              <li>
                <strong className="text-[#252B2B]">After Specialist is En Route (Departed):</strong> A nominal travel reimbursement fee (₹150) is charged to compensate the technician for fuel and dispatch time.
              </li>
              <li>
                <strong className="text-[#252B2B]">After Arrival at Location:</strong> Full base inspection visit charge is applicable.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">2. Provider No-Show Guarantee</h2>
            <p className="text-xs text-[#687474]">
              If an assigned provider fails to arrive within 20 minutes past the estimated arrival time due to unreasonable delay or equipment breakdown, the customer can reassign the booking for free or receive a complete full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">3. 30-Day Workmanship Warranty Refunds</h2>
            <p className="text-xs text-[#687474]">
              All approved appliance and automotive repairs come with a standard 30-day service warranty. In the rare event a recurring failure cannot be resolved by subsequent technician visits, the labour charge is eligible for a full refund upon operational review.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">4. Refund Processing Time</h2>
            <p className="text-xs text-[#687474]">
              Approved refunds are credited back to the original source instrument (UPI / Debit Card / Netbanking) within 3 to 5 business days via Razorpay gateway channels.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
