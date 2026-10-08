import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`h-12.75 ${
        fullWidth ? 'w-full' : 'w-77.5'
      } rounded-input bg-[#1f2156] text-white font-sans text-base font-medium transition-all duration-200 hover:bg-[#2c2f6d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
