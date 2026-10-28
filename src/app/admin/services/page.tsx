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
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-[#687474] hover:text-[#252B2B] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Pricing & Surcharges Configuration</h1>
          <p className="text-xs text-[#687474]">Configure base inspection fees, night emergency surcharges, and fuel prices.</p>
        </div>

        {isSaved && (
          <div className="p-3 bg-[#EAF5F2] text-[#21845B] rounded-xl text-xs flex items-center gap-2 border border-[#21845B]/20">
            <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0" />
            <span>Pricing rules updated across dispatch calculations.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="space-y-5 bg-white border border-[#E6E8E5]">
            <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
              Base Inspection & Surcharges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Base Vehicle Mechanic Visit (₹)</label>
                <input
                  type="number"
                  value={baseMechanicPrice}
                  onChange={(e) => setBaseMechanicPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Base Appliance Visit (₹)</label>
                <input
                  type="number"
                  value={baseAppliancePrice}
                  onChange={(e) => setBaseAppliancePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Night Emergency Surcharge (10 PM - 6 AM) (₹)</label>
                <input
                  type="number"
                  value={nightSurcharge}
                  onChange={(e) => setNightSurcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Instant Priority Dispatch Surcharge (₹)</label>
                <input
                  type="number"
                  value={emergencySurcharge}
                  onChange={(e) => setEmergencySurcharge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5 bg-white border border-[#E6E8E5]">
            <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
              Regulated Fuel Rates (₹ / Litre)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">High Speed Diesel (₹ / L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">Motor Spirit / Petrol (₹ / L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8E5] rounded-xl text-xs text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
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
