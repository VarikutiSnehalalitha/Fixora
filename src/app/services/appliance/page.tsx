'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Snowflake,
  RotateCw,
  Wind,
  Tv,
  Flame,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SERVICE_CATEGORIES } from '@/lib/constants';

export default function ApplianceServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="warning">Home Appliances Specialist</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Certified Home Appliance Repair Technicians
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Multi-brand repair specialists for Samsung, LG, Whirlpool, Daikin, IFB, Bosch, Voltas and more. Transparent diagnosis fees, genuine OEM spare parts, and a 30-day service warranty.
          </p>
        </div>

        {/* Appliance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.APPLIANCE.map((app) => (
            <Card key={app.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Visit & Diagnosis</span>
                    <span className="text-base font-black text-slate-900">₹{app.basePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{app.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{app.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30-Day Workmanship Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Genuine OEM parts quote provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified background-checked technicians</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link href={`/book?category=${app.id}&type=appliance`}>
                  <Button variant="primary" size="md" className="w-full justify-between">
                    <span>Book Repair Technician</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">FixNow 30-Day Guarantee</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">100% Satisfaction & Repair Warranty</h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
              If the repaired issue recurs within 30 days of completion, our verified technician visits again at zero additional inspection cost.
            </p>
          </div>
          <Link href="/book?type=appliance">
            <Button variant="primary" size="md" className="shrink-0">
              Schedule Home Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
