export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const baseButtonStyles =
  'inline-flex items-center justify-center font-semibold rounded-full font-sans select-none cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100';

export const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-navy text-white hover:bg-navy-hover active:bg-navy-active shadow-btn',
  outline:
    'border border-navy text-navy bg-transparent hover:bg-navy/5 active:bg-navy/10',
  ghost:
    'bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10 border-none shadow-none',
  danger:
    'bg-error text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

export const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-6 text-base gap-2.5',
};