'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Car,
  Home,
  Fuel,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SERVICE_CATEGORIES, POPULAR_LOCATIONS } from '@/lib/constants';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'vehicle';
  const initialCategory = searchParams.get('category') || '';

  const [serviceType, setServiceType] = useState<'vehicle' | 'appliance' | 'fuel'>(
    initialType as any
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || (serviceType === 'vehicle' ? 'car-breakdown' : 'refrigerator-repair')
  );
  const [bookingMode, setBookingMode] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  
  // Vehicle / Appliance details
  const [brandMake, setBrandMake] = useState('Hyundai Creta');
  const [identNumber, setIdentNumber] = useState('KA 05 MN 4821');
  const [description, setDescription] = useState('Standard inspection and repair service');
  
  // Location
  const [address, setAddress] = useState('Outer Ring Road, Near Bellandur Junction, Bengaluru');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories =
    serviceType === 'vehicle'
      ? SERVICE_CATEGORIES.VEHICLE
      : serviceType === 'appliance'
      ? SERVICE_CATEGORIES.APPLIANCE
      : SERVICE_CATEGORIES.FUEL;

  const currentCatObj = categories.find((c) => c.id === selectedCategory) || categories[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType:
            serviceType === 'vehicle'
              ? 'emergency_vehicle'
              : serviceType === 'appliance'
              ? 'appliance'
              : 'emergency_fuel',
          category: selectedCategory,
          issueTitle: currentCatObj?.title || 'Service Request',
          issueDescription: description,
          basePrice: currentCatObj?.basePrice || 349,
          distanceKm: 3,
          vehicleDetails:
            serviceType === 'vehicle'
              ? { type: 'car', make: brandMake, model: brandMake, licensePlate: identNumber }
              : undefined,
          applianceDetails:
            serviceType === 'appliance'
              ? { category: selectedCategory.replace('-repair', ''), brand: brandMake, model_number: identNumber }
              : undefined,
          location: {
            address,
            city: 'Bengaluru',
            lat: 12.9304,
            lng: 77.6784
          }
        })
      });

      const data = await response.json();
      if (data.success && data.booking) {
        router.push(`/tracking/${data.booking.id}`);
      } else {
        alert(data.error || 'Failed to submit booking');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="info">Online Booking Engine</Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Book a Verified Technician</h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Instant priority dispatch or planned home appointment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-5">
            {/* Service Domain Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Service Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('vehicle');
                    setSelectedCategory('car-breakdown');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    serviceType === 'vehicle'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Car className="w-5 h-5 mx-auto mb-1 text-brand-600" />
                  <span className="text-xs">Vehicle Roadside</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setServiceType('appliance');
                    setSelectedCategory('refrigerator-repair');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    serviceType === 'appliance'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Home className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs">Home Appliance</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setServiceType('fuel');
                    setSelectedCategory('emergency-diesel');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    serviceType === 'fuel'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Fuel className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <span className="text-xs">Emergency Fuel</span>
                </button>
              </div>
            </div>

            {/* Timing: Instant vs Scheduled */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Dispatch Timing</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingMode('instant')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    bookingMode === 'instant'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">⚡ Instant Dispatch (15-30 Mins)</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">Nearest available technician arrives now</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingMode('scheduled')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    bookingMode === 'scheduled'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">📅 Schedule for Later Date</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">Choose preferred slot & technician</div>
                </button>
              </div>
            </div>

            {bookingMode === 'scheduled' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option>09:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Specific Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Subcategory</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (Base ₹{c.basePrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {serviceType === 'vehicle' ? 'Vehicle Make & Model' : 'Appliance Brand & Model'}
                </label>
                <input
                  type="text"
                  value={brandMake}
                  onChange={(e) => setBrandMake(e.target.value)}
                  placeholder={serviceType === 'vehicle' ? 'e.g. Hyundai Creta' : 'e.g. Samsung Inverter'}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {serviceType === 'vehicle' ? 'License Plate Number' : 'Model / Serial Number'}
                </label>
                <input
                  type="text"
                  value={identNumber}
                  onChange={(e) => setIdentNumber(e.target.value)}
                  placeholder={serviceType === 'vehicle' ? 'KA 05 MN 4821' : 'RT34T4513S8'}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Describe the Issue</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Address / GPS Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm Booking & Find Nearest Specialist
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading booking engine...</div>}>
      <BookContent />
    </Suspense>
  );
}
