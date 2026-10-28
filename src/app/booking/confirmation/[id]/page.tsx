'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    const data = fixNowStore.getBookingById(bookingId);
    if (data) setBooking(data);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#687474]">
        Loading confirmation...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 bg-[#EAF4EE] text-[#21845B] rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#B8DEC9]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <Badge variant="success">Confirmed & Dispatched</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252B2B]">
            Booking Successfully Recorded
          </h1>
          <p className="text-xs sm:text-sm text-[#687474]">
            Order Reference: <strong className="font-mono text-[#252B2B]">{booking.booking_number}</strong>
          </p>
        </div>

        <Card className="text-left space-y-4 p-6 bg-white border-[#E6E8E5]">
          <div className="border-b border-[#E6E8E5] pb-3 flex justify-between items-center">
            <span className="text-xs font-bold text-[#687474] uppercase">Service Summary</span>
            <span className="font-extrabold text-sm text-[#252B2B]">₹{booking.total_amount}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#687474]">Service Category:</span>
              <span className="font-bold text-[#252B2B]">{booking.issue_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687474]">Specialist:</span>
              <span className="font-bold text-[#252B2B]">{booking.provider_name || 'Assigned Specialist'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687474]">Service Location:</span>
              <span className="font-bold text-[#252B2B] text-right max-w-[220px] truncate">{booking.location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687474]">Payment Status:</span>
              <span className="font-bold text-[#21845B] capitalize">{booking.payment_status}</span>
            </div>
          </div>

          {/* Handover OTP card - Refined teal style */}
          <div className="p-3 bg-[#EAF5F2] rounded-xl border border-[#A7D9CD] flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#0F766E]">Arrival Verification Code</div>
              <div className="text-[11px] text-[#525D5D]">Provide this to the technician upon arrival</div>
            </div>
            <div className="text-lg font-black font-mono text-[#0F766E] bg-white px-2.5 py-1 rounded-lg border border-[#A7D9CD]">
              {booking.arrival_otp}
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href={`/tracking/${booking.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full bg-[#0F766E] hover:bg-[#0D645E]" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Live GPS Tracking
            </Button>
          </Link>
          <Link href="/customer/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              Customer Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
