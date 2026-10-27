'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Star,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { ProviderProfile } from '@/types';

export default function ProviderProfilePage() {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);

  useEffect(() => {
    const p = fixNowStore.getProviders()[0];
    if (p) setProvider(p);
  }, []);

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Provider Credentials & Documents</h1>
          <p className="text-xs text-slate-500">Government identity records, trade certifications, and business verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl">
                {provider.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{provider.name}</h3>
                <p className="text-xs text-slate-500">{provider.business_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">{provider.rating}</span>
                  <span className="text-[10px] text-slate-400">({provider.review_count} ratings)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block">Contact Phone</span>
                <span className="font-bold text-slate-900">{provider.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <span className="font-bold text-slate-900">{provider.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Hub Location</span>
                <span className="font-bold text-slate-900">{provider.city} • {provider.service_radius_km} km radius</span>
              </div>
              <div>
                <span className="text-slate-500 block">Verification Status</span>
                <span className="font-bold text-emerald-700 capitalize">{provider.verification_status}</span>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-7 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Verified Legal Documents
            </h3>

            <div className="space-y-3">
              {provider.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-600" />
                    <div>
                      <div className="font-bold text-slate-900 uppercase">{doc.document_type.replace('_', ' ')}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{doc.document_number}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                All documents have been checked against official portals. Certified for emergency roadside dispatch.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
