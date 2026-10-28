'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Bike, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { Vehicle } from '@/types';

export default function CustomerVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New vehicle form state
  const [type, setType] = useState<'car' | 'bike' | 'suv' | 'ev' | 'commercial'>('car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'cng'>('petrol');

  const loadVehicles = () => {
    setVehicles(fixNowStore.getVehicles());
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !licensePlate) return;

    fixNowStore.addVehicle({
      user_id: 'usr-customer-001',
      type,
      make,
      model,
      year: Number(year),
      license_plate: licensePlate.toUpperCase(),
      fuel_type: fuelType
    });

    loadVehicles();
    setIsModalOpen(false);
    setMake('');
    setModel('');
    setLicensePlate('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this vehicle?')) {
      fixNowStore.deleteVehicle(id);
      loadVehicles();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/customer/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Vehicle
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Saved Vehicles</h1>
          <p className="text-xs text-[#687474]">Manage multiple vehicles for rapid 1-click roadside dispatch.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((v) => (
            <Card key={v.id} className="p-5 flex flex-col justify-between space-y-4 bg-white border-[#E6E8E5]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5F2] text-[#0F766E] flex items-center justify-center">
                    {v.type === 'bike' ? <Bike className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#252B2B]">{v.make} {v.model}</h3>
                    <p className="text-xs font-mono font-bold text-[#687474]">{v.license_plate}</p>
                  </div>
                </div>
                <Badge variant="info">{v.fuel_type.toUpperCase()}</Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E6E8E5] text-xs text-[#687474]">
                <span>Model Year: <strong className="text-[#252B2B]">{v.year}</strong></span>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-[#B91C35] hover:text-[#97152B] p-1 flex items-center gap-1 font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
          <form onSubmit={handleAddVehicle} className="space-y-4 text-xs text-[#252B2B]">
            <div>
              <label className="block font-semibold mb-1">Vehicle Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="car">Hatchback / Sedan</option>
                <option value="suv">SUV / MUV</option>
                <option value="bike">Two-Wheeler / Motorcycle</option>
                <option value="ev">Electric Vehicle (EV)</option>
                <option value="commercial">Light Commercial Vehicle</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Make / Brand</label>
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Hyundai, Tata, Honda"
                  required
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Creta, Nexon, Activa"
                  required
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">License Plate Number</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="e.g. KA 05 MN 4821"
                  required
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl uppercase font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric (EV)</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]">
                Save Vehicle
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
