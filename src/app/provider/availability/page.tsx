'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Sliders, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Service Perimeter & Availability</h1>
          <p className="text-xs text-slate-500">Configure your automated dispatch matching criteria.</p>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings updated successfully! Dispatch radius applied.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Dispatch Perimeter Radius</label>
                <span className="text-xs font-black text-brand-600">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You will only be broadcast job requests located within {radiusKm} km of your garage coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Inspection Fee (₹)</label>
                <input
                  type="number"
                  value={baseVisitCharge}
                  onChange={(e) => setBaseVisitCharge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours</label>
                <select
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="24 Hours Emergency Dispatch">24/7 Emergency Dispatch</option>
                  <option value="06:00 AM - 11:00 PM">06:00 AM - 11:00 PM</option>
                  <option value="09:00 AM - 09:00 PM">09:00 AM - 09:00 PM</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md">
              Save Configuration
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
