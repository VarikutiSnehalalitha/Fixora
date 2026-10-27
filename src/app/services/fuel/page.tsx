'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Fuel,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Info,
  ArrowRight,
  Navigation,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { PESO_REGULATIONS } from '@/lib/constants';
import {
  validateFuelRequest,
  NEARBY_AUTHORIZED_PETROL_PUMPS
} from '@/lib/fuel-compliance';
import { calculatePricing } from '@/lib/pricing';

export default function FuelServicePage() {
  const router = useRouter();

  const [fuelType, setFuelType] = useState<'diesel' | 'petrol'>('diesel');
  const [quantityLiters, setQuantityLiters] = useState<number>(10);
  const [vehicleType, setVehicleType] = useState('car');
  const [licensePlate, setLicensePlate] = useState('KA 05 MN 4821');
  const [emergencyReason, setEmergencyReason] = useState('Ran dry on highway flyover due to sensor delay');
  const [address, setAddress] = useState('Outer Ring Road, Near Bellandur Junction, Bengaluru');
  const [agreedToPESORules, setAgreedToPESORules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate request against PESO guidelines
  const validation = validateFuelRequest(fuelType, quantityLiters, vehicleType);

  const pricing = calculatePricing({
    serviceType: 'emergency_fuel',
    categoryBasePrice: fuelType === 'diesel' ? 250 : 300,
    distanceKm: 4,
    fuelType,
    fuelQuantityLiters: quantityLiters,
    isEmergency: true
  });

  const handleFuelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPESORules) {
      alert('You must acknowledge the statutory PESO Petroleum Rules 2002 regulatory requirements.');
      return;
    }

    if (!validation.isCompliant) {
      alert(validation.warnings[0] || 'Quantity exceeds statutory limit');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'emergency_fuel',
          category: fuelType === 'diesel' ? 'emergency-diesel' : 'emergency-petrol',
          issueTitle: `Emergency ${quantityLiters}L ${fuelType.toUpperCase()} Roadside Supply`,
          issueDescription: emergencyReason,
          basePrice: fuelType === 'diesel' ? 250 : 300,
          distanceKm: 4,
          vehicleDetails: {
            type: vehicleType,
            licensePlate
          },
          fuelDetails: {
            fuel_type: fuelType,
            quantity_liters: quantityLiters,
            authorized_container_verified: true,
            reason_for_emergency: emergencyReason
          },
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
        alert(data.error || 'Failed to dispatch fuel partner');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="emergency">PESO Regulated Module</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Emergency Roadside Fuel Supply
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Statutory roadside assistance delivered exclusively by certified, PESO-inspected mobile partners in approved containers.
          </p>
        </div>

        {/* Regulatory Disclosure Alert */}
        <AlertBanner type="warning" title="PESO Regulatory Safety Standard & Quantity Caps">
          <p className="mb-2">{PESO_REGULATIONS.STATUTORY_WARNING}</p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li><strong>Diesel:</strong> Permitted up to <strong>20 Litres</strong> per roadside incident in certified heavy-duty containers or mobile bowsers.</li>
            <li><strong>Petrol (Class A, Highly Inflammable):</strong> Permitted up to <strong>5 Litres maximum</strong> strictly in factory-sealed, PESO-approved steel emergency canisters to reach the nearest pump.</li>
            <li>Loose plastic cans, bottles, or informal resale are strictly prohibited under Indian law.</li>
          </ul>
        </AlertBanner>

        <form onSubmit={handleFuelBooking} className="space-y-6">
          <Card className="space-y-6">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              1. Fuel Type & Stranded Vehicle Details
            </h3>

            {/* Fuel Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFuelType('diesel');
                  if (quantityLiters > 20) setQuantityLiters(20);
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  fuelType === 'diesel'
                    ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center font-bold">
                    D
                  </div>
                  <Badge variant="info">Up to 20L Max</Badge>
                </div>
                <div className="font-bold text-slate-900 text-base">Emergency Diesel</div>
                <div className="text-xs text-slate-500 mt-1">₹{PESO_REGULATIONS.DIESEL_BASE_PRICE_PER_LITER}/L + HazMat Transport</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFuelType('petrol');
                  if (quantityLiters > 5) setQuantityLiters(5);
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  fuelType === 'petrol'
                    ? 'border-red-800 bg-red-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center font-bold">
                    P
                  </div>
                  <Badge variant="emergency">Strict 5L Cap</Badge>
                </div>
                <div className="font-bold text-slate-900 text-base">Emergency Petrol</div>
                <div className="text-xs text-slate-500 mt-1">₹{PESO_REGULATIONS.PETROL_BASE_PRICE_PER_LITER}/L • Sealed Safety Can</div>
              </button>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Quantity (Statutory Caps Enforced)
              </label>
              <div className="flex flex-wrap gap-3">
                {fuelType === 'diesel' ? (
                  [5, 10, 15, 20].map((liters) => (
                    <button
                      key={liters}
                      type="button"
                      onClick={() => setQuantityLiters(liters)}
                      className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        quantityLiters === liters
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {liters} Litres
                    </button>
                  ))
                ) : (
                  [2.5, 5].map((liters) => (
                    <button
                      key={liters}
                      type="button"
                      onClick={() => setQuantityLiters(liters)}
                      className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        quantityLiters === liters
                          ? 'border-red-800 bg-red-800 text-white'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {liters} Litres (Max Cap)
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Vehicle Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="car">Passenger Car / SUV</option>
                  <option value="bike">Two-Wheeler / Motorcycle</option>
                  <option value="commercial">Light Commercial Vehicle (LCV)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">License Plate Number</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="KA 05 MN 4821"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono tracking-wider focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Stranded Emergency</label>
                <input
                  type="text"
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="e.g. Fuel gauge failure, stranded between highway toll gates"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Delivery Coordinates / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm mb-1">Estimated Cost Breakdown</div>
              <div className="flex justify-between text-slate-600">
                <span>Fuel Cost ({quantityLiters}L @ ₹{fuelType === 'diesel' ? PESO_REGULATIONS.DIESEL_BASE_PRICE_PER_LITER : PESO_REGULATIONS.PETROL_BASE_PRICE_PER_LITER}/L)</span>
                <span>₹{Math.round(quantityLiters * (fuelType === 'diesel' ? PESO_REGULATIONS.DIESEL_BASE_PRICE_PER_LITER : PESO_REGULATIONS.PETROL_BASE_PRICE_PER_LITER))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Certified Hazardous Delivery & Base Fee</span>
                <span>₹{pricing.baseCharge + PESO_REGULATIONS.HAZARDOUS_DELIVERY_SURCHARGE}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18%)</span>
                <span>₹{pricing.gstTax}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{pricing.totalAmount}</span>
              </div>
            </div>

            {/* Statutory Checkbox */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPESORules}
                  onChange={(e) => setAgreedToPESORules(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-amber-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs text-amber-900 leading-relaxed">
                  I certify under penalty of law that this fuel is required solely for an emergency stranded vehicle on the roadside, and I agree to verify delivery with the 4-digit OTP code provided to the PESO-authorized delivery team.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="emergency"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<Fuel className="w-5 h-5" />}
            >
              Dispatch Certified PESO Fuel Partner
            </Button>
          </Card>
        </form>

        {/* Fallback Section: Nearby Authorized Fuel Pumps */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Nearby 24/7 Verified Petrol Stations</h3>
              <p className="text-xs text-slate-500">
                If mobile delivery is unavailable or you are within pushing/walking distance:
              </p>
            </div>
            <Badge variant="neutral">Direct Drive Alternative</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEARBY_AUTHORIZED_PETROL_PUMPS.map((pump, idx) => (
              <Card key={idx} className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {pump.brand}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{pump.distanceKm} km away</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{pump.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pump.address}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{pump.contactNumber}</span>
                  <a
                    href={`https://maps.google.com/?q=${pump.lat},${pump.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <span>Maps</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
