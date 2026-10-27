'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Wrench,
  Disc,
  Zap,
  Truck,
  Key,
  BatteryCharging,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SERVICE_CATEGORIES } from '@/lib/constants';

export default function VehicleServicesPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'breakdown' | 'battery' | 'towing'>('all');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="info">Automotive Assistance</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            24/7 Roadside Assistance & Vehicle Mechanics
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From flat tyres and dead batteries on city flyovers to heavy mechanical breakdowns on expressways. Verified mechanics dispatched within 15–30 minutes across India.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.VEHICLE.map((svc) => (
            <Card key={svc.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Base Inspection</span>
                    <span className="text-base font-black text-slate-900">₹{svc.basePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{svc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{svc.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-time GPS dispatch & tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4-digit arrival OTP authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Itemized quote before repair approval</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-3">
                <Link href={`/emergency?category=${svc.id}`} className="flex-1">
                  <Button variant="emergency" size="sm" className="w-full">
                    Emergency Dispatch
                  </Button>
                </Link>
                <Link href={`/book?category=${svc.id}&type=vehicle`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Schedule Later
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Feature Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Have an urgent emergency right now?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Skip typing extensive details. Broadcast your GPS location in 30 seconds.
            </p>
          </div>
          <Link href="/emergency">
            <Button variant="emergency" size="lg" className="emergency-pulse shrink-0">
              Trigger Instant SOS Broadcast
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
