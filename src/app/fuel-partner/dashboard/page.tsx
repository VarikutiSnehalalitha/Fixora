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
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8E5] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal">PESO Statutory Terminal</Badge>
              <span className="text-xs text-[#687474] font-mono">
                License: {auth?.peso_license_number || 'PESO/SC/2023/BLR-0892'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#252B2B]">
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
        <div className="bg-[#EAF5F2] p-6 rounded-3xl border border-[#0F766E]/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
              <span className="font-extrabold text-[#252B2B] text-base">Active Statutory PESO Authorization</span>
            </div>
            <p className="text-xs text-[#687474] leading-relaxed">
              Approved for emergency roadside dispensing up to <strong className="text-[#252B2B]">20L Diesel</strong> in certified tanks and <strong className="text-[#252B2B]">5L Petrol</strong> in sealed canisters.
            </p>
          </div>
          <div className="text-right text-xs shrink-0">
            <div className="text-[#0F766E] font-semibold">Safety Expiry Date</div>
            <div className="font-mono font-bold text-[#252B2B] text-sm">{auth?.license_expiry_date || '2028-12-31'}</div>
          </div>
        </div>

        {/* Active Regulated Fuel Order */}
        {activeOrder && (
          <Card className="p-6 border-l-4 border-l-[#0F766E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#687474]">{activeOrder.booking_number}</span>
              <Badge status={activeOrder.status} />
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#252B2B]">{activeOrder.issue_title}</h3>
              <p className="text-xs text-[#687474] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#687474]" />
                <span>{activeOrder.location.address}</span>
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F6] text-[#252B2B] rounded-xl text-xs space-y-1 border border-[#E6E8E5]">
              <div>Customer: <strong className="text-[#252B2B]">{activeOrder.customer_name}</strong> ({activeOrder.customer_phone})</div>
              <div className="text-[#687474]">Stranded Reason: <em className="text-[#252B2B]">&quot;{activeOrder.fuel_details?.reason_for_emergency || 'Low fuel'}&quot;</em></div>
              <div>Authorized Quantity: <strong className="text-[#0F766E]">{activeOrder.fuel_details?.quantity_liters || 10} Litres</strong></div>
            </div>

            {/* Handover OTP Verification */}
            <div className="pt-2 border-t border-[#E6E8E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-[#687474]">
                Verify physical handover using the customer&apos;s 4-digit completion code:
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Customer OTP"
                  className="px-3 py-1.5 text-xs font-mono font-bold w-32 border border-[#E6E8E5] rounded-lg text-center bg-white text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
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
          <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
            Regulated Emergency Fuel Delivery Audit History
          </h3>

          <div className="divide-y divide-[#E6E8E5]">
            {fuelOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#252B2B]">{ord.issue_title}</div>
                  <div className="text-[#687474]">{ord.location.address} • {new Date(ord.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#21845B] block">₹{ord.provider_payout}</span>
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
