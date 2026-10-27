'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Fuel,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { fixNowStore } from '@/lib/store';
import { FuelPartnerAuthorization } from '@/types';

export default function FuelPartnerApplyPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [pesoLicenseNumber, setPesoLicenseNumber] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('2028-12-31');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [authorizedFuelTypes, setAuthorizedFuelTypes] = useState<('diesel' | 'petrol')[]>(['diesel']);
  const [safetyInspectionDate, setSafetyInspectionDate] = useState('2026-01-15');
  const [agreedToPESORules, setAgreedToPESORules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPESORules) {
      alert('You must acknowledge the statutory PESO safety requirements.');
      return;
    }

    setIsSubmitting(true);
    const newAuth: FuelPartnerAuthorization = {
      id: `fuel-auth-${Date.now()}`,
      provider_id: `prov-fuel-${Date.now()}`,
      company_name: companyName,
      peso_license_number: pesoLicenseNumber,
      license_expiry_date: licenseExpiryDate,
      authorized_fuel_types: authorizedFuelTypes,
      max_approved_quantity_liters: 20,
      approved_dispensing_vehicle_number: vehicleNumber,
      status: 'pending',
      safety_inspection_date: safetyInspectionDate,
      certified_by_authority: 'Petroleum and Explosives Safety Organisation (PESO)'
    };

    fixNowStore.addFuelAuthorization(newAuth);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="emergency">PESO Statutory Partner Portal</Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Register as a PESO Authorized Fuel Partner
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Strict verification required under the Petroleum Rules 2002. Only certified mobile units eligible.
          </p>
        </div>

        <AlertBanner type="warning" title="Strict Legal Requirements">
          FixNow does not permit unauthorized retail pumps or independent couriers to deliver fuel. Every supplier must hold a current PESO registration certificate and approved mobile delivery bowsers or certified safety canisters.
        </AlertBanner>

        {isSuccess ? (
          <Card className="text-center p-8 space-y-4 bg-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">PESO Application Submitted</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our safety officer will cross-verify your PESO license code ({pesoLicenseNumber}) against the official PESO licensing portal before authorizing live orders.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/fuel-partner/dashboard">
                <Button variant="primary" size="md">
                  Open Fuel Partner Terminal
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="space-y-5">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                1. Business & PESO Certification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. SafeFuel Logistics Pvt Ltd"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PESO License / Registration Code</label>
                  <input
                    type="text"
                    value={pesoLicenseNumber}
                    onChange={(e) => setPesoLicenseNumber(e.target.value)}
                    placeholder="e.g. PESO/SC/2023/BLR-0892"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Mobile Bowser / Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. KA-01-MJ-9912"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Permitted Fuel Categories</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={authorizedFuelTypes.includes('diesel')}
                      onChange={(e) => {
                        if (e.target.checked) setAuthorizedFuelTypes([...authorizedFuelTypes, 'diesel']);
                        else setAuthorizedFuelTypes(authorizedFuelTypes.filter((f) => f !== 'diesel'));
                      }}
                      className="rounded text-brand-600"
                    />
                    <span>High Speed Diesel (Max 20L roadside)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={authorizedFuelTypes.includes('petrol')}
                      onChange={(e) => {
                        if (e.target.checked) setAuthorizedFuelTypes([...authorizedFuelTypes, 'petrol']);
                        else setAuthorizedFuelTypes(authorizedFuelTypes.filter((f) => f !== 'petrol'));
                      }}
                      className="rounded text-brand-600"
                    />
                    <span>Motor Spirit / Petrol (Max 5L Sealed Canister Only)</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToPESORules}
                    onChange={(e) => setAgreedToPESORules(e.target.checked)}
                    className="mt-1 rounded text-brand-600"
                  />
                  <span className="text-xs text-amber-900 leading-relaxed">
                    We certify that all refueling operations comply with Rule 130 of the Petroleum Rules 2002. We will only use PESO-stamped containers or authorized mobile bowsers, and confirm each delivery via customer OTP.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit PESO Application
              </Button>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
