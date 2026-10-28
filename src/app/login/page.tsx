'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  User,
  Car,
  Home,
  Fuel,
  ShieldCheck,
  ArrowRight,
  Phone,
  Lock,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { DEMO_USERS } from '@/lib/constants';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', phone: emailOrPhone })
      });
      const data = await res.json();
      setIsOtpSent(true);
      if (data.devOtp) {
        setOtp(data.devOtp); // Auto-fill dev simulated OTP for smooth testing
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', phone: emailOrPhone, enteredOtp: otp })
      });
      const data = await res.json();
      if (data.success) {
        fixNowStore.switchRole('customer');
        router.push('/customer/dashboard');
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    fixNowStore.switchRole(role);
    switch (role) {
      case 'customer':
        router.push('/customer/dashboard');
        break;
      case 'mechanic':
      case 'appliance_tech':
        router.push('/provider/dashboard');
        break;
      case 'fuel_partner':
        router.push('/fuel-partner/dashboard');
        break;
      case 'admin':
        router.push('/admin');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0F766E] text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#252B2B]">Sign in to FixNow 24/7</h1>
          <p className="text-xs text-[#687474]">Secure OTP Authentication & Role Gate</p>
        </div>

        {/* Quick Demo Switcher */}
        <Card className="p-4 bg-[#EAF5F2]/40 border-[#0F766E]/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#252B2B]">
            <Layers className="w-4 h-4 text-[#0F766E]" />
            <span>Instant Demo 1-Click Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="p-2 bg-white rounded-lg border border-[#E6E8E5] text-left font-medium text-[#252B2B] hover:border-[#0F766E] flex items-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('mechanic')}
              className="p-2 bg-white rounded-lg border border-[#E6E8E5] text-left font-medium text-[#252B2B] hover:border-[#0F766E] flex items-center gap-1.5 transition-colors"
            >
              <Car className="w-3.5 h-3.5 text-[#21845B]" />
              <span>Mechanic</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('appliance_tech')}
              className="p-2 bg-white rounded-lg border border-[#E6E8E5] text-left font-medium text-[#252B2B] hover:border-[#0F766E] flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#D99119]" />
              <span>Appliance Tech</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('fuel_partner')}
              className="p-2 bg-white rounded-lg border border-[#E6E8E5] text-left font-medium text-[#252B2B] hover:border-[#0F766E] flex items-center gap-1.5 transition-colors"
            >
              <Fuel className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Fuel Partner</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="col-span-2 p-2 bg-white rounded-lg border border-[#E6E8E5] text-center font-bold text-[#0F766E] hover:border-[#0F766E] flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operations Administrator Console</span>
            </button>
          </div>
        </Card>

        {/* Standard Phone / OTP Form */}
        <Card className="p-6 space-y-4 bg-white border border-[#E6E8E5]">
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#687474] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E6E8E5] rounded-xl text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
                Send Verification OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-[#EAF5F2] border border-[#0F766E]/20 rounded-xl text-xs text-[#0F766E]">
                OTP code dispatched to {emailOrPhone}. (Dev auto-filled)
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#252B2B] mb-1">
                  4-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-white border border-[#E6E8E5] rounded-xl text-[#252B2B] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
                Verify & Continue
              </Button>
            </form>
          )}

          <div className="text-center pt-2 text-xs text-[#687474]">
            Don&apos;t have an account?{' '}
            <Link href="/register/role" className="font-bold text-[#0F766E] hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
