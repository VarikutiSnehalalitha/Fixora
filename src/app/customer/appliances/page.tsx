'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Plus, Trash2, ArrowLeft, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { Appliance } from '@/types';

export default function CustomerAppliancesPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<Appliance['category']>('refrigerator');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [purchaseYear, setPurchaseYear] = useState(2022);

  const loadAppliances = () => {
    setAppliances(fixNowStore.getAppliances());
  };

  useEffect(() => {
    loadAppliances();
  }, []);

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    fixNowStore.addAppliance({
      user_id: 'usr-customer-001',
      category,
      brand,
      model_number: modelNumber,
      purchase_year: Number(purchaseYear)
    });

    loadAppliances();
    setIsModalOpen(false);
    setBrand('');
    setModelNumber('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this appliance record?')) {
      fixNowStore.deleteAppliance(id);
      loadAppliances();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/customer/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Add New Appliance
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Saved Home Appliances</h1>
          <p className="text-xs text-slate-500">Record home equipment for fast warranty servicing & OEM spare diagnosis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appliances.map((a) => (
            <Card key={a.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{a.brand}</h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase">{a.category.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.model_number || 'Model on file'}</p>
                  </div>
                </div>
                <Badge variant="warning">Covered</Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <Link href={`/book?category=${a.category}-repair&type=appliance`}>
                  <Button variant="outline" size="sm" leftIcon={<Wrench className="w-3.5 h-3.5" />}>
                    Request Repair
                  </Button>
                </Link>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-rose-600 hover:text-rose-800 p-1 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Home Appliance">
          <form onSubmit={handleAddAppliance} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appliance Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="refrigerator">Refrigerator / Freezer</option>
                <option value="washing_machine">Washing Machine / Dryer</option>
                <option value="air_conditioner">Air Conditioner (AC)</option>
                <option value="television">Smart TV / OLED</option>
                <option value="microwave">Microwave & Oven</option>
                <option value="water_purifier">RO Water Purifier</option>
                <option value="dishwasher">Dishwasher</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Samsung, LG, Daikin"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model / Serial Number</label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. RT34T4513S8"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Appliance
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
