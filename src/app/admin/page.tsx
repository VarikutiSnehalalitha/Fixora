'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Wrench,
  Fuel,
  Calendar,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Activity,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, ProviderProfile } from '@/types';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);

  useEffect(() => {
    setBookings(fixNowStore.getBookings());
    setProviders(fixNowStore.getProviders());
  }, []);

  const pendingProviders = providers.filter((p) => p.verification_status === 'pending');
  const activeEmergencies = bookings.filter((b) => b.status === 'SEARCHING' || b.status === 'PROVIDER_EN_ROUTE');
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.payment_status === 'paid' ? b.total_amount : 0), 0);
  const totalCommission = bookings.reduce((sum, b) => sum + (b.payment_status === 'paid' ? b.platform_commission : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emergency">Central Command</Badge>
              <span className="text-xs text-slate-400">FixNow Operations Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              System Operations & Compliance Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/providers">
              <Button variant="primary" size="sm" leftIcon={<FileCheck className="w-4 h-4" />}>
                Review Verifications ({pendingProviders.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Platform GMV</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24% MoM
            </div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Platform Net Commission</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalCommission.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500">15% Standard Margin</div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Active Specialists</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{providers.length}</div>
            <div className="text-[11px] text-brand-600 font-semibold">
              {pendingProviders.length} Pending Approval
            </div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Live Bookings</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{bookings.length}</div>
            <div className="text-[11px] text-rose-600 font-semibold">
              {activeEmergencies.length} Roadside In Transit
            </div>
          </Card>
        </div>

        {/* Pending Verification Alert if any */}
        {pendingProviders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase text-amber-900">
                  {pendingProviders.length} Provider Application(s) Awaiting Document Verification
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Aadhaar, Commercial Driver&apos;s License, or PESO safety certifications require manual review before these providers receive live jobs.
              </p>
            </div>
            <Link href="/admin/providers">
              <Button variant="primary" size="sm">
                Review & Approve Documents
              </Button>
            </Link>
          </div>
        )}

        {/* Admin Navigation Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Provider Verifications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify identity documents, police background clearances, and mechanic diplomas.
            </p>
            <div className="pt-2">
              <Link href="/admin/providers">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Providers
                </Button>
              </Link>
            </div>
          </Card>

          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">PESO Fuel Audits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enforce statutory Petroleum Rules 2002 compliance, verify bowsers, and set maximum delivery caps.
            </p>
            <div className="pt-2">
              <Link href="/admin/fuel-partners">
                <Button variant="outline" size="sm" className="w-full">
                  Audit Fuel Partners
                </Button>
              </Link>
            </div>
          </Card>

          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Live Dispatch & Bookings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor active state transitions, timeout retries, cancellations, and dispute triggers.
            </p>
            <div className="pt-2">
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm" className="w-full">
                  Monitor Dispatch
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Financial & Support Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hoverEffect className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Pricing & Surcharges Configuration</h3>
            <p className="text-xs text-slate-500">
              Configure base visit charges, night-time emergency surcharges (10 PM–6 AM), distance multipliers, and GST tax percentages.
            </p>
            <Link href="/admin/services">
              <Button variant="outline" size="sm">
                Open Pricing Matrix
              </Button>
            </Link>
          </Card>

          <Card hoverEffect className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Support Tickets & System Audit Logs</h3>
            <p className="text-xs text-slate-500">
              Inspect immutable audit records for regulatory scrutiny and resolve customer dispute tickets.
            </p>
            <Link href="/admin/support">
              <Button variant="outline" size="sm">
                Open Support & Audit Log
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
