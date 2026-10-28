'use client';

import React from 'react';
import Link from 'next/link';
import { User, Car, Home, Fuel, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function RegisterRoleSelectionPage() {
  const roles = [
    {
      title: 'Customer / Motorist',
      desc: 'Book instant roadside assistance, vehicle maintenance, and home appliance repairs.',
      href: '/register?role=customer',
      icon: User,
      color: 'bg-[#EAF5F2] text-[#0F766E]'
    },
    {
      title: 'Vehicle Mechanic / Towing Partner',
      desc: 'Join as a verified roadside provider. Receive emergency breakdown jobs in your city.',
      href: '/provider/apply?type=mechanic',
      icon: Car,
      color: 'bg-[#DDEFE7] text-[#21845B]'
    },
    {
      title: 'Home Appliance Technician',
      desc: 'Provide repair services for refrigerators, washing machines, ACs, microwaves & TVs.',
      href: '/provider/apply?type=appliance',
      icon: Home,
      color: 'bg-[#FAF9F6] border border-[#E6E8E5] text-[#0F766E]'
    },
    {
      title: 'PESO Authorized Fuel Partner',
      desc: 'Apply as a certified roadside fuel delivery partner with verified PESO authorization.',
      href: '/fuel-partner/apply',
      icon: Fuel,
      color: 'bg-[#F3EBDD] text-[#D99119]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="teal">Account Registration</Badge>
          <h1 className="text-3xl font-black text-[#252B2B] tracking-tight">Select Your Role</h1>
          <p className="text-xs sm:text-sm text-[#687474]">
            FixNow 24/7 provides dedicated workflows tailored to each user type.
          </p>
        </div>

        <div className="space-y-4">
          {roles.map((r, idx) => {
            const Icon = r.icon;
            return (
              <Link key={idx} href={r.href} className="block">
                <Card hoverEffect className="p-5 flex items-center justify-between gap-4 bg-white border border-[#E6E8E5]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${r.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#252B2B]">{r.title}</h3>
                      <p className="text-xs text-[#687474] mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#687474] shrink-0" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
