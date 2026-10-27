'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Download,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, ProviderProfile } from '@/types';

export default function ProviderEarningsPage() {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Booking[]>([]);

  useEffect(() => {
    const p = fixNowStore.getProviders()[0];
    if (p) setProvider(p);

    const all = fixNowStore.getBookings();
    setCompletedJobs(all.filter((b) => b.status === 'COMPLETED'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Earnings & Payout Statement</h1>
            <p className="text-xs text-slate-500">Transparent commission accounting and bank settlement audit logs.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('Downloading Financial Payout Statement (PDF)...')}
          >
            Export Statement
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 space-y-1 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Settled Payouts</span>
            <div className="text-3xl font-black text-slate-900">₹{provider?.total_earnings.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-semibold">100% On-Time Weekly Bank Deposits</p>
          </Card>

          <Card className="p-5 space-y-1 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Platform Commission (15%)</span>
            <div className="text-3xl font-black text-slate-900">₹{Math.round((provider?.total_earnings || 0) * 0.15).toLocaleString()}</div>
            <p className="text-[11px] text-slate-500">Disclosed in accordance with GST rules</p>
          </Card>

          <Card className="p-5 space-y-1 bg-white">
            <span className="text-xs font-bold text-slate-500 uppercase">Registered Bank Account</span>
            <div className="text-sm font-bold text-slate-900 font-mono">HDFC Bank •••• 9102</div>
            <p className="text-[11px] text-slate-500">IFSC: HDFC0001234 (Verified)</p>
          </Card>
        </div>

        {/* Payout History Table */}
        <Card className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Recent Completed Service Settlements
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                  <th className="py-2.5 px-3 font-semibold">Service</th>
                  <th className="py-2.5 px-3 font-semibold">Customer Total</th>
                  <th className="py-2.5 px-3 font-semibold">Platform Fee</th>
                  <th className="py-2.5 px-3 font-semibold">Your Net Payout</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{j.booking_number}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{j.issue_title}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">₹{j.total_amount}</td>
                    <td className="py-3 px-3 text-slate-500">₹{j.platform_commission}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">₹{j.provider_payout}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        SETTLED
                      </span>
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
