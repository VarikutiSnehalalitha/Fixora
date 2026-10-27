'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking } from '@/types';

export default function ProviderJobsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Current provider jobs
    const all = fixNowStore.getBookings();
    setBookings(all);
  }, []);

  const handleAcceptJob = (bookingId: string) => {
    const prov = fixNowStore.getProviders()[0];
    const res = fixNowStore.updateBookingStatus(
      bookingId,
      'PROVIDER_ASSIGNED',
      `Accepted by specialist ${prov.name}`,
      {
        provider_id: prov.id,
        provider_name: prov.name,
        provider_phone: prov.phone,
        provider_rating: prov.rating
      }
    );
    if (res.success) {
      alert('Job Accepted! Navigating to Job Action Terminal.');
      setBookings(fixNowStore.getBookings());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Job Requests & Assignments</h1>
          <p className="text-xs text-slate-500">Live feed of roadside emergency requests within your service perimeter.</p>
        </div>

        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{b.booking_number}</span>
                  <Badge status={b.status} />
                  <span className="text-xs text-slate-400">• {new Date(b.created_at).toLocaleTimeString()}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{b.issue_title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.location.address}</span>
                  </p>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-4">
                  <span>Customer: <strong>{b.customer_name}</strong></span>
                  <span>Vehicle/Appliance: <strong>{b.vehicle_details ? `${b.vehicle_details.make} ${b.vehicle_details.model}` : b.appliance_details ? `${b.appliance_details.brand} ${b.appliance_details.category}` : 'N/A'}</strong></span>
                  <span>Payout: <strong className="text-emerald-700">₹{b.provider_payout}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                {b.status === 'SEARCHING' || b.status === 'REQUESTED' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcceptJob(b.id)}
                    className="w-full md:w-auto"
                  >
                    Accept Job
                  </Button>
                ) : (
                  <Link href={`/provider/jobs/${b.id}`} className="w-full md:w-auto">
                    <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Open Job Terminal
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
