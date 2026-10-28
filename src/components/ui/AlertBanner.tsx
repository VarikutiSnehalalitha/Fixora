import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

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
      bg: 'bg-[#EAF5F2] border-[#A7D9CD] text-[#083B38]',
      icon: <Info className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-[#EAF4EE] border-[#B8DEC9] text-[#10432E]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#21845B] shrink-0 mt-0.5" />
    },
    warning: {
      bg: 'bg-[#FEF9EE] border-[#FBE2AC] text-[#753E0A]',
      icon: <AlertTriangle className="w-5 h-5 text-[#D99119] shrink-0 mt-0.5" />
    },
    emergency: {
      bg: 'bg-[#FEF9EE] border-[#FBE2AC] text-[#753E0A]',
      icon: <AlertCircle className="w-5 h-5 text-[#D99119] shrink-0 mt-0.5" />
    }
  };

  const config = configs[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1">
        {title && <h5 className="font-semibold text-[#252B2B] mb-0.5">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
