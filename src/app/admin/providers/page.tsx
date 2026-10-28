'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowLeft,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { ProviderProfile } from '@/types';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);

  const loadProviders = () => {
    setProviders([...fixNowStore.getProviders()]);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleApprove = (id: string) => {
    fixNowStore.updateProvider(id, {
      is_verified: true,
      verification_status: 'verified',
      is_available: true
    });
    fixNowStore.addAuditLog({
      actor_id: 'usr-admin-001',
      actor_role: 'admin',
      action: 'PROVIDER_APPROVED',
      target_resource: 'provider_profiles',
      target_id: id,
      details: { verified: true }
    });
    alert('Provider approved and enabled for live dispatch!');
    loadProviders();
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason (e.g. Incomplete ID document):');
    if (!reason) return;

    fixNowStore.updateProvider(id, {
      is_verified: false,
      verification_status: 'rejected',
      rejection_reason: reason,
      is_available: false
    });
    fixNowStore.addAuditLog({
      actor_id: 'usr-admin-001',
      actor_role: 'admin',
      action: 'PROVIDER_REJECTED',
      target_resource: 'provider_profiles',
      target_id: id,
      details: { reason }
    });
    loadProviders();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-[#687474] hover:text-[#252B2B] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Provider Verifications & Applications</h1>
          <p className="text-xs text-[#687474]">
            Review identity documents, licenses and certifications before granting dispatch eligibility.
          </p>
        </div>

        <div className="space-y-4">
          {providers.map((p) => (
            <Card key={p.id} className="p-6 space-y-4 bg-white border border-[#E6E8E5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E8E5] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center font-bold text-lg">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#252B2B]">{p.name}</h3>
                      <Badge variant={p.verification_status === 'verified' ? 'success' : p.verification_status === 'pending' ? 'warning' : 'danger'}>
                        {p.verification_status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#687474] font-semibold">{p.business_name} • {p.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.verification_status !== 'verified' ? (
                    <Button variant="primary" size="sm" onClick={() => handleApprove(p.id)} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      Approve Credentials
                    </Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => handleReject(p.id)} leftIcon={<XCircle className="w-3.5 h-3.5" />}>
                      Revoke / Suspend
                    </Button>
                  )}
                </div>
              </div>

              {/* Details & Documents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#FAF9F6] rounded-xl space-y-1 border border-[#E6E8E5]">
                  <span className="font-bold text-[#687474] uppercase text-[10px]">Contact Info</span>
                  <div className="font-bold text-[#252B2B]">{p.phone}</div>
                  <div className="text-[#687474]">{p.email}</div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-xl space-y-1 border border-[#E6E8E5]">
                  <span className="font-bold text-[#687474] uppercase text-[10px]">Specialization</span>
                  <div className="font-bold text-[#252B2B] capitalize">{p.provider_type.replace('_', ' ')}</div>
                  <div className="text-[#687474]">{p.skills.join(', ')}</div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-xl space-y-1 border border-[#E6E8E5]">
                  <span className="font-bold text-[#687474] uppercase text-[10px]">Submitted Document</span>
                  {p.documents.map((d) => (
                    <div key={d.id} className="font-mono font-bold text-[#252B2B]">
                      {d.document_type.toUpperCase()}: {d.document_number}
                    </div>
                  ))}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Displaying verified government identity document modal (Simulated)');
                    }}
                    className="text-[#0F766E] hover:underline font-bold block mt-1"
                  >
                    View Document File
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
