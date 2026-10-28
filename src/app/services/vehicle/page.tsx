'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SERVICE_CATEGORIES } from '@/lib/constants';

export default function VehicleServicesPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'breakdown' | 'battery' | 'towing'>('all');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="info">Automotive Assistance</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#252B2B] tracking-tight">
            24/7 Roadside Assistance & Vehicle Mechanics
          </h1>
          <p className="text-[#687474] text-sm sm:text-base leading-relaxed">
            From flat tyres and dead batteries on city flyovers to heavy mechanical breakdowns on expressways. Verified mechanics dispatched within 15–30 minutes across India.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.VEHICLE.map((svc) => (
            <Card key={svc.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#687474] font-semibold uppercase block">Base Inspection</span>
                    <span className="text-base font-black text-[#252B2B]">₹{svc.basePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#252B2B] mb-1">{svc.title}</h3>
                  <p className="text-xs text-[#687474] leading-relaxed">{svc.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-[#687474] pt-2 border-t border-[#E6E8E5]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>Real-time GPS dispatch & tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>4-digit arrival OTP authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>Itemized quote before repair approval</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#E6E8E5] flex items-center gap-3">
                <Link href={`/emergency?category=${svc.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
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

        {/* Feature Banner - Clean Light Theme */}
        <div className="bg-[#EAF5F2] border border-[#A7D9CD] text-[#252B2B] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#252B2B]">Have an urgent roadside emergency?</h3>
            <p className="text-xs sm:text-sm text-[#525D5D]">
              Skip typing extensive details. Broadcast your GPS location in 30 seconds for priority response.
            </p>
          </div>
          <Link href="/emergency">
            <Button variant="primary" size="lg" className="shrink-0 bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<AlertTriangle className="w-4 h-4 text-[#D99119]" />}>
              Instant SOS Dispatch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
