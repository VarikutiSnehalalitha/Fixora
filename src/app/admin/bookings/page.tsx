'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, BookingStatus } from '@/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = () => {
    setBookings([...fixNowStore.getBookings()]);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleForceStatus = (bookingId: string, status: BookingStatus) => {
    fixNowStore.updateBookingStatus(bookingId, status, `Admin forced status to ${status}`);
    loadBookings();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-[#687474] hover:text-[#252B2B] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Live Dispatch & Bookings Monitor</h1>
          <p className="text-xs text-[#687474]">Real-time state machine monitor, cancellations, and manual re-assignment overrides.</p>
        </div>

        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5 space-y-3 bg-white border border-[#E6E8E5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E8E5] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#687474]">{b.booking_number}</span>
                    <Badge status={b.status} />
                    <span className="text-xs text-[#687474]">• Created: {new Date(b.created_at).toLocaleTimeString()}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#252B2B] mt-1">{b.issue_title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/tracking/${b.id}`}>
                    <Button variant="outline" size="sm">
                      Open Live GPS Tracker
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#687474] block">Customer</span>
                  <span className="font-bold text-[#252B2B]">{b.customer_name} ({b.customer_phone})</span>
                </div>
                <div>
                  <span className="text-[#687474] block">Assigned Specialist</span>
                  <span className="font-bold text-[#252B2B]">{b.provider_name || 'Awaiting Match'}</span>
                </div>
                <div>
                  <span className="text-[#687474] block">Total Amount</span>
                  <span className="font-bold text-[#252B2B]">₹{b.total_amount} ({b.payment_status.toUpperCase()})</span>
                </div>
              </div>

              {/* Force status controls */}
              <div className="pt-2 border-t border-[#E6E8E5] flex items-center justify-between text-xs">
                <span className="text-[#687474] font-semibold">Admin State Machine Override:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleForceStatus(b.id, 'COMPLETED')}
                    className="px-2.5 py-1 rounded bg-[#EAF5F2] hover:bg-[#DDEFE7] text-[#0F766E] font-semibold transition-colors"
                  >
                    Force Complete
                  </button>
                  <button
                    onClick={() => handleForceStatus(b.id, 'CANCELLED')}
                    className="px-2.5 py-1 rounded bg-[#B91C35]/10 hover:bg-[#B91C35]/20 text-[#B91C35] font-semibold transition-colors"
                  >
                    Force Cancel
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
