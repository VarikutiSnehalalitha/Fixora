'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  ArrowRight,
  ShieldCheck,
  Star
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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const data = fixNowStore.getBookingById(bookingId);
    if (data) setBooking(data);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading confirmation...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <Badge variant="success">Confirmed & Dispatched</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Booking Successfully Recorded
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Order Reference: <strong className="font-mono text-slate-800">{booking.booking_number}</strong>
          </p>
        </div>

        <Card className="text-left space-y-4 p-6 bg-white">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Service Summary</span>
            <span className="font-extrabold text-sm text-slate-900">₹{booking.total_amount}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Service Category:</span>
              <span className="font-bold text-slate-900">{booking.issue_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Specialist:</span>
              <span className="font-bold text-slate-900">{booking.provider_name || 'Assigned Specialist'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service Location:</span>
              <span className="font-bold text-slate-900 text-right max-w-[220px] truncate">{booking.location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-600 capitalize">{booking.payment_status}</span>
            </div>
          </div>

          {/* Handover OTP reminder */}
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-rose-900">Arrival Verification Code</div>
              <div className="text-[11px] text-rose-700">Provide this to the technician upon arrival</div>
            </div>
            <div className="text-lg font-black font-mono text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200">
              {booking.arrival_otp}
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href={`/tracking/${booking.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Live GPS Tracker
            </Button>
          </Link>
          <Link href="/customer/bookings" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              View All Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
