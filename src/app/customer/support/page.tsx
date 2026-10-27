'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fixNowStore } from '@/lib/store';
import { SupportTicket } from '@/types';

export default function CustomerSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('booking');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [message, setMessage] = useState('');

  const loadTickets = () => {
    setTickets(fixNowStore.getSupportTickets());
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    fixNowStore.createSupportTicket({
      subject,
      category,
      priority,
      messages: [
        {
          sender: 'user',
          text: message,
          timestamp: new Date().toISOString()
        }
      ]
    });

    loadTickets();
    setIsModalOpen(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/customer/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">24/7 Help & Support Desk</h1>
            <p className="text-xs text-slate-500">Incident reporting, regulatory voucher requests, and dispute resolution.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Support Ticket
          </Button>
        </div>

        {/* Toll-free banner */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between text-xs">
          <div className="space-y-1">
            <div className="font-bold text-sm">Need immediate phone escalation?</div>
            <p className="text-slate-400">Our emergency operations desk is active 24 hours a day, 365 days a year.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Toll-Free</div>
            <div className="text-base font-black text-brand-400">1800-FIX-NOW</div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((tkt) => (
            <Card key={tkt.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{tkt.ticket_number}</span>
                  <Badge variant={tkt.status === 'resolved' ? 'success' : 'warning'}>
                    {tkt.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-slate-400 capitalize">• Category: {tkt.category.replace('_', ' ')}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {new Date(tkt.created_at).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{tkt.subject}</h3>
              </div>

              {/* Message thread preview */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {tkt.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs ${
                      m.sender === 'support'
                        ? 'bg-blue-50 text-blue-900 border border-blue-100'
                        : 'bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-[10px] uppercase text-slate-500 mb-0.5">
                      {m.sender === 'support' ? 'FixNow Incident Specialist' : 'Customer'}
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Ticket Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Open Support Ticket">
          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="booking">Booking & Arrival Tracking</option>
                <option value="payment">Payment & Invoice Discrepancy</option>
                <option value="safety">Safety & Verification Incident</option>
                <option value="fuel_regulatory">PESO Fuel Compliance Certificate</option>
                <option value="provider_behavior">Technician Conduct</option>
                <option value="technical">App Technical Issue</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message Details</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry or dispute in detail..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
