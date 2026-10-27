'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Home,
  Fuel,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
  MapPin,
  Calendar,
  CreditCard,
  Zap
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">Customer Portal</Badge>
              <span className="text-xs text-slate-400">• Rahul Sharma</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Assistance & Asset Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/emergency">
              <Button variant="emergency" size="sm" leftIcon={<Zap className="w-4 h-4 fill-white" />}>
                Instant SOS
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Emergency / In-Progress Banner */}
        {activeBookings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700 animate-ping"></span>
              Live Active Bookings ({activeBookings.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBookings.map((bkg) => (
                <Card key={bkg.id} className="p-5 border-l-4 border-l-red-800 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">{bkg.booking_number}</span>
                    <Badge status={bkg.status} />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900">{bkg.issue_title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{bkg.location.address}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-500">Specialist: </span>
                      <strong className="text-slate-800">{bkg.provider_name || 'Dispatching...'}</strong>
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900">Registered Vehicles ({vehicles.length})</h3>
              </div>
              <Link href="/customer/vehicles" className="text-xs font-bold text-brand-600 hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{v.make} {v.model}</div>
                    <div className="text-slate-500 font-mono">{v.license_plate} • {v.fuel_type.toUpperCase()}</div>
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Home Appliances ({appliances.length})</h3>
              </div>
              <Link href="/customer/appliances" className="text-xs font-bold text-brand-600 hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {appliances.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{a.brand} {a.category.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-slate-500">{a.model_number || 'Model on file'}</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
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
          <Link href="/customer/bookings" className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-brand-500 transition-colors">
            <Calendar className="w-5 h-5 text-brand-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">All Bookings</div>
            <div className="text-[10px] text-slate-500">History & Receipts</div>
          </Link>
          <Link href="/customer/profile" className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-brand-500 transition-colors">
            <MapPin className="w-5 h-5 text-brand-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Addresses</div>
            <div className="text-[10px] text-slate-500">Saved GPS Hubs</div>
          </Link>
          <Link href="/services/fuel" className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-brand-500 transition-colors">
            <Fuel className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Fuel Supply</div>
            <div className="text-[10px] text-slate-500">PESO Authorized</div>
          </Link>
          <Link href="/customer/support" className="p-4 bg-white rounded-2xl border border-slate-200 text-center hover:border-brand-500 transition-colors">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Support & Help</div>
            <div className="text-[10px] text-slate-500">24/7 Helpline</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
