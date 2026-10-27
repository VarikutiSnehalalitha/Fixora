'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MapPin, Plus, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { UserProfile, CustomerAddress } from '@/types';

export default function CustomerProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // New address state
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('560103');

  useEffect(() => {
    setUser(fixNowStore.getCurrentUser());
    setAddresses(fixNowStore.getAddresses());
  }, []);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street) return;

    fixNowStore.addAddress({
      user_id: user?.id || 'usr-customer-001',
      label,
      street,
      landmark,
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode,
      lat: 12.9304,
      lng: 77.6784,
      is_default: addresses.length === 0
    });

    setAddresses(fixNowStore.getAddresses());
    setIsAddressModalOpen(false);
    setStreet('');
    setLandmark('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/customer/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Profile & Saved Addresses</h1>
          <p className="text-xs text-slate-500">Manage contact information and emergency dispatch addresses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* User Profile Card */}
          <Card className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{user?.name}</h3>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <Badge variant="success" size="sm" className="mt-1">Verified Customer</Badge>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Mobile Number</span>
                <span className="font-bold text-slate-900">{user?.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Account Role</span>
                <span className="font-bold text-slate-900 uppercase">{user?.role}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registered City</span>
                <span className="font-bold text-slate-900">Bengaluru (Karnataka)</span>
              </div>
            </div>
          </Card>

          {/* Saved Addresses */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Saved GPS Locations</h3>
              <Button variant="primary" size="sm" onClick={() => setIsAddressModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Add Address
              </Button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <Card key={addr.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      {addr.label}
                    </span>
                    {addr.is_default && <Badge variant="info">Default GPS</Badge>}
                  </div>
                  <p className="text-xs text-slate-600">{addr.street}</p>
                  {addr.landmark && (
                    <p className="text-xs text-slate-500">Near: {addr.landmark}</p>
                  )}
                  <p className="text-[11px] text-slate-400 font-mono">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Address Modal */}
        <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add Saved Address">
          <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Label</label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Home">Home</option>
                <option value="Office">Office / Workplace</option>
                <option value="Highway Hub">Highway / Frequent Route</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Flat / Building, Street / Road"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Behind Central Mall"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddressModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Location
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
