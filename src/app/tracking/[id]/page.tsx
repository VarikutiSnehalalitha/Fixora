'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  AlertTriangle,
  Car,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  MapPin,
  FileText,
  CreditCard,
  XCircle,
  HelpCircle,
  Share2,
  RefreshCw,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { Booking, BookingStatus } from '@/types';

// Dynamically import LiveMap with SSR disabled to prevent Leaflet window reference errors
const LiveMap = dynamic(
  () => import('@/components/map/LiveMap').then((mod) => mod.LiveMap),
  { ssr: false, loading: () => <div className="h-72 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading GPS Map...</div> }
);

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);

  // Status simulation progress
  const [simulatedEta, setSimulatedEta] = useState(12);

  const loadBooking = () => {
    const data = fixNowStore.getBookingById(bookingId);
    if (data) {
      setBooking({ ...data });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBooking();
    const interval = setInterval(loadBooking, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Simulated provider position slightly offset from customer for map demo
  const providerCoords = booking?.provider_id
    ? {
        lat: booking.location.lat + 0.008,
        lng: booking.location.lng - 0.007
      }
    : undefined;

  const handleStatusTransition = async (nextStatus: BookingStatus, note?: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, note })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
      } else {
        alert(data.error || 'Transition failed');
      }
    } catch (e: any) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleApproveQuote = async () => {
    setIsProcessingQuote(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action: 'approve' })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking({ ...data.booking });
        setShowQuoteModal(false);
      }
    } catch (e: any) {
      alert('Error approving quote: ' + e.message);
    } finally {
      setIsProcessingQuote(false);
    }
  };

  const handleCancelBooking = async () => {
    if (confirm('Are you sure you want to cancel this emergency booking?')) {
      handleStatusTransition('CANCELLED', 'Customer cancelled request');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600 mr-2" />
        <span>Loading live tracking telemetry...</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Booking Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No active booking with ID {bookingId} exists in the local database.
        </p>
        <Link href="/" className="mt-4">
          <Button variant="primary" size="sm">
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  const statusSteps: { key: BookingStatus; label: string }[] = [
    { key: 'REQUESTED', label: 'Requested' },
    { key: 'SEARCHING', label: 'Matching' },
    { key: 'PROVIDER_ASSIGNED', label: 'Assigned' },
    { key: 'PROVIDER_EN_ROUTE', label: 'En Route' },
    { key: 'ARRIVED', label: 'Arrived' },
    { key: 'DIAGNOSING', label: 'Diagnosing' },
    { key: 'QUOTE_PENDING', label: 'Quote' },
    { key: 'IN_PROGRESS', label: 'Repairing' },
    { key: 'COMPLETED', label: 'Done' }
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === booking.status);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header & Emergency Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Booking #{booking.booking_number}
              </span>
              <Badge status={booking.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {booking.issue_title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/checkout/${booking.id}`}>
              <Button variant="outline" size="sm" leftIcon={<CreditCard className="w-4 h-4 text-brand-600" />}>
                Invoice & Checkout (₹{booking.total_amount})
              </Button>
            </Link>

            {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelBooking}
              >
                Cancel Job
              </Button>
            )}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="min-w-[650px] flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            {statusSteps.map((s, index) => {
              const isPast = index <= currentStepIndex;
              const isCurrent = s.key === booking.status;
              return (
                <div key={s.key} className="flex flex-col items-center relative z-10 bg-white px-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-red-800 text-white ring-4 ring-red-100 scale-110 shadow-sm'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isCurrent ? 'text-red-900 font-bold' : isPast ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Pending Alert Banner if waiting for approval */}
        {booking.status === 'QUOTE_PENDING' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-xs font-extrabold uppercase tracking-wide text-amber-900">
                  Action Required: Itemized Quote Ready for Approval
                </span>
              </div>
              <p className="text-xs text-amber-800">
                The technician completed physical diagnosis. Review the breakdown of OEM spare parts, labor, and warranty before work commences.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowQuoteModal(true)}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Review & Approve Quote (₹{booking.total_amount})
            </Button>
          </div>
        )}

        {/* Main Grid: Map & Provider info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emergency-600" />
                  <span className="text-xs font-bold text-slate-700">Live GPS Telemetry</span>
                </div>
                {booking.provider_id && (
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ETA: ~{booking.estimated_arrival_minutes || simulatedEta} Mins
                  </span>
                )}
              </div>

              <LiveMap
                customerCoords={booking.location}
                providerCoords={providerCoords}
                height="380px"
              />

              <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                <span>Location: {booking.location.address}</span>
                {booking.location.landmark && <span>Near: {booking.location.landmark}</span>}
              </div>
            </div>

            {/* Test Simulation Controls */}
            <Card className="bg-slate-900 text-white border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Dev Status Simulation Bar
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Simulate physical job milestones</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleStatusTransition('PROVIDER_EN_ROUTE', 'Provider in transit with toolkit')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                >
                  1. Mark En Route
                </button>
                <button
                  onClick={() => handleStatusTransition('ARRIVED', 'Provider reached customer')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                >
                  2. Mark Arrived
                </button>
                <button
                  onClick={() => handleStatusTransition('DIAGNOSING', 'Inspecting vehicle')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                >
                  3. Diagnosing
                </button>
                <button
                  onClick={() => handleStatusTransition('IN_PROGRESS', 'Work in progress')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                >
                  4. In Progress
                </button>
                <button
                  onClick={() => handleStatusTransition('COMPLETED', 'Job completed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                >
                  5. Complete Job
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column: Provider & OTP Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Arrival OTP Display Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white rounded-2xl p-6 shadow-xl border border-red-800/60 space-y-3">
              <div className="flex items-center justify-between text-xs text-red-200 font-bold uppercase tracking-wide">
                <span>Arrival Verification Code</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-center py-2">
                <div className="text-4xl font-black tracking-widest font-mono text-white">
                  {booking.arrival_otp}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Share this 4-digit code ONLY when the technician physically arrives
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-white">
                  {booking.is_arrival_verified ? '✓ Verified on Arrival' : 'Awaiting Arrival'}
                </span>
              </div>
            </div>

            {/* Provider Profile Card */}
            <Card className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Assigned Verified Specialist
              </h3>

              {booking.provider_id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold text-lg">
                      {booking.provider_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {booking.provider_name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700">4.9</span>
                        <span>(140+ verified jobs)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${booking.provider_phone || '+919811122334'}`}
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Call Specialist
                      </Button>
                    </a>
                    <button
                      onClick={() => alert(`Masked secure dialer initiated to ${booking.provider_phone}`)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-slate-400 animate-spin" />
                  Broadcasting dispatch request to nearest verified specialists...
                </div>
              )}
            </Card>

            {/* Vehicle / Appliance Details */}
            <Card className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Target Asset
              </h3>
              {booking.vehicle_details ? (
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">
                    {booking.vehicle_details.make} {booking.vehicle_details.model}
                  </div>
                  <div className="text-slate-500">Plate: {booking.vehicle_details.licensePlate || booking.vehicle_details.license_plate}</div>
                  <div className="text-slate-500 uppercase">Category: {booking.vehicle_details.type}</div>
                </div>
              ) : booking.appliance_details ? (
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">
                    {booking.appliance_details.brand} {booking.appliance_details.category}
                  </div>
                  <div className="text-slate-500">Model: {booking.appliance_details.model_number || 'N/A'}</div>
                </div>
              ) : (
                <div className="text-slate-500">{booking.issue_description}</div>
              )}
            </Card>

            {/* Financial Summary */}
            <Card className="space-y-2 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Financial Summary
              </h3>
              <div className="flex justify-between text-slate-600">
                <span>Base Charge</span>
                <span>₹{booking.base_charge}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Distance Allowance</span>
                <span>₹{booking.distance_charge}</span>
              </div>
              {booking.parts_charge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Parts & Spares</span>
                  <span>₹{booking.parts_charge}</span>
                </div>
              )}
              {booking.labour_charge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Labour Charges</span>
                  <span>₹{booking.labour_charge}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹{booking.gst_tax}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-100">
                <span>Current Total</span>
                <span>₹{booking.total_amount}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quote Approval Modal */}
      {booking.quote && (
        <Modal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title="Digital Service Estimate & Parts Quote"
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-slate-900">Technician Diagnosis Notes</div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {booking.quote.diagnosis_notes}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 mb-2">Itemized Breakdown</div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {booking.quote.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{item.description}</div>
                      <div className="text-slate-500 capitalize">{item.type} • Qty: {item.quantity}</div>
                    </div>
                    <div className="font-extrabold text-slate-900">₹{item.total}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <span>Service Warranty Coverage</span>
              <span className="font-bold">{booking.quote.warranty_days} Days Free Guarantee</span>
            </div>

            <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
              <span>Approved Total Amount (incl. 18% GST)</span>
              <span>₹{booking.quote.total_amount}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowQuoteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isProcessingQuote}
                onClick={handleApproveQuote}
              >
                Approve & Begin Repairs
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
