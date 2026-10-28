'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  ArrowLeft
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#252B2B]">Earnings & Payout Statement</h1>
            <p className="text-xs text-[#687474]">Transparent commission accounting and bank settlement audit logs.</p>
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
          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs font-bold text-[#687474] uppercase">Total Settled Payouts</span>
            <div className="text-3xl font-black text-[#252B2B]">₹{provider?.total_earnings.toLocaleString()}</div>
            <p className="text-[11px] text-[#21845B] font-semibold">100% On-Time Weekly Bank Deposits</p>
          </Card>

          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs font-bold text-[#687474] uppercase">Platform Commission (15%)</span>
            <div className="text-3xl font-black text-[#252B2B]">₹{Math.round((provider?.total_earnings || 0) * 0.15).toLocaleString()}</div>
            <p className="text-[11px] text-[#687474]">Disclosed in accordance with GST rules</p>
          </Card>

          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs font-bold text-[#687474] uppercase">Registered Bank Account</span>
            <div className="text-sm font-bold text-[#252B2B] font-mono">HDFC Bank •••• 9102</div>
            <p className="text-[11px] text-[#687474]">IFSC: HDFC0001234 (Verified)</p>
          </Card>
        </div>

        {/* Payout History Table */}
        <Card className="space-y-4 bg-white border-[#E6E8E5]">
          <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-3">
            Recent Completed Service Settlements
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] text-[#687474] uppercase border-b border-[#E6E8E5]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                  <th className="py-2.5 px-3 font-semibold">Service</th>
                  <th className="py-2.5 px-3 font-semibold">Customer Total</th>
                  <th className="py-2.5 px-3 font-semibold">Platform Fee</th>
                  <th className="py-2.5 px-3 font-semibold">Your Net Payout</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8E5]">
                {completedJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-[#FAF9F6]">
                    <td className="py-3 px-3 font-mono font-bold text-[#252B2B]">{j.booking_number}</td>
                    <td className="py-3 px-3 font-semibold text-[#252B2B]">{j.issue_title}</td>
                    <td className="py-3 px-3 font-semibold text-[#252B2B]">₹{j.total_amount}</td>
                    <td className="py-3 px-3 text-[#687474]">₹{j.platform_commission}</td>
                    <td className="py-3 px-3 font-black text-[#21845B]">₹{j.provider_payout}</td>
                    <td className="py-3 px-3">
                      <Badge variant="success" size="sm">Settled</Badge>
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
