'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sliders, ArrowLeft, CheckCircle2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PESO_REGULATIONS, GST_RATE, PLATFORM_COMMISSION_RATE } from '@/lib/constants';

export default function AdminServicesConfigPage() {
  const [baseMechanicPrice, setBaseMechanicPrice] = useState(349);
  const [baseAppliancePrice, setBaseAppliancePrice] = useState(349);
  const [nightSurcharge, setNightSurcharge] = useState(150);
  const [emergencySurcharge, setEmergencySurcharge] = useState(100);
  const [dieselPrice, setDieselPrice] = useState(PESO_REGULATIONS.DIESEL_BASE_PRICE_PER_LITER);
  const [petrolPrice, setPetrolPrice] = useState(PESO_REGULATIONS.PETROL_BASE_PRICE_PER_LITER);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Pricing & Surcharges Configuration</h1>
          <p className="text-xs text-slate-500">Configure base inspection fees, night emergency surcharges, and fuel prices.</p>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pricing rules updated across dispatch calculations.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="space-y-5">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Base Inspection & Surcharges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Vehicle Mechanic Visit (₹)</label>
                <input
                  type="number"
                  value={baseMechanicPrice}
                  onChange={(e) => setBaseMechanicPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Appliance Visit (₹)</label>
                <input
                  type="number"
                  value={baseAppliancePrice}
                  onChange={(e) => setBaseAppliancePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Night Emergency Surcharge (10 PM - 6 AM) (₹)</label>
                <input
                  type="number"
                  value={nightSurcharge}
                  onChange={(e) => setNightSurcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instant Priority Dispatch Surcharge (₹)</label>
                <input
                  type="number"
                  value={emergencySurcharge}
                  onChange={(e) => setEmergencySurcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Regulated Fuel Rates (₹ / Litre)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">High Speed Diesel (₹ / L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motor Spirit / Petrol (₹ / L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </Card>

          <Button type="submit" variant="primary" size="md">
            Save Pricing Rules
          </Button>
        </form>
      </div>
    </div>
  );
}
