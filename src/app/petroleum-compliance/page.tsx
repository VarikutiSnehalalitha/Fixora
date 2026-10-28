import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PESO_REGULATIONS } from '@/lib/constants';

export default function PetroleumCompliancePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="warning">Regulatory Transparency</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-[#252B2B] tracking-tight">
            Petroleum Rules 2002 & PESO Safety Compliance
          </h1>
          <p className="text-[#687474] text-sm">
            Statutory disclosure regarding lawful roadside delivery of Class A (Petrol) and Class B (Diesel) fuels in India.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 text-[#252B2B] text-sm leading-relaxed bg-white border border-[#E6E8E5]">
          <div className="border-b border-[#E6E8E5] pb-4">
            <h2 className="text-xl font-bold text-[#252B2B] mb-1">
              Statutory Authority: Petroleum and Explosives Safety Organisation (PESO)
            </h2>
            <p className="text-xs text-[#687474]">
              Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry, Government of India.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#252B2B] text-base">1. Distinction Between Petrol and Diesel Regulations</h3>
            <p className="text-[#687474]">
              Under the Indian Petroleum Act 1934 and the Petroleum Rules 2002:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-[#687474]">
              <li>
                <strong className="text-[#252B2B]">Petrol (Motor Spirit - Class A Petroleum):</strong> Having a flash point below 23° Celsius. Petrol is classified as an extraordinarily dangerous, volatile substance. Unregulated transport in plastic cans, bottles or non-certified containers is a punishable criminal offense under Section 23 of the Petroleum Act. On FixNow, roadside petrol delivery is restricted to a <strong className="text-[#252B2B]">maximum emergency volume of 5 Litres</strong> exclusively using factory-sealed, PESO-certified steel safety canisters carried by authorized recovery vehicles.
              </li>
              <li>
                <strong className="text-[#252B2B]">Diesel (High Speed Diesel - Class B Petroleum):</strong> Having a flash point between 23°C and 65°C. Lawful on-demand delivery is permitted up to <strong className="text-[#252B2B]">20 Litres per incident</strong> for stranded vehicles, provided the dispensing partner holds a valid PESO mobile refueling unit approval or uses PESO-stamped containers with non-sparking brass nozzles.
              </li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E6E8E5]">
            <h3 className="font-bold text-[#252B2B] text-base">2. Strict Prohibition on Unauthorized Fuel Resale</h3>
            <p className="text-xs text-[#687474] leading-relaxed">
              Ordinary retail petrol pump listings or independent courier drivers are strictly prohibited from acting as unauthorized fuel dispatchers on FixNow. Every fuel partner must undergo rigorous administrative review:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] flex items-start gap-2 text-[#252B2B]">
                <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0 mt-0.5" />
                <span>Verification of active PESO license number and expiry</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] flex items-start gap-2 text-[#252B2B]">
                <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0 mt-0.5" />
                <span>Inspection of certified mobile bowsers & brass safety equipment</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] flex items-start gap-2 text-[#252B2B]">
                <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0 mt-0.5" />
                <span>Mandatory customer OTP confirmation upon physical delivery</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] flex items-start gap-2 text-[#252B2B]">
                <CheckCircle2 className="w-4 h-4 text-[#21845B] shrink-0 mt-0.5" />
                <span>Audit logging of exact quantity delivered and vehicle registration</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E6E8E5]">
            <h3 className="font-bold text-[#252B2B] text-base">3. Fallback to Verified Retail Outlets</h3>
            <p className="text-xs text-[#687474] leading-relaxed">
              If an authorized PESO supplier is not available within the service radius, FixNow automatically provides directions, phone numbers, and coordinates to the nearest 24/7 authorized oil marketing company retail outlets (IOCL, BPCL, HPCL) to ensure motorists receive safe, lawful assistance.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E6E8E5] flex items-center justify-between">
            <Link href="/services/fuel">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Regulated Fuel Portal
              </Button>
            </Link>
            <Link href="/fuel-partner/apply">
              <Button variant="outline" size="md">
                Register as PESO Partner
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
