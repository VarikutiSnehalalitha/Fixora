'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    setBookings(fixNowStore.getBookings());
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status !== 'COMPLETED' && b.status !== 'CANCELLED';
    if (filter === 'completed') return b.status === 'COMPLETED';
    if (filter === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#252B2B]">Your Booking History</h1>
            <p className="text-xs text-[#687474]">View live tracking telemetry, tax invoices, and repair records.</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E6E8E5] text-xs shadow-sm">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                  filter === tab
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-[#687474] hover:text-[#252B2B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="text-center py-12 text-[#687474] text-xs space-y-3 bg-white border-[#E6E8E5]">
              <Calendar className="w-8 h-8 mx-auto text-[#687474]/50" />
              <p>No bookings match the selected filter.</p>
              <Link href="/emergency">
                <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]">
                  Book Service Now
                </Button>
              </Link>
            </Card>
          ) : (
            filteredBookings.map((bkg) => (
              <Card key={bkg.id} hoverEffect className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-[#E6E8E5]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#687474]">{bkg.booking_number}</span>
                    <Badge status={bkg.status} />
                    <span className="text-[11px] text-[#687474]">
                      • {new Date(bkg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#252B2B]">{bkg.issue_title}</h3>
                    <p className="text-xs text-[#687474] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                      <span className="truncate max-w-md">{bkg.location.address}</span>
                    </p>
                  </div>

                  <div className="text-xs text-[#687474] flex items-center gap-4">
                    <span>Specialist: <strong className="text-[#252B2B]">{bkg.provider_name || 'Dispatched Specialist'}</strong></span>
                    <span>Total: <strong className="text-[#252B2B]">₹{bkg.total_amount}</strong></span>
                    <span className="capitalize text-[#21845B] font-semibold">{bkg.payment_status}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                  <Link href={`/tracking/${bkg.id}`} className="w-full sm:w-auto">
                    <Button variant="primary" size="sm" className="w-full bg-[#0F766E] hover:bg-[#0D645E]" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Live Tracking
                    </Button>
                  </Link>
                  <Link href={`/checkout/${bkg.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      Invoice
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
