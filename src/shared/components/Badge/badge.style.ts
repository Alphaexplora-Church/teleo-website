export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

export type BadgeSize = 'sm' | 'md';

export const baseBadgeStyles =
  'inline-flex items-center justify-center font-medium rounded-full select-none transition-colors duration-150';

export const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  default: {
    container: 'bg-[#F1F3F6] text-[#475569]',
    dot: 'bg-[#64748B]',
  },
  primary: {
    container: 'bg-[#0E172A] text-white',
    dot: 'bg-white',
  },
  success: {
    container: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  warning: {
    container: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  danger: {
    container: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  outline: {
    container: 'border border-slate-200 text-[#475569] bg-transparent',
    dot: 'bg-[#64748B]',
  },
};

export const sizeStyles: Record<BadgeSize, { container: string; dot: string; standaloneDot: string }> = {
  sm: {
    container: 'text-[11px] px-2 py-0.5 gap-1',
    dot: 'w-1.5 h-1.5',
    standaloneDot: 'w-2 h-2 p-0.5',
  },
  md: {
    container: 'text-xs px-2.5 py-0.5 gap-1.5',
    dot: 'w-1.5 h-1.5',
    standaloneDot: 'w-2.5 h-2.5 p-0.5',
  },
};
