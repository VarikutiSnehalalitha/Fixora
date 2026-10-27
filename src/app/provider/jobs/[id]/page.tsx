'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, BookingStatus } from '@/types';

export default function ProviderJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [arrivalOtpInput, setArrivalOtpInput] = useState('');
  const [completionOtpInput, setCompletionOtpInput] = useState('');

  // Quote form state
  const [diagnosisNotes, setDiagnosisNotes] = useState('Physical inspection completed. Defective parts identified.');
  const [quoteItems, setQuoteItems] = useState([
    { description: 'Replacement OEM Component', type: 'part' as const, unit_price: 650, quantity: 1 },
    { description: 'Labour & Technical Installation', type: 'labour' as const, unit_price: 350, quantity: 1 }
  ]);

  const loadBooking = () => {
    const data = fixNowStore.getBookingById(bookingId);
    if (data) setBooking({ ...data });
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading job details...
      </div>
    );
  }

  const handleUpdateStatus = async (status: BookingStatus, note?: string) => {
    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, actorRole: 'mechanic' })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
      } else {
        alert(data.error || 'Status update failed');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleVerifyArrivalOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ARRIVED',
          otp: arrivalOtpInput,
          note: 'Technician verified arrival via customer OTP'
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
        alert('Arrival OTP Confirmed! You can now begin diagnosis.');
      } else {
        alert(data.error || 'Invalid OTP code');
      }
    } catch (e: any) {
      alert('Error verifying OTP: ' + e.message);
    }
  };

  const handleVerifyCompletionOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          otp: completionOtpInput,
          note: 'Job completed and validated with customer completion OTP'
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
        alert('Job marked as completed successfully! Payout credited to wallet.');
      } else {
        alert(data.error || 'Invalid Completion OTP');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          providerId: booking.provider_id || 'prov-001',
          diagnosisNotes,
          items: quoteItems
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
        alert('Itemized estimate dispatched to customer app for digital approval!');
      } else {
        alert(data.error || 'Failed to submit quote');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleAddQuoteItem = () => {
    setQuoteItems([
      ...quoteItems,
      { description: 'Additional Part/Service', type: 'part', unit_price: 200, quantity: 1 }
    ]);
  };

  const handleRemoveQuoteItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/provider/jobs" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500">{booking.booking_number}</span>
              <Badge status={booking.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{booking.issue_title}</h1>
            <p className="text-xs text-slate-500 mt-1">Customer: {booking.customer_name} • {booking.customer_phone}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://maps.google.com/?q=${booking.location.lat},${booking.location.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="sm" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
                GPS Directions
              </Button>
            </a>
            <a href={`tel:${booking.customer_phone}`}>
              <Button variant="primary" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                Call Customer
              </Button>
            </a>
          </div>
        </div>

        {/* WORKFLOW ACTION TERMINAL */}
        <Card className="space-y-6 p-6 border-l-4 border-l-brand-600 bg-white">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Specialist Action Workflow Terminal</span>
            <span className="text-xs font-semibold text-brand-600">Step Progression</span>
          </h2>

          {/* 1. If assigned -> Mark En Route */}
          {booking.status === 'PROVIDER_ASSIGNED' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                You have been assigned this emergency task. Click below when you depart with your recovery tools:
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleUpdateStatus('PROVIDER_EN_ROUTE', 'Provider departed shop with tools')}
              >
                Mark Departure (En Route to Customer)
              </Button>
            </div>
          )}

          {/* 2. If En Route -> Ask Customer for 4-digit Arrival OTP */}
          {booking.status === 'PROVIDER_EN_ROUTE' && (
            <form onSubmit={handleVerifyArrivalOtp} className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Arrived at Customer Location?</span>
                </div>
                <p className="text-xs text-slate-300">
                  Ask the customer for their 4-digit arrival verification code shown on their app screen.
                </p>
              </div>

              <div className="flex items-center gap-3 max-w-sm">
                <input
                  type="text"
                  maxLength={4}
                  value={arrivalOtpInput}
                  onChange={(e) => setArrivalOtpInput(e.target.value)}
                  placeholder="Enter 4-Digit Arrival OTP"
                  className="px-3.5 py-2.5 text-base font-mono font-bold tracking-widest text-center bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
                <Button type="submit" variant="primary" size="md">
                  Verify & Check In
                </Button>
              </div>
            </form>
          )}

          {/* 3. If Arrived -> Begin Diagnosis */}
          {booking.status === 'ARRIVED' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Arrival OTP verified. You are checked in at the customer location.</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleUpdateStatus('DIAGNOSING', 'Beginning physical inspection and diagnostics')}
              >
                Begin Physical Diagnosis
              </Button>
            </div>
          )}

          {/* 4. If Diagnosing -> Form to submit Itemized Quote */}
          {booking.status === 'DIAGNOSING' && (
            <form onSubmit={handleSubmitQuote} className="space-y-5">
              <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-xl">
                Diagnostic mode active. Enter parts and labour estimates for customer digital approval:
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnosis Notes</label>
                <textarea
                  rows={2}
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">Itemized Spare Parts & Labour</label>
                  <button
                    type="button"
                    onClick={handleAddQuoteItem}
                    className="text-xs text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].description = e.target.value;
                          setQuoteItems(updated);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].type = e.target.value as any;
                          setQuoteItems(updated);
                        }}
                        className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="part">Part</option>
                        <option value="labour">Labour</option>
                      </select>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].unit_price = Number(e.target.value);
                          setQuoteItems(updated);
                        }}
                        className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveQuoteItem(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" leftIcon={<FileText className="w-4 h-4" />}>
                Submit Quote for Customer Approval
              </Button>
            </form>
          )}

          {/* 5. If Quote Pending -> Waiting for customer */}
          {booking.status === 'QUOTE_PENDING' && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Estimate Dispatched</span>
              </div>
              <p>Waiting for the customer to review and tap approve on their device screen.</p>
            </div>
          )}

          {/* 6. If Quote Approved -> Start Work */}
          {booking.status === 'QUOTE_APPROVED' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Customer approved the quote of ₹{booking.total_amount}.</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleUpdateStatus('IN_PROGRESS', 'Beginning repair procedure')}
              >
                Start Repair Work
              </Button>
            </div>
          )}

          {/* 7. If In Progress -> Complete with Completion OTP */}
          {booking.status === 'IN_PROGRESS' && (
            <form onSubmit={handleVerifyCompletionOtp} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
                <div className="text-xs font-bold text-blue-900">Finished the Repair Work?</div>
                <p className="text-xs text-blue-700">
                  Ask customer for their final 4-digit completion code to close the job and release funds.
                </p>
              </div>

              <div className="flex items-center gap-3 max-w-sm">
                <input
                  type="text"
                  maxLength={4}
                  value={completionOtpInput}
                  onChange={(e) => setCompletionOtpInput(e.target.value)}
                  placeholder="Enter Completion OTP"
                  className="px-3.5 py-2.5 text-base font-mono font-bold tracking-widest text-center bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
                <Button type="submit" variant="primary" size="md">
                  Verify & Finish Job
                </Button>
              </div>
            </form>
          )}

          {/* 8. If Completed */}
          {booking.status === 'COMPLETED' && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Job completed, verified with OTP, and customer billed.</span>
              </div>
              <span className="font-extrabold text-sm text-emerald-800">
                Payout: ₹{booking.provider_payout}
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
