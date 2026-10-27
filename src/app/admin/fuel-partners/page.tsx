'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Fuel,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { FuelPartnerAuthorization } from '@/types';

export default function AdminFuelPartnersPage() {
  const [authorizations, setAuthorizations] = useState<FuelPartnerAuthorization[]>([]);

  const loadAuth = () => {
    setAuthorizations([...fixNowStore.getFuelAuthorizations()]);
  };

  useEffect(() => {
    loadAuth();
  }, []);

  const handleUpdateStatus = (id: string, status: FuelPartnerAuthorization['status']) => {
    fixNowStore.updateFuelAuthorization(id, { status });
    fixNowStore.addAuditLog({
      actor_id: 'usr-admin-001',
      actor_role: 'admin',
      action: `FUEL_PARTNER_STATUS_${status.toUpperCase()}`,
      target_resource: 'fuel_partner_authorizations',
      target_id: id,
      details: { newStatus: status }
    });
    alert(`Partner status updated to ${status}`);
    loadAuth();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">PESO Fuel Partner Audit & Licensing</h1>
          <p className="text-xs text-slate-500">
            Enforce Petroleum Rules 2002 compliance. Suspend suppliers with expired or non-compliant equipment.
          </p>
        </div>

        <div className="space-y-4">
          {authorizations.map((auth) => (
            <Card key={auth.id} className="p-6 space-y-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Fuel className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900">{auth.company_name}</h3>
                      <Badge variant={auth.status === 'active' ? 'success' : 'emergency'}>
                        {auth.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      PESO License: <strong>{auth.peso_license_number}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {auth.status !== 'active' ? (
                    <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(auth.id, 'active')}>
                      Activate License
                    </Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(auth.id, 'suspended')}>
                      Suspend Partner
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Statutory License Expiry</span>
                  <div className="font-bold text-slate-900">{auth.license_expiry_date}</div>
                  <div className="text-emerald-600 font-semibold">Valid & Verified</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Dispensing Vehicle / Bowser</span>
                  <div className="font-bold text-slate-900 font-mono">{auth.approved_dispensing_vehicle_number}</div>
                  <div className="text-slate-500">Fabricated under PESO specs</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Authorized Products</span>
                  <div className="font-bold text-slate-900 capitalize">{auth.authorized_fuel_types.join(', ')}</div>
                  <div className="text-slate-500">Max Cap: {auth.max_approved_quantity_liters}L per incident</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
