import { type ButtonHTMLAttributes } from 'react';
import {
  baseButtonStyles,
  sizeStyles,
  variantStyles,
  type ButtonSize,
  type ButtonVariant,
} from './button.style';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseButtonStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
