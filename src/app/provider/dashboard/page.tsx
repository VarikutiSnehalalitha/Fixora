'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Power,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  TrendingUp,
  Star,
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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#687474]">
        Loading specialist portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Availability Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8E5] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">Specialist Terminal</Badge>
              <span className="text-xs text-[#687474]">• {provider.business_name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#252B2B]">
              Welcome back, {provider.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                isAvailable
                  ? 'bg-[#21845B] text-white border-[#1B6E4B] hover:bg-[#1B6E4B]'
                  : 'bg-white text-[#687474] border-[#E6E8E5] hover:bg-[#FAF9F6]'
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

        {/* Active Emergency Assignment Alert - Light Theme */}
        {activeJob && (
          <div className="bg-[#EAF5F2] border border-[#A7D9CD] text-[#252B2B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-[#0F766E] animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-[#0F766E]">
                  Current Assigned Emergency Job
                </span>
                <span className="text-xs font-mono text-[#687474]">#{activeJob.booking_number}</span>
              </div>
              <Badge status={activeJob.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#252B2B]">{activeJob.issue_title}</h3>
                <p className="text-xs sm:text-sm text-[#525D5D] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>{activeJob.location.address}</span>
                </p>
                {activeJob.location.direction_of_travel && (
                  <p className="text-xs text-[#687474]">
                    Direction: {activeJob.location.direction_of_travel}
                  </p>
                )}
                <div className="pt-2 flex items-center gap-4 text-xs text-[#252B2B]">
                  <span>Customer: <strong>{activeJob.customer_name}</strong></span>
                  <span>Phone: <strong>{activeJob.customer_phone}</strong></span>
                  <span>Payout: <strong className="text-[#21845B]">₹{activeJob.provider_payout}</strong></span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
                <Link href={`/provider/jobs/${activeJob.id}`}>
                  <Button variant="primary" size="lg" className="w-full bg-[#0F766E] hover:bg-[#0D645E]" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Open Action Dashboard
                  </Button>
                </Link>
                <a href={`tel:${activeJob.customer_phone}`}>
                  <Button variant="outline" size="md" className="w-full bg-white text-[#252B2B] border-[#A7D9CD] hover:border-[#0F766E] hover:text-[#0F766E]" leftIcon={<Phone className="w-4 h-4 text-[#0F766E]" />}>
                    Call Customer Directly
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs text-[#687474] font-semibold uppercase">Total Jobs Completed</span>
            <div className="text-2xl font-black text-[#252B2B]">{provider.total_completed_jobs}</div>
            <div className="text-[11px] text-[#21845B] font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14 this week
            </div>
          </Card>

          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs text-[#687474] font-semibold uppercase">Verified Rating</span>
            <div className="text-2xl font-black text-[#252B2B] flex items-center gap-1.5">
              <span>{provider.rating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-[#D99119] fill-[#D99119]" />
            </div>
            <div className="text-[11px] text-[#687474]">{provider.review_count} Customer Reviews</div>
          </Card>

          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs text-[#687474] font-semibold uppercase">Total Gross Earnings</span>
            <div className="text-2xl font-black text-[#252B2B]">₹{provider.total_earnings.toLocaleString()}</div>
            <div className="text-[11px] text-[#687474]">Direct Weekly Bank Transfer</div>
          </Card>

          <Card className="p-5 space-y-1 bg-white border-[#E6E8E5]">
            <span className="text-xs text-[#687474] font-semibold uppercase">Dispatch Radius</span>
            <div className="text-2xl font-black text-[#252B2B]">{provider.service_radius_km} km</div>
            <div className="text-[11px] text-[#687474]">{provider.city} Metropolitan Hub</div>
          </Card>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-5 space-y-3 bg-white border-[#E6E8E5]">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#252B2B]">Incoming Job Requests</h3>
            <p className="text-xs text-[#687474] leading-relaxed">
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

          <Card hoverEffect className="p-5 space-y-3 bg-white border-[#E6E8E5]">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4EE] text-[#21845B] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#252B2B]">Earnings & Payouts</h3>
            <p className="text-xs text-[#687474] leading-relaxed">
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

          <Card hoverEffect className="p-5 space-y-3 bg-white border-[#E6E8E5]">
            <div className="w-10 h-10 rounded-xl bg-[#FEF9EE] text-[#D99119] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#252B2B]">Radius & Working Hours</h3>
            <p className="text-xs text-[#687474] leading-relaxed">
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
