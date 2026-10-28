import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emergency' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  const variantClasses = {
    primary:
      'bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-sm hover:shadow focus:ring-[#0F766E] active:scale-[0.99]',
    emergency:
      'bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-sm hover:shadow focus:ring-[#0F766E] font-semibold active:scale-[0.99] border border-[#0F766E]/20',
    secondary:
      'bg-white hover:bg-[#FAF9F6] text-[#252B2B] border border-[#E6E8E5] hover:border-[#0F766E] hover:text-[#0F766E] focus:ring-[#0F766E]',
    outline:
      'border border-[#E6E8E5] bg-white hover:bg-[#FAF9F6] text-[#252B2B] hover:border-[#0F766E] hover:text-[#0F766E] focus:ring-[#0F766E]',
    ghost:
      'text-[#687474] hover:text-[#252B2B] hover:bg-[#FAF9F6] focus:ring-[#0F766E]',
    danger:
      'bg-[#FDF2F4] text-[#B91C35] border border-[#F7CCD3] hover:bg-[#FBE4E7] focus:ring-[#B91C35]'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
