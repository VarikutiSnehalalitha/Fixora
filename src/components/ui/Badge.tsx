import React from 'react';
import { BookingStatus } from '@/types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'emergency' | 'neutral' | 'info' | 'teal' | 'danger';
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
    default: 'bg-[#FAF9F6] text-[#687474] border-[#E6E8E5]',
    success: 'bg-[#EAF4EE] text-[#21845B] border-[#B8DEC9]',
    warning: 'bg-[#FEF9EE] text-[#B47510] border-[#FBE2AC]',
    emergency: 'bg-[#FEF9EE] text-[#D99119] border-[#FBE2AC]',
    info: 'bg-[#EAF5F2] text-[#0F766E] border-[#A7D9CD]',
    teal: 'bg-[#EAF5F2] text-[#0F766E] border-[#A7D9CD]',
    danger: 'bg-[#FDF2F2] text-[#B91C35] border-[#F8D7DA]',
    neutral: 'bg-[#FAF9F6] text-[#687474] border-[#E6E8E5]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold'
  };

  const displayText = children || (status ? status.replace(/_/g, ' ') : '');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[finalVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {displayText}
    </span>
  );
};
