'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Power,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle2,
  DollarSign,
  Radio
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { ProviderProfile, Booking } from '@/types';

export default function ProviderDashboardPage() {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [activeJob, setActiveJob] = useState<Booking | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Vikram Singh by default in demo
    const p = fixNowStore.getProviders()[0];
    if (p) {
      setProvider(p);
      setIsAvailable(p.is_available);
    }

    const bookings = fixNowStore.getBookings();
    const active = bookings.find(
      (b) =>
        b.provider_id === p?.id &&
        b.status !== 'COMPLETED' &&
        b.status !== 'CANCELLED'
    );
    setActiveJob(active || null);
  }, []);

  const handleToggleAvailability = () => {
    if (!provider) return;
    const newStatus = fixNowStore.toggleProviderAvailability(provider.id);
    setIsAvailable(newStatus);
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading provider portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Availability Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">Specialist Terminal</Badge>
              <span className="text-xs text-slate-400">• {provider.business_name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, {provider.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                isAvailable
                  ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                  : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isAvailable ? 'Online (Accepting Jobs)' : 'Offline (Paused)'}</span>
            </button>

            <Link href="/provider/jobs">
              <Button variant="outline" size="sm">
                Incoming Requests
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Emergency Assignment Alert */}
        {activeJob && (
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Current Assigned Emergency Job
                </span>
                <span className="text-xs font-mono text-slate-400">#{activeJob.booking_number}</span>
              </div>
              <Badge status={activeJob.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold">{activeJob.issue_title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{activeJob.location.address}</span>
                </p>
                {activeJob.location.direction_of_travel && (
                  <p className="text-xs text-slate-400">
                    Direction: {activeJob.location.direction_of_travel}
                  </p>
                )}
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
                  <span>Customer: <strong>{activeJob.customer_name}</strong></span>
                  <span>Phone: <strong>{activeJob.customer_phone}</strong></span>
                  <span>Payout: <strong>₹{activeJob.provider_payout}</strong></span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
                <Link href={`/provider/jobs/${activeJob.id}`}>
                  <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Open Action Dashboard
                  </Button>
                </Link>
                <a href={`tel:${activeJob.customer_phone}`}>
                  <Button variant="outline" size="md" className="w-full bg-white/10 text-white border-white/20" leftIcon={<Phone className="w-4 h-4" />}>
                    Call Customer Directly
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Jobs Completed</span>
            <div className="text-2xl font-black text-slate-900">{provider.total_completed_jobs}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14 this week
            </div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Verified Rating</span>
            <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              <span>{provider.rating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-[11px] text-slate-500">{provider.review_count} Customer Reviews</div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Gross Earnings</span>
            <div className="text-2xl font-black text-slate-900">₹{provider.total_earnings.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500">Direct Weekly Bank Transfer</div>
          </Card>

          <Card className="p-5 space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase">Dispatch Radius</span>
            <div className="text-2xl font-black text-slate-900">{provider.service_radius_km} km</div>
            <div className="text-[11px] text-slate-500">{provider.city} Metropolitan Hub</div>
          </Card>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Incoming Job Requests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review roadside distress alerts within your radius and accept emergency jobs.
            </p>
            <div className="pt-2">
              <Link href="/provider/jobs">
                <Button variant="outline" size="sm" className="w-full">
                  View Job Feed
                </Button>
              </Link>
            </div>
          </Card>

          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Earnings & Payouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Itemized payouts, platform commission receipts, and bank deposit history.
            </p>
            <div className="pt-2">
              <Link href="/provider/earnings">
                <Button variant="outline" size="sm" className="w-full">
                  Check Wallet
                </Button>
              </Link>
            </div>
          </Card>

          <Card hoverEffect className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Radius & Working Hours</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure your operational perimeter, supported vehicle brands, and visit charges.
            </p>
            <div className="pt-2">
              <Link href="/provider/availability">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Settings
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
