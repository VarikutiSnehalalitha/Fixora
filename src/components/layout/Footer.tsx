import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF9F6] text-[#252B2B] pt-16 pb-12 border-t border-[#E6E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statutory Emergency Disclaimer Banner */}
        <div className="mb-12 p-4 bg-[#FEF9EE] rounded-2xl border border-[#FBE2AC] flex items-start gap-3 text-xs sm:text-sm text-[#753E0A]">
          <AlertCircle className="w-5 h-5 text-[#D99119] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#252B2B]">Emergency Dispatch Advisory:</strong> {APP_NAME} provides rapid vehicle breakdown, towing, home appliance troubleshooting, and strictly PESO-authorized roadside fuel logistics. This service is <span className="font-semibold text-[#BA730F] underline">not a replacement</span> for national police, fire or emergency medical services. In case of bodily injury or physical danger, please dial <strong>112</strong> immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#252B2B]">
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-[#687474] leading-relaxed pr-6">
              {APP_TAGLINE}. Connecting stranded motorists and home owners with nearby verified, background-checked specialists within minutes across India.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#687474]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F766E]" />
                <span>24x7 Emergency Toll-Free: <strong className="text-[#252B2B]">1800-FIX-NOW (1800-349-669)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F766E]" />
                <span>Regulatory Inquiries: support@fixnow247.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <span>Central Operations Hub: Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103</span>
              </div>
            </div>
          </div>

          {/* Vehicle & Roadside */}
          <div>
            <h4 className="text-xs font-bold text-[#252B2B] uppercase tracking-wider mb-4">
              Roadside Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#687474]">
              <li>
                <Link href="/services/vehicle" className="hover:text-[#0F766E] transition-colors">
                  Car Breakdown & Mechanics
                </Link>
              </li>
              <li>
                <Link href="/services/vehicle" className="hover:text-[#0F766E] transition-colors">
                  Bike Puncture & Tube Repair
                </Link>
              </li>
              <li>
                <Link href="/services/vehicle" className="hover:text-[#0F766E] transition-colors">
                  Battery Jump-Start & Boost
                </Link>
              </li>
              <li>
                <Link href="/services/vehicle" className="hover:text-[#0F766E] transition-colors">
                  Flatbed & Wheel-Lift Towing
                </Link>
              </li>
              <li>
                <Link href="/services/vehicle" className="hover:text-[#0F766E] transition-colors">
                  Key Lockout Safe Extraction
                </Link>
              </li>
              <li>
                <Link href="/services/fuel" className="hover:text-[#0F766E] transition-colors">
                  Emergency Fuel Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Home Appliance Services */}
          <div>
            <h4 className="text-xs font-bold text-[#252B2B] uppercase tracking-wider mb-4">
              Home Appliances
            </h4>
            <ul className="space-y-2.5 text-xs text-[#687474]">
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  Refrigerator Not Cooling
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  Washing Machine Drain & Spin
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  Split & Window AC Servicing
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  Smart LED Television Repair
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  Microwave & Convection Oven
                </Link>
              </li>
              <li>
                <Link href="/services/appliance" className="hover:text-[#0F766E] transition-colors">
                  RO Water Purifier Filter Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner & Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#252B2B] uppercase tracking-wider mb-4">
              Partners & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#687474]">
              <li>
                <Link href="/provider/apply" className="hover:text-[#0F766E] transition-colors font-medium text-[#0F766E]">
                  Mechanic / Tech Registration
                </Link>
              </li>
              <li>
                <Link href="/fuel-partner/apply" className="hover:text-[#0F766E] transition-colors font-medium text-[#0F766E]">
                  PESO Fuel Partner Sign-Up
                </Link>
              </li>
              <li>
                <Link href="/petroleum-compliance" className="hover:text-[#0F766E] transition-colors">
                  Petroleum Rules 2002 Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0F766E] transition-colors">
                  Privacy Policy & Geolocation
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0F766E] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="hover:text-[#0F766E] transition-colors">
                  Cancellation & Refund Rules
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 border-t border-[#E6E8E5] text-xs text-[#687474] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} FixNow 24/7 Technologies India Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#687474]">
              <Shield className="w-3.5 h-3.5 text-[#21845B]" />
              100% Background-Verified Specialists
            </span>
            <span>•</span>
            <span>256-Bit SSL Encrypted Transactions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
