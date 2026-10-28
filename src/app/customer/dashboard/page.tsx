'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Home,
  Fuel,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { Booking, Vehicle, Appliance } from '@/types';

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  useEffect(() => {
    setBookings(fixNowStore.getBookings());
    setVehicles(fixNowStore.getVehicles());
    setAppliances(fixNowStore.getAppliances());
  }, []);

  const activeBookings = bookings.filter(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6E8E5] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">Customer Portal</Badge>
              <span className="text-xs text-[#687474]">• Rahul Sharma</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#252B2B]">
              Assistance & Asset Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/emergency">
              <Button variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<AlertTriangle className="w-4 h-4 text-[#D99119]" />}>
                Instant SOS
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4 text-[#0F766E]" />}>
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Active In-Progress Bookings */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-[#252B2B] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E] animate-ping"></span>
              Live Active Bookings ({activeBookings.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBookings.map((bkg) => (
                <Card key={bkg.id} className="p-5 border-l-4 border-l-[#0F766E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#687474]">{bkg.booking_number}</span>
                    <Badge status={bkg.status} />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#252B2B]">{bkg.issue_title}</h3>
                    <p className="text-xs text-[#687474] mt-0.5 line-clamp-1">{bkg.location.address}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E6E8E5] flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-[#687474]">Specialist: </span>
                      <strong className="text-[#252B2B]">{bkg.provider_name || 'Dispatching...'}</strong>
                    </div>
                    <Link href={`/tracking/${bkg.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Live GPS Tracking
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Assets Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicles Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#0F766E]" />
                <h3 className="font-bold text-[#252B2B]">Registered Vehicles ({vehicles.length})</h3>
              </div>
              <Link href="/customer/vehicles" className="text-xs font-bold text-[#0F766E] hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-[#E6E8E5]">
              {vehicles.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#252B2B]">{v.make} {v.model}</div>
                    <div className="text-[#687474] font-mono">{v.license_plate} • {v.fuel_type.toUpperCase()}</div>
                  </div>
                  <Badge variant="neutral">{v.type.toUpperCase()}</Badge>
                </div>
              ))}
            </div>

            <Link href="/customer/vehicles">
              <Button variant="outline" size="sm" className="w-full" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Vehicle
              </Button>
            </Link>
          </Card>

          {/* Appliances Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-3">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-[#21845B]" />
                <h3 className="font-bold text-[#252B2B]">Home Appliances ({appliances.length})</h3>
              </div>
              <Link href="/customer/appliances" className="text-xs font-bold text-[#0F766E] hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-[#E6E8E5]">
              {appliances.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#252B2B]">{a.brand} {a.category.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-[#687474]">{a.model_number || 'Model on file'}</div>
                  </div>
                  <span className="text-[10px] text-[#21845B] bg-[#EAF4EE] px-2 py-0.5 rounded font-semibold border border-[#B8DEC9]">
                    Covered
                  </span>
                </div>
              ))}
            </div>

            <Link href="/customer/appliances">
              <Button variant="outline" size="sm" className="w-full" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Appliance
              </Button>
            </Link>
          </Card>
        </div>

        {/* Quick Links Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/customer/bookings" className="p-4 bg-white rounded-2xl border border-[#E6E8E5] text-center hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all shadow-sm">
            <Calendar className="w-5 h-5 text-[#0F766E] mx-auto mb-1" />
            <div className="text-xs font-bold text-[#252B2B]">All Bookings</div>
            <div className="text-[10px] text-[#687474]">History & Receipts</div>
          </Link>
          <Link href="/customer/profile" className="p-4 bg-white rounded-2xl border border-[#E6E8E5] text-center hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all shadow-sm">
            <MapPin className="w-5 h-5 text-[#0F766E] mx-auto mb-1" />
            <div className="text-xs font-bold text-[#252B2B]">Addresses</div>
            <div className="text-[10px] text-[#687474]">Saved GPS Hubs</div>
          </Link>
          <Link href="/services/fuel" className="p-4 bg-white rounded-2xl border border-[#E6E8E5] text-center hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all shadow-sm">
            <Fuel className="w-5 h-5 text-[#8C6D3B] mx-auto mb-1" />
            <div className="text-xs font-bold text-[#252B2B]">Fuel Supply</div>
            <div className="text-[10px] text-[#687474]">PESO Authorized</div>
          </Link>
          <Link href="/customer/support" className="p-4 bg-white rounded-2xl border border-[#E6E8E5] text-center hover:border-[#0F766E] hover:bg-[#FAF9F6] transition-all shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#21845B] mx-auto mb-1" />
            <div className="text-xs font-bold text-[#252B2B]">Support & Help</div>
            <div className="text-[10px] text-[#687474]">24/7 Helpline</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
