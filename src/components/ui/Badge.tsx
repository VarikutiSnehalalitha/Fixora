import React from 'react';
import { BookingStatus } from '@/types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'emergency' | 'neutral' | 'info';
  status?: BookingStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  className = ''
}) => {
  let finalVariant = variant || 'default';

  if (status) {
    switch (status) {
      case 'COMPLETED':
      case 'QUOTE_APPROVED':
        finalVariant = 'success';
        break;
      case 'REQUESTED':
      case 'SEARCHING':
      case 'DIAGNOSING':
      case 'QUOTE_PENDING':
        finalVariant = 'warning';
        break;
      case 'PROVIDER_ASSIGNED':
      case 'PROVIDER_EN_ROUTE':
      case 'ARRIVED':
      case 'IN_PROGRESS':
        finalVariant = 'info';
        break;
      case 'CANCELLED':
      case 'NO_PROVIDER_AVAILABLE':
      case 'DISPUTED':
        finalVariant = 'emergency';
        break;
      case 'REFUND_PENDING':
      case 'REFUNDED':
        finalVariant = 'neutral';
        break;
    }
  }

  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-300', // Warning is clearly amber/gold
    emergency: 'bg-red-900 text-white border-red-800 shadow-sm font-bold', // Authoritative rescue crimson, not warning-like
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  const displayText = children || (status ? status.replace(/_/g, ' ') : '');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[finalVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {displayText}
    </span>
  );
};
