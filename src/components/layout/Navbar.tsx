'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  AlertTriangle,
  Car,
  Home,
  Fuel,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fixNowStore } from '@/lib/store';
import { UserRole, UserProfile } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(fixNowStore.getCurrentUser());
  }, [pathname]);

  const handleRoleSwitch = (role: UserRole) => {
    const updated = fixNowStore.switchRole(role);
    setCurrentUser(updated);
    setIsRoleDropdownOpen(false);

    // Route to corresponding landing dashboard
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

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'mechanic':
      case 'appliance_tech':
        return '/provider/dashboard';
      case 'fuel_partner':
        return '/fuel-partner/dashboard';
      case 'admin':
        return '/admin';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6E8E5]">
      {/* Top announcement bar - clean, calm, warm off-white */}
      <div className="bg-[#FAF9F6] border-b border-[#E6E8E5] text-xs py-1.5 px-4 flex items-center justify-between text-[#687474]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-[#21845B]"></span>
          <span className="font-medium text-[#252B2B]">
            24/7 Nationwide Rapid Roadside & Home Repair Dispatch
          </span>
          <span className="hidden md:inline text-[#687474]">| Toll-Free Helpline: 1800-FIX-NOW (24x7)</span>
        </div>
        
        {/* Role switcher pill */}
        <div className="hidden sm:flex items-center gap-2 relative">
          <span className="text-[#687474] text-[11px] font-medium flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#0F766E]" /> Switch Perspective:
          </span>
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="bg-white hover:bg-[#FAF9F6] text-[#252B2B] px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border border-[#E6E8E5] flex items-center gap-1 transition-colors shadow-sm"
            >
              <span className="capitalize">{currentUser?.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-[#687474]" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white text-[#252B2B] rounded-xl shadow-xl border border-[#E6E8E5] py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#687474] border-b border-[#E6E8E5]">
                  Select User Perspective
                </div>
                <button
                  onClick={() => handleRoleSwitch('customer')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#0F766E]" />
                  <div>
                    <div className="font-semibold text-[#252B2B]">Customer</div>
                    <div className="text-[10px] text-[#687474]">Book, Track & Pay</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('mechanic')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] flex items-center gap-2"
                >
                  <Car className="w-3.5 h-3.5 text-[#21845B]" />
                  <div>
                    <div className="font-semibold text-[#252B2B]">Vehicle Mechanic</div>
                    <div className="text-[10px] text-[#687474]">Incoming Jobs & Quotes</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('appliance_tech')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5 text-[#D99119]" />
                  <div>
                    <div className="font-semibold text-[#252B2B]">Appliance Tech</div>
                    <div className="text-[10px] text-[#687474]">Repairs & Diagnosis</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('fuel_partner')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] flex items-center gap-2"
                >
                  <Fuel className="w-3.5 h-3.5 text-[#0F766E]" />
                  <div>
                    <div className="font-semibold text-[#252B2B]">Authorized Fuel Partner</div>
                    <div className="text-[10px] text-[#687474]">PESO Regulated Dispensing</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] flex items-center gap-2 border-t border-[#E6E8E5]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                  <div>
                    <div className="font-semibold text-[#252B2B]">System Administrator</div>
                    <div className="text-[10px] text-[#687474]">Verifications & Analytics</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with FixNow name in charcoal and a small teal 24/7 indicator */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm group-hover:bg-[#0D645E] transition-colors">
              <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#252B2B] flex items-center gap-1.5">
                <span>FixNow</span>
                <span className="text-[11px] bg-[#EAF5F2] text-[#0F766E] border border-[#0F766E]/20 font-bold px-1.5 py-0.5 rounded-md">
                  24/7
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#687474] -mt-0.5 tracking-wide">
                ASSISTANCE & REPAIR PLATFORM
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#252B2B]">
            <Link
              href="/emergency"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/emergency'
                  ? 'text-[#0F766E] bg-[#EAF5F2]'
                  : 'text-[#252B2B] hover:text-[#0F766E] hover:bg-[#FAF9F6]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-[#D99119]" />
              <span>Emergency Help</span>
            </Link>
            <Link
              href="/services/vehicle"
              className={`flex items-center gap-1.5 transition-colors ${
                pathname === '/services/vehicle'
                  ? 'text-[#0F766E] font-bold'
                  : 'text-[#252B2B] hover:text-[#0F766E]'
              }`}
            >
              <Car className="w-4 h-4 text-[#687474]" />
              <span>Vehicle Breakdown</span>
            </Link>
            <Link
              href="/services/appliance"
              className={`flex items-center gap-1.5 transition-colors ${
                pathname === '/services/appliance'
                  ? 'text-[#0F766E] font-bold'
                  : 'text-[#252B2B] hover:text-[#0F766E]'
              }`}
            >
              <Home className="w-4 h-4 text-[#687474]" />
              <span>Home Appliances</span>
            </Link>
            <Link
              href="/services/fuel"
              className={`flex items-center gap-1.5 transition-colors ${
                pathname === '/services/fuel'
                  ? 'text-[#0F766E] font-bold'
                  : 'text-[#252B2B] hover:text-[#0F766E]'
              }`}
            >
              <Fuel className="w-4 h-4 text-[#687474]" />
              <span>Emergency Fuel</span>
            </Link>
            <Link
              href="/petroleum-compliance"
              className={`text-xs font-medium transition-colors ${
                pathname === '/petroleum-compliance'
                  ? 'text-[#0F766E] font-bold'
                  : 'text-[#687474] hover:text-[#0F766E]'
              }`}
            >
              PESO Compliance
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href={getDashboardLink()}>
              <Button variant="outline" size="sm" leftIcon={<User className="w-4 h-4 text-[#687474]" />}>
                Dashboard ({currentUser?.role})
              </Button>
            </Link>

            <Link href="/emergency">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<AlertTriangle className="w-4 h-4 text-[#D99119]" />}
                className="bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-sm font-semibold"
              >
                Emergency SOS
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/emergency">
              <button className="bg-[#0F766E] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D99119]" />
                <span>SOS</span>
              </button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#687474] hover:text-[#252B2B] hover:bg-[#FAF9F6] border border-[#E6E8E5]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6E8E5] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5]">
            <div className="text-xs font-semibold text-[#687474] uppercase mb-2">Switch View Perspective</div>
            <div className="grid grid-cols-2 gap-2">
              {(['customer', 'mechanic', 'appliance_tech', 'fuel_partner', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleSwitch(r);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-xs p-2 rounded-lg text-left font-medium border ${
                    currentUser?.role === r
                      ? 'bg-[#EAF5F2] border-[#0F766E] text-[#0F766E] font-bold'
                      : 'bg-white border-[#E6E8E5] text-[#252B2B]'
                  }`}
                >
                  {r.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <Link
              href="/emergency"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#EAF5F2] text-[#0F766E] font-bold flex items-center gap-2 border border-[#A7D9CD]"
            >
              <AlertTriangle className="w-4 h-4 text-[#D99119]" />
              <span>Emergency Help (Instant Request)</span>
            </Link>
            <Link
              href="/services/vehicle"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[#FAF9F6] text-[#252B2B] flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-[#687474]" />
              <span>Vehicle Breakdown & Towing</span>
            </Link>
            <Link
              href="/services/appliance"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[#FAF9F6] text-[#252B2B] flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#687474]" />
              <span>Home Appliance Servicing</span>
            </Link>
            <Link
              href="/services/fuel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[#FAF9F6] text-[#252B2B] flex items-center gap-2"
            >
              <Fuel className="w-4 h-4 text-[#687474]" />
              <span>Regulated Fuel Delivery</span>
            </Link>
            <Link
              href={getDashboardLink()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-[#FAF9F6] text-[#252B2B] font-bold flex items-center gap-2 border border-[#E6E8E5]"
            >
              <User className="w-4 h-4 text-[#0F766E]" />
              <span>Go to {currentUser?.role} Dashboard</span>
            </Link>
            <Link
              href="/provider/apply"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-[#A7D9CD] text-[#0F766E] font-bold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Join as Verified Partner</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
