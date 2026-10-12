import { Link, type LinkProps } from 'react-router-dom';
import {
  baseButtonStyles,
  sizeStyles,
  variantStyles,
  type ButtonSize,
  type ButtonVariant,
} from './button.style';

export interface LinkButtonProps extends Omit<LinkProps, 'to'> {
  to?: LinkProps['to'];
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function LinkButton({
  children,
  to = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`${baseButtonStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : 'w-auto'} no-underline text-center ${className}`.trim()}
      {...props}
    >
      {children}
    </Link>
  );
}
