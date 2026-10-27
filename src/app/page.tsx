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
  Star,
  PhoneCall,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Pill / City selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-300 font-bold uppercase tracking-wider">Live & Active</span>
              <span className="text-slate-300">| Rapid Dispatch within 15–25 Mins</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-slate-400 font-medium">Service Hub:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-semibold text-white focus:outline-none cursor-pointer"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Stranded or Broken Down? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                  Technician Dispatched
                </span>{' '}
                to Your Exact Location.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                24/7 Verified Mechanics, Roadside Towing, PESO-Authorized Emergency Fuel, and Certified Home Appliance Repair Technicians across India.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="flex items-center bg-white rounded-2xl shadow-xl p-2 border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Car battery dead, tyre puncture, fridge cooling..."
                    className="w-full px-3 py-2 text-slate-900 text-sm focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="md" className="shrink-0">
                    Find Help
                  </Button>
                </div>
              </form>

              {/* Major Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/emergency">
                  <Button
                    variant="emergency"
                    size="lg"
                    leftIcon={<Zap className="w-5 h-5 fill-white" />}
                    className="emergency-pulse shadow-red-950/40 text-base"
                  >
                    Emergency Assistance Now
                  </Button>
                </Link>

                <Link href="/book">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Schedule a Service
                  </Button>
                </Link>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
                <div>
                  <div className="font-extrabold text-white text-lg sm:text-xl">15–30 min</div>
                  <div className="text-slate-400">Average Arrival Time</div>
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg sm:text-xl">100%</div>
                  <div className="text-slate-400">Background Checked</div>
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg sm:text-xl">PESO Certified</div>
                  <div className="text-slate-400">Lawful Fuel Supply</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Assist Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-900 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Immediate Request</h3>
                    <p className="text-xs text-slate-500">Select what is required right now</p>
                  </div>
                  <span className="bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-white text-white" /> 24/7 Rapid Rescue
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/services/vehicle"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Car & Bike</div>
                    <div className="text-xs text-slate-500 mt-0.5">Puncture, battery, towing</div>
                  </Link>

                  <Link
                    href="/services/appliance"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Appliance Fix</div>
                    <div className="text-xs text-slate-500 mt-0.5">Fridge, AC, Washing Machine</div>
                  </Link>

                  <Link
                    href="/services/fuel"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Emergency Fuel</div>
                    <div className="text-xs text-slate-500 mt-0.5">Diesel / Petrol (PESO Safe)</div>
                  </Link>

                  <Link
                    href="/emergency"
                    className="p-4 rounded-2xl border border-red-800 bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-white hover:shadow-lg transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div className="font-bold text-sm text-white">Stranded SOS</div>
                    <div className="text-xs text-red-200 mt-0.5">Instant GPS Dispatch</div>
                  </Link>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Razorpay Secure • Itemized Quotes • Warranty</span>
                  </div>
                  <Link href="/book" className="font-semibold text-brand-600 hover:underline">
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY CATEGORY QUICK CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-lg border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 fill-red-800" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-800 uppercase tracking-wide">Battery Boost</div>
              <div className="text-sm font-bold text-slate-900">Instant Jump-Start</div>
              <div className="text-xs text-slate-500">From ₹349</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-lg border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Tyre Assistance</div>
              <div className="text-sm font-bold text-slate-900">Flat Tyre & Plug</div>
              <div className="text-xs text-slate-500">From ₹249</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-lg border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Safe Towing</div>
              <div className="text-sm font-bold text-slate-900">Flatbed Recovery</div>
              <div className="text-xs text-slate-500">From ₹999</div>
            </div>
          </Card>

          <Card hoverEffect className="p-5 flex items-center gap-4 bg-white shadow-lg border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Dry Tank</div>
              <div className="text-sm font-bold text-slate-900">Emergency Fuel</div>
              <div className="text-xs text-slate-500">PESO Regulated</div>
            </div>
          </Card>
        </div>
      </section>

      {/* CORE SERVICES BREAKDOWN */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="info">Full-Spectrum Repair Hub</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comprehensive Assistance for Vehicles & Home
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Every booking is paired with a verified specialist within your service radius, featuring live GPS tracking and customer OTP arrival confirmation.
          </p>
        </div>

        {/* Vehicle Services Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Vehicle Breakdown & Roadside</h3>
                <p className="text-xs text-slate-500">Car, Bike, SUV, EV & Commercial Vehicles</p>
              </div>
            </div>
            <Link
              href="/services/vehicle"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                      Instant Dispatch
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">₹{item.basePrice}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
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
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Home Appliance Repairs</h3>
                <p className="text-xs text-slate-500">Instant Diagnosis, OEM Spares & 30-Day Service Warranty</p>
              </div>
            </div>
            <Link
              href="/services/appliance"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      Visit & Inspection
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">₹{item.basePrice}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
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
      <section className="bg-slate-100/80 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="neutral">Seamless Experience</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How FixNow 24/7 Works
            </h2>
            <p className="text-slate-600 text-sm">
              From roadside distress to full resolution in four simple, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Select Issue & GPS Pin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your vehicle or appliance issue. Share your precise GPS coordinates or enter landmarks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Instant Specialist Dispatch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our algorithm locates the nearest online, verified technician with the matching skillset and parts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Live Tracking & OTP Check</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your technician in real-time. Confirm their arrival using a secure 4-digit verification code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Approved Quote & Safe Pay</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review an itemized quote before chargeable repairs commence. Pay via test-mode UPI, card or cash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REGULATORY SAFETY & PESO COMPLIANCE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 to-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Safety Standard Compliance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Regulated Emergency Fuel Assistance
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike unauthorized platforms, FixNow strictly complies with the <strong>Petroleum Rules 2002</strong> and PESO safety directives. Only registered, PESO-inspected mobile delivery units and approved steel canisters are permitted to supply emergency diesel (max 20L) and petrol (max 5L).
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified PESO License Records</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Customer Handover OTP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nearby Pump Fallback Navigation</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <Link href="/services/fuel">
                <Button variant="primary" size="lg" className="w-full">
                  Request Regulated Fuel
                </Button>
              </Link>
              <Link href="/petroleum-compliance">
                <Button variant="outline" size="md" className="w-full bg-white/10 text-white border-white/20">
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Real Stories from Real Drivers & Homeowners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;My car battery gave up at 11:30 PM on the Bellandur flyover. Apex Auto Care arrived in 18 minutes with a booster pack. The OTP verification made me feel completely safe.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Pooja Venkatesh</div>
                <div className="text-[10px] text-slate-500">Bengaluru • Hyundai i20</div>
              </div>
              <Badge variant="info" size="sm">Battery Boost</Badge>
            </div>
          </Card>

          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Our double-door Samsung refrigerator stopped cooling just before a family gathering. Anand arrived on time, showed me the exact faulty sensor on his quote, and replaced it cleanly.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Sanjay M.</div>
                <div className="text-[10px] text-slate-500">Koramangala • Refrigerator</div>
              </div>
              <Badge variant="success" size="sm">Appliance Repair</Badge>
            </div>
          </Card>

          <Card className="space-y-4">
            <StarRating rating={5} />
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Ran dry of diesel on the highway due to a faulty float gauge. The PESO-authorized delivery team brought 10L in a sealed certified container. Handover was confirmed with OTP. Truly lifesaver!&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Arun Pillai</div>
                <div className="text-[10px] text-slate-500">Electronic City • Mahindra XUV700</div>
              </div>
              <Badge variant="emergency" size="sm">Emergency Diesel</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* PARTNER REGISTRATION BANNER */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant="info">Partner Network</Badge>
            <h3 className="text-2xl font-black text-slate-900">Are You a Skilled Technician or Towing Operator?</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
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
