'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Car,
  Home,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { fixNowStore } from '@/lib/store';
import { ProviderProfile } from '@/types';

export default function ProviderApplyPage() {
  const router = useRouter();

  const [providerType, setProviderType] = useState<'mechanic' | 'appliance_tech'>('mechanic');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [serviceRadiusKm, setServiceRadiusKm] = useState(15);
  const [baseVisitCharge, setBaseVisitCharge] = useState(349);
  
  // Document state
  const [docType, setDocType] = useState<'aadhaar' | 'driving_license' | 'trade_certificate'>('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProvider: ProviderProfile = {
      id: `prov-${Date.now()}`,
      user_id: `usr-prov-${Date.now()}`,
      name,
      business_name: businessName || `${name} Auto Services`,
      email,
      phone,
      provider_type: providerType,
      skills: providerType === 'mechanic' ? ['car-breakdown', 'battery-jumpstart', 'puncture-tyre'] : ['refrigerator-repair', 'washing-machine-repair'],
      service_radius_km: Number(serviceRadiusKm),
      is_available: false,
      is_verified: false,
      verification_status: 'pending',
      documents: [
        {
          id: `doc-${Date.now()}`,
          document_type: docType,
          document_number: docNumber,
          document_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
          is_verified: false
        }
      ],
      rating: 5.0,
      review_count: 0,
      base_visit_charge: Number(baseVisitCharge),
      current_lat: 12.9352,
      current_lng: 77.6245,
      city,
      operating_hours: '24/7 On-Call',
      total_completed_jobs: 0,
      total_earnings: 0,
      created_at: new Date().toISOString()
    };

    fixNowStore.addProvider(newProvider);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="info">Partner Onboarding</Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Register as a Verified Technician
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Receive roadside breakdowns or appliance repair requests directly on your mobile device.
          </p>
        </div>

        {isSuccess ? (
          <Card className="text-center p-8 space-y-4 bg-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your identity details and credentials have been routed to our operations verification team.
              You will receive SMS activation within 1–2 hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/provider/dashboard">
                <Button variant="primary" size="md">
                  Go to Provider Dashboard (Demo Preview)
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <Wrench className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-base text-slate-900">1. Select Profession Category</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProviderType('mechanic')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    providerType === 'mechanic'
                      ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Car className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900">Vehicle Mechanic</div>
                  <div className="text-xs text-slate-500 mt-0.5">Car, bike, towing & jumpstart</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProviderType('appliance_tech')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    providerType === 'appliance_tech'
                      ? 'border-amber-600 bg-amber-50/70 shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Home className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900">Appliance Technician</div>
                  <div className="text-xs text-slate-500 mt-0.5">Refrigerator, AC, Washing Machine</div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Singh"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Garage Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Auto Care & Recovery"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111 22334"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="provider@example.com"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">2. Verification Documents & Identity</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="driving_license">Commercial Driving License</option>
                    <option value="trade_certificate">ITI / Diploma Trade Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Number</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-9821"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer hover:border-brand-500 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">Upload Front & Back Image (Simulated)</div>
                <div className="text-[11px] text-slate-400">PDF, JPG, PNG accepted (Max 10MB)</div>
              </div>
            </Card>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Application for Verification
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
