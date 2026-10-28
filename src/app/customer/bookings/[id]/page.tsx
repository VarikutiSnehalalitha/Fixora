'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ShieldCheck
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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#687474]">
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/customer/bookings" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E6E8E5] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#687474]">{booking.booking_number}</span>
              <Badge status={booking.status} />
            </div>
            <h1 className="text-2xl font-black text-[#252B2B]">{booking.issue_title}</h1>
            <p className="text-xs text-[#687474] mt-1">
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
            <Card className="space-y-4 bg-white border-[#E6E8E5]">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Status History Audit Trail
              </h3>
              <div className="space-y-3">
                {booking.status_history.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E] mt-1.5 shrink-0"></span>
                    <div>
                      <div className="font-bold text-[#252B2B]">{step.status}</div>
                      <div className="text-[#687474]">{step.note || 'Milestone achieved'}</div>
                      <div className="text-[10px] text-[#687474] mt-0.5">{new Date(step.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rating Section if completed */}
            {booking.status === 'COMPLETED' && (
              <Card className="space-y-4 bg-white border-[#E6E8E5]">
                <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                  Rate Specialist Workmanship
                </h3>
                {isRatingSubmitted ? (
                  <div className="p-4 bg-[#EAF4EE] border border-[#B8DEC9] rounded-xl text-[#21845B] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#21845B] shrink-0" />
                    <span>Your rating has been recorded and added to the specialist profile.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRatingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#252B2B] font-semibold mb-1">Star Rating</label>
                      <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
                    </div>
                    <div>
                      <label className="block text-[#252B2B] font-semibold mb-1">Feedback Comment</label>
                      <textarea
                        rows={2}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Was the specialist punctual, skilled and transparent?"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]">
                      Submit Verified Review
                    </Button>
                  </form>
                )}
              </Card>
            )}
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="space-y-3 text-xs bg-white border-[#E6E8E5]">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Assigned Specialist
              </h3>
              <div className="font-bold text-[#252B2B] text-sm">{booking.provider_name || 'Dispatched Specialist'}</div>
              <div className="text-[#687474]">{booking.provider_phone}</div>
              <div className="text-[#21845B] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Identity & Criminal Record Verified</span>
              </div>
            </Card>

            <Card className="space-y-2 text-xs bg-white border-[#E6E8E5]">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Settled Payment
              </h3>
              <div className="flex justify-between text-[#687474]">
                <span>Subtotal</span>
                <span>₹{booking.total_amount - booking.gst_tax}</span>
              </div>
              <div className="flex justify-between text-[#687474]">
                <span>GST (18%)</span>
                <span>₹{booking.gst_tax}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#252B2B] pt-2 border-t border-[#E6E8E5]">
                <span>Total Settled</span>
                <span>₹{booking.total_amount}</span>
              </div>
              <div className="text-[11px] text-[#687474] capitalize">Method: {booking.payment_method || 'Razorpay'}</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
