'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Star,
  ArrowLeft
} from 'lucide-react';
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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#687474]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/provider/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Specialist Credentials & Documents</h1>
          <p className="text-xs text-[#687474]">Government identity records, trade certifications, and business verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-5 space-y-4 bg-white border-[#E6E8E5]">
            <div className="flex items-center gap-3 border-b border-[#E6E8E5] pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {provider.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#252B2B]">{provider.name}</h3>
                <p className="text-xs text-[#687474]">{provider.business_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-[#D99119] fill-[#D99119]" />
                  <span className="text-xs font-bold text-[#252B2B]">{provider.rating}</span>
                  <span className="text-[10px] text-[#687474]">({provider.review_count} ratings)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#687474] block">Contact Phone</span>
                <span className="font-bold text-[#252B2B]">{provider.phone}</span>
              </div>
              <div>
                <span className="text-[#687474] block">Email Address</span>
                <span className="font-bold text-[#252B2B]">{provider.email}</span>
              </div>
              <div>
                <span className="text-[#687474] block">Hub Location</span>
                <span className="font-bold text-[#252B2B]">{provider.city} • {provider.service_radius_km} km radius</span>
              </div>
              <div>
                <span className="text-[#687474] block">Verification Status</span>
                <span className="font-bold text-[#21845B] capitalize">{provider.verification_status}</span>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-7 space-y-4 bg-white border-[#E6E8E5]">
            <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
              Verified Legal Documents
            </h3>

            <div className="space-y-3">
              {provider.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#0F766E]" />
                    <div>
                      <div className="font-bold text-[#252B2B] uppercase">{doc.document_type.replace('_', ' ')}</div>
                      <div className="text-[#687474] font-mono text-[11px]">{doc.document_number}</div>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Verified</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
