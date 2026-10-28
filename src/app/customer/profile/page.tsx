'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/customer/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Profile & Saved Addresses</h1>
          <p className="text-xs text-[#687474]">Manage contact information and emergency dispatch addresses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* User Profile Card */}
          <Card className="md:col-span-5 space-y-4 bg-white border-[#E6E8E5]">
            <div className="flex items-center gap-3 border-b border-[#E6E8E5] pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center font-bold text-xl">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#252B2B]">{user?.name}</h3>
                <p className="text-xs text-[#687474]">{user?.email}</p>
                <Badge variant="success" size="sm" className="mt-1">Verified Customer</Badge>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#687474] block">Mobile Number</span>
                <span className="font-bold text-[#252B2B]">{user?.phone}</span>
              </div>
              <div>
                <span className="text-[#687474] block">Account Perspective</span>
                <span className="font-bold text-[#252B2B] uppercase">{user?.role}</span>
              </div>
              <div>
                <span className="text-[#687474] block">Primary Service Hub</span>
                <span className="font-bold text-[#252B2B]">Bengaluru (Karnataka)</span>
              </div>
            </div>
          </Card>

          {/* Saved Addresses */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#252B2B]">Saved Locations</h3>
              <Button variant="primary" size="sm" onClick={() => setIsAddressModalOpen(true)} className="bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<Plus className="w-4 h-4" />}>
                Add Address
              </Button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <Card key={addr.id} className="p-4 space-y-2 bg-white border-[#E6E8E5]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#252B2B] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0F766E]" />
                      {addr.label}
                    </span>
                    {addr.is_default && <Badge variant="info">Default GPS</Badge>}
                  </div>
                  <p className="text-xs text-[#687474]">{addr.street}</p>
                  {addr.landmark && (
                    <p className="text-xs text-[#687474]">Near: {addr.landmark}</p>
                  )}
                  <p className="text-[11px] text-[#687474]/70 font-mono">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Address Modal */}
        <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add Saved Address">
          <form onSubmit={handleAddAddress} className="space-y-4 text-xs text-[#252B2B]">
            <div>
              <label className="block font-semibold mb-1">Label</label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="Home">Home</option>
                <option value="Office">Office / Workplace</option>
                <option value="Highway Hub">Highway / Frequent Route</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Flat / Building, Street / Road"
                required
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Behind Central Mall"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddressModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]">
                Save Location
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
