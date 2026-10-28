'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Wrench,
  AlertTriangle,
  Car,
  Bike,
  Zap,
  Truck,
  BatteryCharging,
  MapPin,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { calculatePricing } from '@/lib/pricing';

function EmergencyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCategory = searchParams.get('category');

  // Step state: 1 = Problem & Vehicle, 2 = GPS & Direction, 3 = Review & Instant Dispatch
  const [step, setStep] = useState(1);

  // Form State
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'suv' | 'ev' | 'commercial'>('car');
  const [makeModel, setMakeModel] = useState('Hyundai Creta');
  const [licensePlate, setLicensePlate] = useState('KA 05 MN 4821');
  const [selectedIssue, setSelectedIssue] = useState(preSelectedCategory || 'battery-jumpstart');
  const [issueDescription, setIssueDescription] = useState('Vehicle unable to crank engine. Battery appears flat.');
  
  // Location
  const [userLat, setUserLat] = useState(12.9304);
  const [userLng, setUserLng] = useState(77.6784);
  const [address, setAddress] = useState('Outer Ring Road, Near Bellandur Junction, Bengaluru');
  const [landmark, setLandmark] = useState('Opposite Shell Fuel Station, Service Road');
  const [directionOfTravel, setDirectionOfTravel] = useState('Heading Northbound towards Marathahalli');
  const [isLocating, setIsLocating] = useState(false);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategoryObj =
    SERVICE_CATEGORIES.VEHICLE.find((c) => c.id === selectedIssue) || SERVICE_CATEGORIES.VEHICLE[0];

  const pricing = calculatePricing({
    serviceType: selectedCategoryObj.type,
    categoryBasePrice: selectedCategoryObj.basePrice,
    distanceKm: 4,
    isEmergency: true
  });

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          setAddress(`Current GPS Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => {
          setUserLat(12.9352);
          setUserLng(77.6245);
          setAddress('Koramangala 4th Block, 80 Feet Road, Bengaluru');
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleEmergencyDispatch = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'emergency_vehicle',
          category: selectedIssue,
          issueTitle: selectedCategoryObj.title,
          issueDescription: issueDescription,
          basePrice: selectedCategoryObj.basePrice,
          distanceKm: 4,
          vehicleDetails: {
            type: vehicleType,
            make: makeModel.split(' ')[0] || 'Unknown',
            model: makeModel,
            licensePlate: licensePlate
          },
          location: {
            address,
            landmark,
            city: 'Bengaluru',
            lat: userLat,
            lng: userLng,
            direction_of_travel: directionOfTravel
          }
        })
      });

      const data = await response.json();
      if (data.success && data.booking) {
        router.push(`/tracking/${data.booking.id}`);
      } else {
        alert(data.error || 'Failed to dispatch');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      alert('Error creating booking: ' + e.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Reassuring, Premium Emergency Header */}
        <div className="bg-[#EAF5F2] border border-[#A7D9CD] text-[#252B2B] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#DDEFE7] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F766E] border border-[#B8DEC9]">
              <AlertTriangle className="w-4 h-4 text-[#D99119]" />
              <span>Priority SOS Roadside Channel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#252B2B]">24/7 Rapid Emergency Dispatch</h1>
            <p className="text-[#525D5D] text-xs sm:text-sm">
              Average specialist arrival target: <strong>15–25 minutes</strong>. Direct GPS broadcast.
            </p>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#A7D9CD] text-center shrink-0 shadow-sm">
            <div className="text-[11px] text-[#687474] font-semibold">Toll-Free SOS Helpline</div>
            <div className="text-lg font-black text-[#0F766E]">1800-FIX-NOW</div>
          </div>
        </div>

        {/* Safety Advisory Banner */}
        <AlertBanner type="warning" title="Highway & Roadside Safety Reminder">
          If your vehicle is stranded on a high-speed road or dark highway, switch on hazard indicators, move behind the safety barrier if available, and stay visible until the technician arrives.
        </AlertBanner>

        {/* Step Progression Tabs */}
        <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
              step === 1 ? 'border-[#0F766E] text-[#0F766E]' : 'border-transparent text-[#687474]'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step === 1 ? 'bg-[#0F766E] text-white' : 'bg-white border border-[#E6E8E5] text-[#687474]'
            }`}>1</span>
            <span>Vehicle & Problem</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
              step === 2 ? 'border-[#0F766E] text-[#0F766E]' : 'border-transparent text-[#687474]'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step === 2 ? 'bg-[#0F766E] text-white' : 'bg-white border border-[#E6E8E5] text-[#687474]'
            }`}>2</span>
            <span>Exact Location & Landmarks</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
              step === 3 ? 'border-[#0F766E] text-[#0F766E]' : 'border-transparent text-[#687474]'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step === 3 ? 'bg-[#0F766E] text-white' : 'bg-white border border-[#E6E8E5] text-[#687474]'
            }`}>3</span>
            <span>Confirm & Dispatch</span>
          </button>
        </div>

        {/* STEP 1: VEHICLE & PROBLEM */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            {/* Vehicle Type Selector */}
            <Card className="space-y-4">
              <h3 className="font-bold text-base text-[#252B2B]">1. Select Vehicle Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'car', label: 'Car / Hatch / Sedan', icon: Car },
                  { id: 'suv', label: 'SUV / Compact SUV', icon: Car },
                  { id: 'bike', label: 'Bike / Scooter', icon: Bike },
                  { id: 'ev', label: 'Electric Vehicle (EV)', icon: BatteryCharging },
                  { id: 'commercial', label: 'Commercial Van', icon: Truck }
                ].map((v) => {
                  const Icon = v.icon;
                  const isSelected = vehicleType === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleType(v.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#0F766E] bg-[#EAF5F2] text-[#0F766E] font-bold shadow-sm'
                          : 'border-[#E6E8E5] bg-white hover:border-[#0F766E]/40 text-[#252B2B]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#0F766E]' : 'text-[#687474]'}`} />
                      <div className="text-xs">{v.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#252B2B] mb-1">Make & Model</label>
                  <input
                    type="text"
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                    placeholder="e.g. Maruti Swift, Hyundai Creta, Royal Enfield"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252B2B] mb-1">License Plate Number</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="e.g. KA 05 MN 4821"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl uppercase font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
              </div>
            </Card>

            {/* Emergency Problem Selector */}
            <Card className="space-y-4">
              <h3 className="font-bold text-base text-[#252B2B]">2. What Is the Problem?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_CATEGORIES.VEHICLE.map((cat) => {
                  const isSelected = selectedIssue === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedIssue(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#0F766E] bg-[#EAF5F2] shadow-sm'
                          : 'border-[#E6E8E5] bg-white hover:border-[#0F766E]/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0F766E] text-white' : 'bg-[#FAF9F6] text-[#687474] border border-[#E6E8E5]'
                        }`}
                      >
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#0F766E]' : 'text-[#252B2B]'}`}>
                            {cat.title}
                          </span>
                          <span className="text-xs font-extrabold text-[#252B2B]">₹{cat.basePrice}</span>
                        </div>
                        <p className="text-xs text-[#687474] mt-1 leading-relaxed">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Additional Problem Description</label>
                <textarea
                  rows={2}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe warning lights, smoke, strange sounds or circumstances..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                ></textarea>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Location
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & DIRECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-3">
                <h3 className="font-bold text-base text-[#252B2B]">Pinpoint Stranded Location</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  isLoading={isLocating}
                  leftIcon={<MapPin className="w-4 h-4 text-[#0F766E]" />}
                >
                  Fetch Current GPS
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#252B2B] mb-1">Street / Highway Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252B2B] mb-1">Nearby Landmark / Mile Marker</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Shell Petrol Pump, Pillar 104"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252B2B] mb-1">Direction of Travel</label>
                  <input
                    type="text"
                    value={directionOfTravel}
                    onChange={(e) => setDirectionOfTravel(e.target.value)}
                    placeholder="e.g. Towards Marathahalli / Outbound Flyover"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#EAF5F2] rounded-xl border border-[#A7D9CD] flex items-center gap-3 text-xs text-[#083B38]">
                <Compass className="w-5 h-5 text-[#0F766E] shrink-0" />
                <span>
                  Coordinates locked: <strong>{userLat.toFixed(4)}, {userLng.toFixed(4)}</strong>. Dispatch algorithm will match verified units within a 15km perimeter.
                </span>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Review
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & INSTANT DISPATCH */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-3">
                <h3 className="font-bold text-base text-[#252B2B]">Emergency Booking Summary</h3>
                <Badge variant="info">Ready for Instant SOS Broadcast</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] space-y-1">
                  <div className="font-bold text-[#687474] uppercase text-[10px]">Vehicle</div>
                  <div className="font-bold text-[#252B2B] text-sm">{makeModel}</div>
                  <div className="text-[#687474]">{licensePlate} • {vehicleType.toUpperCase()}</div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] space-y-1">
                  <div className="font-bold text-[#687474] uppercase text-[10px]">Requested Service</div>
                  <div className="font-bold text-[#252B2B] text-sm">{selectedCategoryObj.title}</div>
                  <div className="text-[#687474]">{issueDescription}</div>
                </div>

                <div className="sm:col-span-2 p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] space-y-1">
                  <div className="font-bold text-[#687474] uppercase text-[10px]">Stranded Location</div>
                  <div className="font-bold text-[#252B2B]">{address}</div>
                  <div className="text-[#687474]">Landmark: {landmark} • Direction: {directionOfTravel}</div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#E6E8E5] pt-4 space-y-2">
                <h4 className="font-bold text-sm text-[#252B2B]">Transparent Estimate Breakdown</h4>
                <div className="space-y-1.5 text-xs text-[#687474]">
                  <div className="flex justify-between">
                    <span>Base Inspection & Visit Charge</span>
                    <span>₹{pricing.baseCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Allowance (~4 km)</span>
                    <span>₹{pricing.distanceCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Emergency Dispatch Surcharge</span>
                    <span>₹{pricing.emergencySurcharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% Statutory Tax)</span>
                    <span>₹{pricing.gstTax}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-[#252B2B] pt-2 border-t border-[#E6E8E5]">
                    <span>Estimated Total (Visit & Diagnosis)</span>
                    <span>₹{pricing.totalAmount}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#687474] mt-2">
                  * Note: Any replacement parts or extensive labour will be provided via an itemized quote requiring your formal digital approval before work begins.
                </p>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleEmergencyDispatch}
                isLoading={isSubmitting}
                className="bg-[#0F766E] hover:bg-[#0D645E] shadow-sm font-semibold"
                leftIcon={<AlertTriangle className="w-5 h-5 text-[#D99119]" />}
              >
                Dispatch Nearest Verified Specialist
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-xs text-[#687474]">Loading emergency dispatch...</div>}>
      <EmergencyContent />
    </Suspense>
  );
}
