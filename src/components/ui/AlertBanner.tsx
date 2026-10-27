import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface AlertBannerProps {
  type?: 'info' | 'success' | 'warning' | 'emergency';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  children,
  className = ''
}) => {
  const configs = {
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-950', // Genuine warning/caution
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
    },
    emergency: {
      bg: 'bg-gradient-to-r from-slate-900 to-red-950 border border-red-800 text-slate-100 shadow-sm', // Professional rescue notice
      icon: <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
    }
  };

  const config = configs[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1">
        {title && <h5 className={`font-bold mb-0.5 ${type === 'emergency' ? 'text-white' : 'text-slate-900'}`}>{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
