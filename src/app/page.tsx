'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  AlertTriangle,
  Car,
  Home,
  Fuel,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Search,
  Zap,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { SERVICE_CATEGORIES, POPULAR_LOCATIONS, APP_NAME } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState(POPULAR_LOCATIONS[0].name);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('fuel') || q.includes('petrol') || q.includes('diesel')) {
      router.push('/services/fuel');
    } else if (
      q.includes('fridge') ||
      q.includes('ac') ||
      q.includes('washing') ||
      q.includes('tv') ||
      q.includes('appliance')
    ) {
      router.push('/services/appliance');
    } else {
      router.push(`/services/vehicle?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-[#F4F8F6] to-[#FAF9F6] text-[#252B2B] pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E6E8E5]">
        {/* Subtle decorative background tint */}
        <div className="absolute inset-0 bg-[radial-gradient(#0F766E_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Pill / Service Hub Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Elegant availability indicator */}
            <div className="inline-flex items-center gap-2 bg-[#DDEFE7] px-3.5 py-1.5 rounded-full border border-[#B8DEC9] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#21845B]"></span>
              <span className="text-[#21845B] font-bold uppercase tracking-wider">
                Available Around the Clock
              </span>
              <span className="hidden sm:inline text-[#687474]">| Service Goal: 15–25 Min Dispatch</span>
            </div>

            {/* Redesigned Location selector with white bg, thin grey border, teal icon */}
            <div className="flex items-center gap-2 bg-white border border-[#E6E8E5] rounded-xl px-3.5 py-1.5 text-xs text-[#252B2B] shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span className="text-[#687474] font-medium">Service Hub:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent font-semibold text-[#252B2B] focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name} className="bg-white text-[#252B2B]">
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#687474] -ml-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#252B2B]">
                Reliable Help.{' '}
                <span className="text-[#0F766E]">
                  Right Where You Need It.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#687474] max-w-2xl leading-relaxed">
                Book trusted mechanics, roadside assistance, emergency fuel services, and home appliance technicians whenever you need help.
              </p>

              {/* Redesigned Service Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="flex items-center bg-white rounded-2xl shadow-sm p-2 border border-[#E6E8E5] focus-within:border-[#0F766E] transition-colors">
                  <Search className="w-5 h-5 text-[#687474] ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe your problem, e.g. flat tyre or washing machine repair"
                    className="w-full px-3 py-2 text-[#252B2B] text-sm focus:outline-none placeholder:text-[#687474]/70"
                  />
                  <Button type="submit" variant="primary" size="md" className="shrink-0 bg-[#0F766E] hover:bg-[#0D645E]">
                    Find Help
                  </Button>
                </div>
              </form>

              {/* Major Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/emergency">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<AlertTriangle className="w-5 h-5 text-[#D99119]" />}
                    className="bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-sm text-base font-semibold"
                  >
                    Emergency Assistance Now
                  </Button>
                </Link>

                <Link href="/book">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white text-[#252B2B] border-[#E6E8E5] hover:border-[#0F766E] hover:text-[#0F766E]"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Schedule a Service
                  </Button>
                </Link>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E6E8E5] text-xs sm:text-sm">
                <div>
                  <div className="font-extrabold text-[#252B2B] text-lg sm:text-xl">15–30 min</div>
                  <div className="text-[#687474]">Average Arrival Target</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#252B2B] text-lg sm:text-xl">100%</div>
                  <div className="text-[#687474]">Background Checked</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#252B2B] text-lg sm:text-xl">PESO Certified</div>
                  <div className="text-[#687474]">Lawful Fuel Supply</div>
                </div>
              </div>
            </div>

            {/* Right Redesigned Service Booking Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E6E8E5] text-[#252B2B] space-y-6">
                <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-[#252B2B]">Immediate Request</h3>
                    <p className="text-xs text-[#687474]">Select what is required right now</p>
                  </div>
                  <span className="bg-[#DDEFE7] text-[#21845B] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#21845B]"></span>
                    Around the Clock
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Car & Bike */}
                  <Link
                    href="/services/vehicle"
                    className="p-4 rounded-2xl border border-[#E6E8E5] hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-[#252B2B]">Car & Bike</div>
                    <div className="text-xs text-[#687474] mt-0.5 line-clamp-2">Repairs, punctures, batteries and towing</div>
                  </Link>

                  {/* Home Appliances */}
                  <Link
                    href="/services/appliance"
                    className="p-4 rounded-2xl border border-[#E6E8E5] hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#DDEFE7] text-[#0F766E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-[#252B2B]">Home Appliances</div>
                    <div className="text-xs text-[#687474] mt-0.5 line-clamp-2">Refrigerators, washing machines and ACs</div>
                  </Link>

                  {/* Emergency Fuel */}
                  <Link
                    href="/services/fuel"
                    className="p-4 rounded-2xl border border-[#E6E8E5] hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F3EBDD] text-[#8C6D3B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-[#252B2B]">Emergency Fuel</div>
                    <div className="text-xs text-[#687474] mt-0.5 line-clamp-2">Check eligible authorized fuel assistance</div>
                  </Link>

                  {/* Emergency Assistance */}
                  <Link
                    href="/emergency"
                    className="p-4 rounded-2xl border border-[#E6E8E5] hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D99119] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-[#252B2B]">Emergency Assistance</div>
                    <div className="text-xs text-[#687474] mt-0.5 line-clamp-2">Request urgent roadside help</div>
                  </Link>
                </div>

                <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E6E8E5] flex items-center justify-between text-xs text-[#687474]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#21845B] shrink-0" />
                    <span>Itemized Quotes • Verified Experts • Warranty</span>
                  </div>
                  <Link href="/book" className="font-semibold text-[#0F766E] hover:underline">
                    View Rates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY CATEGORY QUICK CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-sm border-[#E6E8E5]">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D99119] flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#D99119] uppercase tracking-wide">Battery Boost</div>
              <div className="text-sm font-bold text-[#252B2B]">Instant Jump-Start</div>
              <div className="text-xs text-[#687474]">From ₹349</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-sm border-[#E6E8E5]">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0F766E] uppercase tracking-wide">Tyre Assistance</div>
              <div className="text-sm font-bold text-[#252B2B]">Flat Tyre & Plug</div>
              <div className="text-xs text-[#687474]">From ₹249</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-sm border-[#E6E8E5]">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEFE7] text-[#21845B] flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#21845B] uppercase tracking-wide">Safe Towing</div>
              <div className="text-sm font-bold text-[#252B2B]">Flatbed Recovery</div>
              <div className="text-xs text-[#687474]">From ₹999</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-sm border-[#E6E8E5]">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EBDD] text-[#8C6D3B] flex items-center justify-center shrink-0">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#8C6D3B] uppercase tracking-wide">Dry Tank</div>
              <div className="text-sm font-bold text-[#252B2B]">Emergency Fuel</div>
              <div className="text-xs text-[#687474]">PESO Regulated</div>
            </div>
          </Card>
        </div>
      </section>

      {/* CORE SERVICES BREAKDOWN */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="info">Full-Spectrum Service Marketplace</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-[#252B2B] tracking-tight">
            Comprehensive Assistance for Vehicles & Home
          </h2>
          <p className="text-[#687474] text-base leading-relaxed">
            Every booking is paired with a verified specialist within your service radius, featuring live GPS tracking and customer OTP arrival confirmation.
          </p>
        </div>

        {/* Vehicle Services Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#252B2B]">Vehicle Breakdown & Roadside</h3>
                <p className="text-xs text-[#687474]">Car, Bike, SUV, EV & Commercial Vehicles</p>
              </div>
            </div>
            <Link
              href="/services/vehicle"
              className="text-sm font-bold text-[#0F766E] hover:text-[#0D645E] flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.VEHICLE.slice(0, 3).map((item) => (
              <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F766E] bg-[#EAF5F2] px-2.5 py-1 rounded-md">
                      Instant Dispatch
                    </span>
                    <span className="text-sm font-extrabold text-[#252B2B]">₹{item.basePrice}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#252B2B]">{item.title}</h4>
                  <p className="text-xs text-[#687474] leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#E6E8E5]">
                  <Link href={`/emergency?category=${item.id}`}>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span>Book Breakdown Specialist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Appliance Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDEFE7] text-[#0F766E] flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#252B2B]">Home Appliance Repairs</h3>
                <p className="text-xs text-[#687474]">Instant Diagnosis, OEM Spares & 30-Day Service Warranty</p>
              </div>
            </div>
            <Link
              href="/services/appliance"
              className="text-sm font-bold text-[#0F766E] hover:text-[#0D645E] flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.APPLIANCE.slice(0, 3).map((item) => (
              <Card key={item.id} hoverEffect className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#21845B] bg-[#EAF4EE] px-2.5 py-1 rounded-md">
                      Visit & Inspection
                    </span>
                    <span className="text-sm font-extrabold text-[#252B2B]">₹{item.basePrice}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#252B2B]">{item.title}</h4>
                  <p className="text-xs text-[#687474] leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#E6E8E5]">
                  <Link href={`/book?category=${item.id}&type=appliance`}>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <span>Schedule Technician</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E6E8E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="neutral">Seamless Experience</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[#252B2B] tracking-tight">
              How FixNow 24/7 Works
            </h2>
            <p className="text-[#687474] text-sm">
              From initial distress call to full resolution in four simple, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6E8E5] relative">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-extrabold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-[#252B2B] text-base mb-1">Select Issue & GPS Pin</h4>
              <p className="text-xs text-[#687474] leading-relaxed">
                Choose your vehicle or appliance issue. Share your precise GPS coordinates or enter landmarks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6E8E5] relative">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-extrabold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-[#252B2B] text-base mb-1">Instant Specialist Dispatch</h4>
              <p className="text-xs text-[#687474] leading-relaxed">
                Our algorithm locates the nearest online, verified technician with the matching skillset and parts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6E8E5] relative">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-extrabold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-[#252B2B] text-base mb-1">Live Tracking & OTP Check</h4>
              <p className="text-xs text-[#687474] leading-relaxed">
                Track your technician in real-time. Confirm their arrival using a secure 4-digit verification code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6E8E5] relative">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-extrabold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-[#252B2B] text-base mb-1">Approved Quote & Safe Pay</h4>
              <p className="text-xs text-[#687474] leading-relaxed">
                Review an itemized quote before chargeable repairs commence. Pay via UPI, card or cash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REGULATORY SAFETY & PESO COMPLIANCE SECTION - Clean Light Theme */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#EAF5F2] border border-[#A7D9CD] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#DDEFE7] text-[#21845B] px-3 py-1 rounded-full text-xs font-semibold border border-[#B8DEC9]">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Safety Standard Compliance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B2B]">
                Regulated Emergency Fuel Assistance
              </h3>
              <p className="text-sm text-[#525D5D] leading-relaxed">
                Unlike unauthorized platforms, FixNow strictly complies with the <strong>Petroleum Rules 2002</strong> and PESO safety directives. Only registered, PESO-inspected mobile delivery units and approved steel canisters are permitted to supply emergency diesel (max 20L) and petrol (max 5L).
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#252B2B]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#21845B]" />
                  <span>Verified PESO License Records</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#21845B]" />
                  <span>Customer Handover OTP</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#21845B]" />
                  <span>Nearby Pump Fallback Navigation</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <Link href="/services/fuel">
                <Button variant="primary" size="lg" className="w-full bg-[#0F766E] hover:bg-[#0D645E]">
                  Request Regulated Fuel
                </Button>
              </Link>
              <Link href="/petroleum-compliance">
                <Button variant="outline" size="md" className="w-full bg-white text-[#252B2B] border-[#A7D9CD] hover:border-[#0F766E] hover:text-[#0F766E]">
                  Read PESO Rules & Limits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GENUINE TESTIMONIALS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="success">Customer Trust</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[#252B2B]">
            Real Stories from Real Drivers & Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-[#687474] italic leading-relaxed">
              &quot;My car battery gave up at 11:30 PM on the Bellandur flyover. Apex Auto Care arrived in 18 minutes with a booster pack. The OTP verification made me feel completely safe.&quot;
            </p>
            <div className="pt-2 border-t border-[#E6E8E5] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#252B2B]">Pooja Venkatesh</div>
                <div className="text-[10px] text-[#687474]">Bengaluru • Hyundai i20</div>
              </div>
              <Badge variant="info" size="sm">Battery Boost</Badge>
            </div>
          </Card>

          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-[#687474] italic leading-relaxed">
              &quot;Our double-door Samsung refrigerator stopped cooling just before a family gathering. Anand arrived on time, showed me the exact faulty sensor on his quote, and replaced it cleanly.&quot;
            </p>
            <div className="pt-2 border-t border-[#E6E8E5] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#252B2B]">Sanjay M.</div>
                <div className="text-[10px] text-[#687474]">Koramangala • Refrigerator</div>
              </div>
              <Badge variant="success" size="sm">Appliance Repair</Badge>
            </div>
          </Card>

          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-[#687474] italic leading-relaxed">
              &quot;Ran dry of diesel on the highway due to a faulty float gauge. The PESO-authorized delivery team brought 10L in a sealed certified container. Handover was confirmed with OTP. Truly lifesaver!&quot;
            </p>
            <div className="pt-2 border-t border-[#E6E8E5] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#252B2B]">Arun Pillai</div>
                <div className="text-[10px] text-[#687474]">Electronic City • Mahindra XUV700</div>
              </div>
              <Badge variant="warning" size="sm">Emergency Diesel</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* PARTNER REGISTRATION BANNER */}
      <section className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E6E8E5]">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E8E5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant="info">Partner Network</Badge>
            <h3 className="text-2xl font-black text-[#252B2B]">Are You a Skilled Technician or Towing Operator?</h3>
            <p className="text-xs sm:text-sm text-[#687474] max-w-xl">
              Grow your local business. Receive high-intent roadside and home repair requests within your chosen radius with guaranteed payouts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/provider/apply">
              <Button variant="primary" size="md">
                Register as Technician
              </Button>
            </Link>
            <Link href="/fuel-partner/apply">
              <Button variant="outline" size="md">
                PESO Fuel Sign-Up
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
