'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fixNowStore } from '@/lib/store';
import { ProviderProfile } from '@/types';

export default function ProviderAvailabilityPage() {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [radiusKm, setRadiusKm] = useState(15);
  const [baseVisitCharge, setBaseVisitCharge] = useState(349);
  const [operatingHours, setOperatingHours] = useState('24 Hours Emergency Dispatch');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const p = fixNowStore.getProviders()[0];
    if (p) {
      setProvider(p);
      setRadiusKm(p.service_radius_km);
      setBaseVisitCharge(p.base_visit_charge);
      setOperatingHours(p.operating_hours);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    fixNowStore.updateProvider(provider.id, {
      service_radius_km: Number(radiusKm),
      base_visit_charge: Number(baseVisitCharge),
      operating_hours: operatingHours
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Service Perimeter & Availability</h1>
          <p className="text-xs text-[#687474]">Configure your automated dispatch matching criteria.</p>
        </div>

        {isSaved && (
          <div className="p-3 bg-[#EAF4EE] text-[#21845B] rounded-xl text-xs flex items-center gap-2 border border-[#B8DEC9]">
            <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0" />
            <span>Settings updated successfully! Dispatch radius applied.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="space-y-5 bg-white border-[#E6E8E5]">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#252B2B]">Dispatch Perimeter Radius</label>
                <span className="text-xs font-black text-[#0F766E]">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full h-2 bg-[#E6E8E5] rounded-lg appearance-none cursor-pointer accent-[#0F766E]"
              />
              <p className="text-[11px] text-[#687474] mt-1">
                You will only be broadcast job requests located within {radiusKm} km of your garage coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E6E8E5]">
              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Base Inspection Fee (₹)</label>
                <input
                  type="number"
                  value={baseVisitCharge}
                  onChange={(e) => setBaseVisitCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Operating Hours</label>
                <select
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option>24 Hours Emergency Dispatch</option>
                  <option>08:00 AM - 10:00 PM</option>
                  <option>09:00 AM - 07:00 PM</option>
                  <option>Night Shift Only (08:00 PM - 06:00 AM)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="bg-[#0F766E] hover:bg-[#0D645E]">
                Save Availability Settings
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
