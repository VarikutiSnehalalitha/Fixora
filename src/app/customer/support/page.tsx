'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowLeft
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#252B2B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/customer/dashboard" className="text-xs font-bold text-[#687474] hover:text-[#0F766E] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#252B2B]">24/7 Help & Support Desk</h1>
            <p className="text-xs text-[#687474]">Incident reporting, regulatory voucher requests, and dispute resolution.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="bg-[#0F766E] hover:bg-[#0D645E]" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Support Ticket
          </Button>
        </div>

        {/* Toll-free banner - Light Teal Theme */}
        <div className="bg-[#EAF5F2] border border-[#A7D9CD] text-[#252B2B] p-5 rounded-2xl flex items-center justify-between text-xs shadow-sm">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#252B2B]">Need immediate phone escalation?</div>
            <p className="text-[#525D5D]">Our emergency operations desk is active 24 hours a day, 365 days a year.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#687474]">Toll-Free Helpline</div>
            <div className="text-base font-black text-[#0F766E]">1800-FIX-NOW</div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((tkt) => (
            <Card key={tkt.id} className="p-5 space-y-3 bg-white border-[#E6E8E5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#687474]">{tkt.ticket_number}</span>
                  <Badge variant={tkt.status === 'resolved' ? 'success' : 'warning'}>
                    {tkt.status.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-[#687474] capitalize">• Category: {tkt.category.replace('_', ' ')}</span>
                </div>
                <span className="text-xs font-semibold text-[#687474]">
                  {new Date(tkt.created_at).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-[#252B2B]">{tkt.subject}</h3>
              </div>

              {/* Message thread preview */}
              <div className="space-y-2 pt-2 border-t border-[#E6E8E5]">
                {tkt.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs ${
                      m.sender === 'support'
                        ? 'bg-[#EAF5F2] text-[#083B38] border border-[#A7D9CD]'
                        : 'bg-[#FAF9F6] border border-[#E6E8E5] text-[#252B2B]'
                    }`}
                  >
                    <div className="font-bold text-[10px] uppercase text-[#687474] mb-0.5">
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
          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs text-[#252B2B]">
            <div>
              <label className="block font-semibold text-[#252B2B] mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
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
              <label className="block font-semibold text-[#252B2B] mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                required
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#252B2B] mb-1">Detailed Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the incident or question..."
                required
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E6E8E5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0F766E] hover:bg-[#0D645E]">
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
