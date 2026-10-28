'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Car,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  XCircle,
  Share2,
  RefreshCw,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { Booking, BookingStatus } from '@/types';

// Dynamically import LiveMap with SSR disabled
const LiveMap = dynamic(
  () => import('@/components/map/LiveMap').then((mod) => mod.LiveMap),
  { ssr: false, loading: () => <div className="h-72 bg-[#FAF9F6] border border-[#E6E8E5] rounded-2xl flex items-center justify-center text-xs text-[#687474]">Loading GPS Map...</div> }
);

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);

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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#687474]">
        <RefreshCw className="w-6 h-6 animate-spin text-[#0F766E] mr-2" />
        <span>Loading live telemetry...</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-12 h-12 text-[#B91C35] mb-3" />
        <h2 className="text-xl font-bold text-[#252B2B]">Booking Not Found</h2>
        <p className="text-xs text-[#687474] mt-1 max-w-sm">
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E6E8E5] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#687474] uppercase">
                Booking #{booking.booking_number}
              </span>
              <Badge status={booking.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#252B2B]">
              {booking.issue_title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/checkout/${booking.id}`}>
              <Button variant="outline" size="sm" leftIcon={<CreditCard className="w-4 h-4 text-[#0F766E]" />}>
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
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E6E8E5] shadow-sm overflow-x-auto">
          <div className="min-w-[650px] flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E6E8E5] -translate-y-1/2 z-0"></div>
            {statusSteps.map((s, index) => {
              const isPast = index <= currentStepIndex;
              const isCurrent = s.key === booking.status;
              return (
                <div key={s.key} className="flex flex-col items-center relative z-10 bg-white px-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#0F766E] text-white ring-4 ring-[#EAF5F2] scale-110 shadow-sm'
                        : isPast
                        ? 'bg-[#21845B] text-white'
                        : 'bg-[#FAF9F6] border border-[#E6E8E5] text-[#687474]'
                    }`}
                  >
                    {isPast && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isCurrent ? 'text-[#0F766E] font-bold' : isPast ? 'text-[#252B2B]' : 'text-[#687474]'
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
          <div className="bg-[#FEF9EE] border-2 border-[#FBE2AC] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99119] animate-ping"></span>
                <span className="font-bold text-sm text-[#753E0A]">
                  New Digital Repair Quote Pending Approval
                </span>
              </div>
              <p className="text-xs text-[#753E0A]">
                The technician has inspected the issue and prepared an itemized quote of ₹{booking.quote?.total_amount}. Work begins only after your confirmation.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowQuoteModal(true)}
              className="bg-[#0F766E] hover:bg-[#0D645E]"
            >
              Review Itemized Quote
            </Button>
          </div>
        )}

        {/* Main Grid: Left GPS Telemetry & Simulation / Right Specialist Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Live GPS Leaflet Map Component */}
            <Card className="p-0 overflow-hidden border-[#E6E8E5]">
              <LiveMap
                customerCoords={{ lat: booking.location.lat, lng: booking.location.lng }}
                providerCoords={providerCoords}
                height="420px"
              />
            </Card>

            {/* Location & Landmark Information */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6E8E5] flex items-center justify-between text-xs text-[#687474]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <span className="text-[#252B2B] font-medium">Location: {booking.location.address}</span>
                {booking.location.landmark && <span>• Near: {booking.location.landmark}</span>}
              </div>
            </div>

            {/* Clean Test Simulation Controls */}
            <Card className="bg-[#FAF9F6] text-[#252B2B] border-[#E6E8E5] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#21845B]"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#687474]">
                    Interactive Milestone Simulator
                  </span>
                </div>
                <span className="text-[10px] text-[#687474]">Simulate physical job progress</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleStatusTransition('PROVIDER_EN_ROUTE', 'Provider in transit with toolkit')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] text-[#252B2B] border border-[#E6E8E5] font-semibold transition-colors"
                >
                  1. Mark En Route
                </button>
                <button
                  onClick={() => handleStatusTransition('ARRIVED', 'Provider reached customer')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] text-[#252B2B] border border-[#E6E8E5] font-semibold transition-colors"
                >
                  2. Mark Arrived
                </button>
                <button
                  onClick={() => handleStatusTransition('DIAGNOSING', 'Inspecting vehicle')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] text-[#252B2B] border border-[#E6E8E5] font-semibold transition-colors"
                >
                  3. Diagnosing
                </button>
                <button
                  onClick={() => handleStatusTransition('IN_PROGRESS', 'Work in progress')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] text-[#252B2B] border border-[#E6E8E5] font-semibold transition-colors"
                >
                  4. In Progress
                </button>
                <button
                  onClick={() => handleStatusTransition('COMPLETED', 'Job completed')}
                  className="px-3 py-1.5 rounded-lg bg-[#21845B] hover:bg-[#1B6E4B] text-white font-bold transition-colors"
                >
                  5. Complete Job
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column: Provider & OTP Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Arrival OTP Display Card - Replaced neon red with calm, secure teal card */}
            <div className="bg-[#EAF5F2] border border-[#A7D9CD] text-[#252B2B] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-[#0F766E] font-bold uppercase">
                <span>Arrival Verification Code</span>
                <Shield className="w-4 h-4 text-[#0F766E]" />
              </div>
              <div className="text-center py-2">
                <div className="text-4xl font-black tracking-widest font-mono text-[#0F766E]">
                  {booking.arrival_otp}
                </div>
                <div className="text-[11px] text-[#525D5D] mt-1">
                  Share this 4-digit code ONLY when the technician physically arrives
                </div>
              </div>
              <div className="pt-2 border-t border-[#A7D9CD] flex items-center justify-between text-xs text-[#525D5D]">
                <span>Status:</span>
                <span className="font-bold text-[#0F766E]">
                  {booking.is_arrival_verified ? '✓ Verified on Arrival' : 'Awaiting Arrival'}
                </span>
              </div>
            </div>

            {/* Provider Profile Card */}
            <Card className="space-y-4">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Assigned Verified Specialist
              </h3>

              {booking.provider_id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center font-bold text-lg">
                      {booking.provider_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#252B2B] text-sm">
                        {booking.provider_name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#687474] mt-0.5">
                        <Star className="w-3.5 h-3.5 text-[#D99119] fill-[#D99119]" />
                        <span className="font-bold text-[#252B2B]">4.9</span>
                        <span>(140+ verified jobs)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${booking.provider_phone || '+919811122334'}`}
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Call Specialist
                      </Button>
                    </a>
                    <button
                      onClick={() => alert(`Masked secure dialer initiated to ${booking.provider_phone}`)}
                      className="p-2 rounded-xl border border-[#E6E8E5] text-[#687474] hover:bg-[#FAF9F6] transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#687474]">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-[#0F766E] animate-spin" />
                  Broadcasting dispatch request to nearest verified specialists...
                </div>
              )}
            </Card>

            {/* Vehicle / Appliance Details */}
            <Card className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Target Asset
              </h3>
              {booking.vehicle_details ? (
                <div className="space-y-1">
                  <div className="font-bold text-[#252B2B]">
                    {booking.vehicle_details.make} {booking.vehicle_details.model}
                  </div>
                  <div className="text-[#687474]">Plate: {booking.vehicle_details.licensePlate || booking.vehicle_details.license_plate}</div>
                  <div className="text-[#687474] uppercase">Category: {booking.vehicle_details.type}</div>
                </div>
              ) : booking.appliance_details ? (
                <div className="space-y-1">
                  <div className="font-bold text-[#252B2B]">
                    {booking.appliance_details.brand} {booking.appliance_details.category}
                  </div>
                  <div className="text-[#687474]">Model: {booking.appliance_details.model_number || 'N/A'}</div>
                </div>
              ) : (
                <div className="text-[#687474]">{booking.issue_description}</div>
              )}
            </Card>

            {/* Financial Summary */}
            <Card className="space-y-2 text-xs">
              <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
                Financial Summary
              </h3>
              <div className="flex justify-between text-[#687474]">
                <span>Base Charge</span>
                <span>₹{booking.base_charge}</span>
              </div>
              <div className="flex justify-between text-[#687474]">
                <span>Distance Allowance</span>
                <span>₹{booking.distance_charge}</span>
              </div>
              {booking.parts_charge > 0 && (
                <div className="flex justify-between text-[#687474]">
                  <span>Parts & Spares</span>
                  <span>₹{booking.parts_charge}</span>
                </div>
              )}
              {booking.labour_charge > 0 && (
                <div className="flex justify-between text-[#687474]">
                  <span>Labour Charges</span>
                  <span>₹{booking.labour_charge}</span>
                </div>
              )}
              <div className="flex justify-between text-[#687474]">
                <span>GST (18%)</span>
                <span>₹{booking.gst_tax}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#252B2B] pt-2 border-t border-[#E6E8E5]">
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
          <div className="space-y-5 text-xs sm:text-sm text-[#252B2B]">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] space-y-1">
              <div className="font-bold text-[#252B2B]">Specialist Diagnosis Notes</div>
              <p className="text-[#687474] text-xs leading-relaxed">
                {booking.quote.diagnosis_notes}
              </p>
            </div>

            <div>
              <div className="font-bold text-[#252B2B] mb-2">Itemized Breakdown</div>
              <div className="divide-y divide-[#E6E8E5] border border-[#E6E8E5] rounded-xl overflow-hidden">
                {booking.quote.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#252B2B]">{item.description}</div>
                      <div className="text-[#687474] capitalize">{item.type} • Qty: {item.quantity}</div>
                    </div>
                    <div className="font-extrabold text-[#252B2B]">₹{item.total}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#EAF4EE] rounded-xl border border-[#B8DEC9] flex items-center justify-between text-xs text-[#21845B]">
              <span>Service Warranty Coverage</span>
              <span className="font-bold">{booking.quote.warranty_days} Days Free Guarantee</span>
            </div>

            <div className="flex justify-between font-extrabold text-base text-[#252B2B] pt-2 border-t border-[#E6E8E5]">
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
                className="bg-[#0F766E] hover:bg-[#0D645E]"
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
