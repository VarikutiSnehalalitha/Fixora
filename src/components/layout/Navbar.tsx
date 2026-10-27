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
  LogOut,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top emergency announcement bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-emergency-500 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            24/7 Nationwide Rapid Roadside & Home Repair Dispatch
          </span>
          <span className="hidden md:inline text-slate-400">| Emergency Helpline: 1800-FIX-NOW (24x7 Free)</span>
        </div>
        
        {/* Role switcher pill */}
        <div className="hidden sm:flex items-center gap-2 relative">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Layers className="w-3 h-3 text-brand-400" /> Switch Demo Role:
          </span>
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span className="capitalize">{currentUser?.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  Select User Perspective
                </div>
                <button
                  onClick={() => handleRoleSwitch('customer')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Customer</div>
                    <div className="text-[10px] text-slate-500">Book, Track & Pay</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('mechanic')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Vehicle Mechanic</div>
                    <div className="text-[10px] text-slate-500">Incoming Jobs & Quotes</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('appliance_tech')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Appliance Tech</div>
                    <div className="text-[10px] text-slate-500">Repairs & Diagnosis</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('fuel_partner')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  <Fuel className="w-3.5 h-3.5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Authorized Fuel Partner</div>
                    <div className="text-[10px] text-slate-500">PESO Regulated Dispensing</div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <div>
                    <div className="font-semibold text-slate-800">System Administrator</div>
                    <div className="text-[10px] text-slate-500">Verifications & Analytics</div>
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md group-hover:bg-brand-800 transition-colors">
              <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                <span>FixNow</span>
                <span className="text-xs bg-emergency-600 text-white font-bold px-1.5 py-0.5 rounded-md">
                  24/7
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 -mt-0.5 tracking-wide">
                ASSISTANCE & REPAIR PLATFORM
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link
              href="/emergency"
              className="flex items-center gap-1.5 text-emergency-600 hover:text-emergency-700 font-bold px-3 py-1.5 rounded-lg hover:bg-emergency-50 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>Emergency Help</span>
            </Link>
            <Link
              href="/services/vehicle"
              className="hover:text-brand-600 transition-colors flex items-center gap-1.5"
            >
              <Car className="w-4 h-4 text-slate-400" />
              <span>Vehicle Breakdown</span>
            </Link>
            <Link
              href="/services/appliance"
              className="hover:text-brand-600 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Home Appliances</span>
            </Link>
            <Link
              href="/services/fuel"
              className="hover:text-brand-600 transition-colors flex items-center gap-1.5"
            >
              <Fuel className="w-4 h-4 text-slate-400" />
              <span>Emergency Fuel</span>
            </Link>
            <Link
              href="/petroleum-compliance"
              className="hover:text-brand-600 text-xs font-medium text-slate-500 transition-colors"
            >
              PESO Compliance
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href={getDashboardLink()}>
              <Button variant="outline" size="sm" leftIcon={<User className="w-4 h-4" />}>
                Dashboard ({currentUser?.role})
              </Button>
            </Link>

            <Link href="/emergency">
              <Button
                variant="emergency"
                size="sm"
                leftIcon={<AlertTriangle className="w-4 h-4" />}
                className="emergency-pulse"
              >
                Instant SOS
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/emergency">
              <button className="bg-emergency-600 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>SOS</span>
              </button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Switch View Role</div>
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
                      ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-700'
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
              className="p-2.5 rounded-lg bg-emergency-50 text-emergency-700 font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Help (Instant 1-Click)</span>
            </Link>
            <Link
              href="/services/vehicle"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-slate-500" />
              <span>Vehicle Breakdown & Towing</span>
            </Link>
            <Link
              href="/services/appliance"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home Appliance Servicing</span>
            </Link>
            <Link
              href="/services/fuel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center gap-2"
            >
              <Fuel className="w-4 h-4 text-slate-500" />
              <span>Regulated Fuel Delivery</span>
            </Link>
            <Link
              href={getDashboardLink()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-100 text-slate-900 font-bold flex items-center gap-2"
            >
              <User className="w-4 h-4 text-brand-600" />
              <span>Go to {currentUser?.role} Dashboard</span>
            </Link>
            <Link
              href="/provider/apply"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-brand-200 text-brand-700 font-bold flex items-center gap-2"
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
