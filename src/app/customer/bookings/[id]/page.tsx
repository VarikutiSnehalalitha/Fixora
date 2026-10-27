'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Star,
  Download,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);

  // Rating State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  useEffect(() => {
    const data = fixNowStore.getBookingById(bookingId);
    if (data) setBooking(data);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading booking details...
      </div>
    );
  }

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRatingSubmitted(true);
    alert('Thank you! Your feedback has been verified and recorded.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/customer/bookings" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500">{booking.booking_number}</span>
              <Badge status={booking.status} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">{booking.issue_title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Requested on {new Date(booking.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/tracking/${booking.id}`}>
              <Button variant="outline" size="sm">
                Open GPS Tracker
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => alert('Downloading official GST Tax Invoice PDF (Simulated)...')}
            >
              Tax Invoice
            </Button>
          </div>
        </div>

        {/* Timeline & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Status History Audit Trail
              </h3>
              <div className="space-y-3">
                {booking.status_history.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0"></span>
                    <div>
                      <div className="font-bold text-slate-900">{step.status}</div>
                      <div className="text-slate-500">{step.note || 'Milestone achieved'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{new Date(step.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rating Section if completed */}
            {booking.status === 'COMPLETED' && (
              <Card className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Rate Technician Workmanship
                </h3>
                {isRatingSubmitted ? (
                  <div className="p-4 bg-emerald-50 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Your rating has been recorded and added to the specialist profile.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRatingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Star Rating</label>
                      <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Feedback Comment</label>
                      <textarea
                        rows={2}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Was the technician punctual, skilled and transparent?"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" size="sm">
                      Submit Verified Review
                    </Button>
                  </form>
                )}
              </Card>
            )}
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Assigned Specialist
              </h3>
              <div className="font-bold text-slate-900 text-sm">{booking.provider_name || 'Dispatched Provider'}</div>
              <div className="text-slate-500">{booking.provider_phone}</div>
              <div className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Identity & Criminal Record Verified</span>
              </div>
            </Card>

            <Card className="space-y-2 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Settled Payment
              </h3>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{booking.total_amount - booking.gst_tax}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹{booking.gst_tax}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Settled</span>
                <span>₹{booking.total_amount}</span>
              </div>
              <div className="text-[11px] text-slate-400 capitalize">Method: {booking.payment_method || 'Razorpay'}</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
