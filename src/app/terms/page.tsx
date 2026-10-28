import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Terms & Conditions</Badge>
          <h1 className="text-3xl font-black text-[#252B2B] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#687474]">Last updated: October 2026</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-[#687474] leading-relaxed bg-white border border-[#E6E8E5]">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">1. Nature of the Service</h2>
            <p>
              FixNow 24/7 provides an online marketplace matching customers with independent certified service providers including automotive mechanics, appliance technicians, towing operators, and legally authorized fuel delivery logistics partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">2. Emergency Disclaimer</h2>
            <p>
              FixNow is not a replacement for civil police, ambulance, or emergency medical response services. In circumstances involving life danger or severe highway collision, dial national emergency 112 immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">3. Quotes and Additional Authorizations</h2>
            <p>
              Initial dispatch covers travel, basic tools, and diagnostic inspection. Technicians must provide an itemized quote before replacing components or initiating major repair procedures. Chargeable repair work begins only after customer digital approval.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">4. Petroleum Compliance</h2>
            <p>
              Fuel deliveries are subject to the Petroleum Rules 2002 and PESO directives. Customers agree not to order fuel for commercial resale or use unapproved containers.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
