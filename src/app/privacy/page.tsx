import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Legal & Data Protection</Badge>
          <h1 className="text-3xl font-black text-[#252B2B] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#687474]">Effective Date: October 2026 • Compliance with Digital Personal Data Protection Act</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-[#687474] leading-relaxed bg-white border border-[#E6E8E5]">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">1. Information We Collect</h2>
            <p>
              FixNow collects customer location telemetry strictly during active emergency requests to route the closest certified technician. We also collect contact information, vehicle details (make, model, license plate), appliance details, and itemized transaction invoices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">2. Geolocation Telemetry & Tracking</h2>
            <p>
              Your real-time GPS coordinates are broadcast solely to the assigned service technician and operations dispatch center while the job is active. Once a job reaches completed or cancelled status, live coordinate broadcasting terminates immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">3. Provider Identity & Background Checks</h2>
            <p>
              All technicians operating on FixNow undergo Aadhaar verification, commercial driving license validation, police background checks, and trade credential reviews. Identity documents are stored with AES-256 encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#252B2B]">4. Payment Security</h2>
            <p>
              FixNow does not store raw credit/debit card numbers on application servers. Payment processing is tokenized through PCI-DSS Level 1 compliant gateways (Razorpay).
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
