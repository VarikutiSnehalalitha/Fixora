'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fixNowStore } from '@/lib/store';
import { SupportTicket, AuditLog } from '@/types';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setTickets(fixNowStore.getSupportTickets());
    setAuditLogs(fixNowStore.getAuditLogs());
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href="/admin" className="text-xs font-bold text-[#687474] hover:text-[#252B2B] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-[#252B2B]">Support Tickets & System Audit Trail</h1>
          <p className="text-xs text-[#687474]">Immutable audit logs of sensitive operations, status shifts and refunds.</p>
        </div>

        {/* Support Tickets */}
        <Card className="space-y-4 bg-white border border-[#E6E8E5]">
          <h3 className="font-bold text-sm text-[#252B2B] border-b border-[#E6E8E5] pb-2">
            Open Customer Inquiries & Disputes
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 bg-[#FAF9F6] rounded-xl border border-[#E6E8E5] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#687474]">{t.ticket_number}</span>
                    <Badge variant={t.status === 'resolved' ? 'success' : 'warning'}>{t.status.toUpperCase()}</Badge>
                    <span className="text-[#687474] font-semibold">• {t.category.toUpperCase()}</span>
                  </div>
                  <span className="text-[#687474]">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-[#252B2B] text-sm">{t.subject}</h4>
                <div className="text-[#687474] italic">Customer: {t.user_name} ({t.user_email})</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Logs */}
        <Card className="space-y-4 bg-white border border-[#E6E8E5]">
          <div className="flex items-center justify-between border-b border-[#E6E8E5] pb-2">
            <h3 className="font-bold text-sm text-[#252B2B] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#0F766E]" />
              Administrative Audit Logs
            </h3>
            <span className="text-xs text-[#687474]">Total Entries: {auditLogs.length}</span>
          </div>

          <div className="divide-y divide-[#E6E8E5]">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#252B2B]">{log.action}</span>
                    <Badge variant="neutral" size="sm">{log.actor_role}</Badge>
                  </div>
                  <div className="text-[#687474]">
                    Resource: <strong className="text-[#252B2B]">{log.target_resource}</strong> (ID: {log.target_id})
                  </div>
                  <div className="text-[11px] text-[#687474] font-mono">
                    {JSON.stringify(log.details)}
                  </div>
                </div>
                <span className="text-[11px] text-[#687474] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
