'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Fuel,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, FuelPartnerAuthorization } from '@/types';

export default function FuelPartnerDashboardPage() {
  const [auth, setAuth] = useState<FuelPartnerAuthorization | null>(null);
  const [fuelOrders, setFuelOrders] = useState<Booking[]>([]);
  const [otpInput, setOtpInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<Booking | null>(null);

  useEffect(() => {
    const authList = fixNowStore.getFuelAuthorizations();
    if (authList.length > 0) setAuth(authList[0]);

    const bookings = fixNowStore.getBookings();
    const orders = bookings.filter((b) => b.service_type === 'emergency_fuel');
    setFuelOrders(orders);

    const active = orders.find((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
    setActiveOrder(active || null);
  }, []);

  const handleVerifyFuelOtp = (bookingId: string) => {
    if (!otpInput) {
      alert('Please enter customer delivery verification OTP');
      return;
    }

    const verified = fixNowStore.verifyCompletionOtp(bookingId, otpInput);
    if (verified) {
      alert('Delivery Handover Confirmed! Quantity delivered logged under PESO compliance.');
      setFuelOrders(fixNowStore.getBookings().filter((b) => b.service_type === 'emergency_fuel'));
      setActiveOrder(null);
      setOtpInput('');
    } else {
      alert('Invalid Customer Handover OTP code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emergency">PESO Statutory Terminal</Badge>
              <span className="text-xs text-slate-400 font-mono">
                License: {auth?.peso_license_number || 'PESO/SC/2023/BLR-0892'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {auth?.company_name || 'SafeFuel Logistics (BPCL Partner)'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/petroleum-compliance">
              <Button variant="outline" size="sm">
                Petroleum Rules 2002
              </Button>
            </Link>
          </div>
        </div>

        {/* License Verification Badge Card */}
        <div className="bg-emerald-950 text-emerald-100 p-6 rounded-3xl border border-emerald-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-white text-base">Active Statutory PESO Authorization</span>
            </div>
            <p className="text-xs text-emerald-300 leading-relaxed">
              Approved for emergency roadside dispensing up to <strong>20L Diesel</strong> in certified tanks and <strong>5L Petrol</strong> in sealed canisters.
            </p>
          </div>
          <div className="text-right text-xs shrink-0">
            <div className="text-emerald-400 font-semibold">Safety Expiry Date</div>
            <div className="font-mono font-bold text-white text-sm">{auth?.license_expiry_date || '2028-12-31'}</div>
          </div>
        </div>

        {/* Active Regulated Fuel Order */}
        {activeOrder && (
          <Card className="p-6 border-l-4 border-l-purple-600 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500">{activeOrder.booking_number}</span>
              <Badge status={activeOrder.status} />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">{activeOrder.issue_title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeOrder.location.address}</span>
              </p>
            </div>

            <div className="p-3 bg-purple-50 text-purple-900 rounded-xl text-xs space-y-1">
              <div>Customer: <strong>{activeOrder.customer_name}</strong> ({activeOrder.customer_phone})</div>
              <div>Stranded Reason: <em>&quot;{activeOrder.fuel_details?.reason_for_emergency || 'Low fuel'}&quot;</em></div>
              <div>Authorized Quantity: <strong>{activeOrder.fuel_details?.quantity_liters || 10} Litres</strong></div>
            </div>

            {/* Handover OTP Verification */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                Verify physical handover using the customer&apos;s 4-digit completion code:
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Customer OTP"
                  className="px-3 py-1.5 text-xs font-mono font-bold w-32 border border-slate-200 rounded-lg text-center"
                />
                <Button variant="primary" size="sm" onClick={() => handleVerifyFuelOtp(activeOrder.id)}>
                  Confirm Delivery
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Orders Log */}
        <Card className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Regulated Emergency Fuel Delivery Audit History
          </h3>

          <div className="divide-y divide-slate-100">
            {fuelOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{ord.issue_title}</div>
                  <div className="text-slate-500">{ord.location.address} • {new Date(ord.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">₹{ord.provider_payout}</span>
                  <Badge status={ord.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
