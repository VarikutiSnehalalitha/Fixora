'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = () => {
    setBookings([...fixNowStore.getBookings()]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleTriggerRefund = (bookingId: string) => {
    if (confirm('Trigger full refund for this booking? Amount will be credited back via payment gateway.')) {
      fixNowStore.updateBookingStatus(bookingId, 'REFUNDED', 'Admin authorized full refund to customer', {
        payment_status: 'refunded'
      });
      fixNowStore.addAuditLog({
        actor_id: 'usr-admin-001',
        actor_role: 'admin',
        action: 'PAYMENT_REFUNDED',
        target_resource: 'payments',
        target_id: bookingId,
        details: { reason: 'Customer dispute resolved' }
      });
      alert('Refund authorized and processed successfully!');
      load();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments, Commissions & Refunds</h1>
          <p className="text-xs text-slate-500">Monitor transactions, commissions, and dispute refund approvals.</p>
        </div>

        <Card className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">Gross Total</th>
                  <th className="py-2.5 px-3 font-semibold">Platform Cut (15%)</th>
                  <th className="py-2.5 px-3 font-semibold">Payment Status</th>
                  <th className="py-2.5 px-3 font-semibold">Gateway Ref</th>
                  <th className="py-2.5 px-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{b.booking_number}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{b.customer_name}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{b.total_amount}</td>
                    <td className="py-3 px-3 text-slate-600">₹{b.platform_commission}</td>
                    <td className="py-3 px-3">
                      <Badge variant={b.payment_status === 'paid' ? 'success' : b.payment_status === 'refunded' ? 'neutral' : 'warning'}>
                        {b.payment_status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {b.payment_reference || 'Pending'}
                    </td>
                    <td className="py-3 px-3">
                      {b.payment_status === 'paid' && (
                        <button
                          onClick={() => handleTriggerRefund(b.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
