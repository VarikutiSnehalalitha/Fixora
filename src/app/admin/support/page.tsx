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
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href="/admin" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Support Tickets & System Audit Trail</h1>
          <p className="text-xs text-slate-500">Immutable audit logs of sensitive operations, status shifts and refunds.</p>
        </div>

        {/* Support Tickets */}
        <Card className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Open Customer Inquiries & Disputes
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600">{t.ticket_number}</span>
                    <Badge variant={t.status === 'resolved' ? 'success' : 'warning'}>{t.status.toUpperCase()}</Badge>
                    <span className="text-slate-500 font-semibold">• {t.category.toUpperCase()}</span>
                  </div>
                  <span className="text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{t.subject}</h4>
                <div className="text-slate-600 italic">Customer: {t.user_name} ({t.user_email})</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Logs */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand-600" />
              Administrative Audit Logs
            </h3>
            <span className="text-xs text-slate-400">Total Entries: {auditLogs.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{log.action}</span>
                    <Badge variant="neutral" size="sm">{log.actor_role}</Badge>
                  </div>
                  <div className="text-slate-500">
                    Resource: <strong className="text-slate-700">{log.target_resource}</strong> (ID: {log.target_id})
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {JSON.stringify(log.details)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
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
