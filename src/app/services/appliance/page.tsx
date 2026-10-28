'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SERVICE_CATEGORIES } from '@/lib/constants';

export default function ApplianceServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="warning">Home Appliances Specialist</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#252B2B] tracking-tight">
            Certified Home Appliance Repair Technicians
          </h1>
          <p className="text-[#687474] text-sm sm:text-base leading-relaxed">
            Multi-brand repair specialists for Samsung, LG, Whirlpool, Daikin, IFB, Bosch, Voltas and more. Transparent diagnosis fees, genuine OEM spare parts, and a 30-day service warranty.
          </p>
        </div>

        {/* Appliance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.APPLIANCE.map((app) => (
            <Card key={app.id} hoverEffect className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#DDEFE7] text-[#0F766E] flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#687474] font-semibold uppercase block">Visit & Diagnosis</span>
                    <span className="text-base font-black text-[#252B2B]">₹{app.basePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#252B2B] mb-1">{app.title}</h3>
                  <p className="text-xs text-[#687474] leading-relaxed">{app.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-[#687474] pt-2 border-t border-[#E6E8E5]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>30-Day Workmanship Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>Genuine OEM parts quote provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#21845B]" />
                    <span>Verified background-checked technicians</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#E6E8E5]">
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
        <div className="bg-[#FEF9EE] border border-[#FBE2AC] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#BA730F] uppercase tracking-wider">FixNow 30-Day Guarantee</span>
            <h3 className="text-xl sm:text-2xl font-black text-[#252B2B]">100% Satisfaction & Repair Warranty</h3>
            <p className="text-xs sm:text-sm text-[#753E0A] max-w-xl">
              If the repaired issue recurs within 30 days of completion, our verified technician visits again at zero additional inspection cost.
            </p>
          </div>
          <Link href="/book?type=appliance">
            <Button variant="primary" size="md" className="shrink-0 bg-[#0F766E] hover:bg-[#0D645E]">
              Schedule Home Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
