import type React from "react";
import {
  baseBadgeStyles,
  sizeStyles,
  variantStyles,
  type BadgeSize,
  type BadgeVariant,
} from "./badge.style";

export interface BadgeProps {
  icon?: React.ReactNode;
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  classNameLabel?: string;
  classNameDot?: string;
  dotPosition?: "left" | "right";
  dotVisible?: boolean;
}

export function Badge({
  icon,
  label,
  variant = "default",
  size = "md",
  className = "",
  classNameLabel = "",
  classNameDot = "",
  dotPosition = "left",
  dotVisible = false,
}: BadgeProps) {
  const hasContent = Boolean(label || icon);
  const selectedVariant = variantStyles[variant] ?? variantStyles.default;
  const selectedSize = sizeStyles[size] ?? sizeStyles.md;

  const dotElement = dotVisible ? (
    <span
      className={`rounded-full shrink-0 ${
        hasContent ? selectedSize.dot : selectedSize.standaloneDot
      } ${selectedVariant.dot} ${classNameDot}`.trim()}
      aria-hidden="true"
    />
  ) : null;

  return (
    <span
      className={`
        ${baseBadgeStyles}
        ${selectedVariant.container}
        ${hasContent ? selectedSize.container : "p-1"}
        ${className}
      `.trim()}
    >
      {dotPosition === "left" && dotElement}
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
      {label && <span className={classNameLabel}>{label}</span>}
      {dotPosition === "right" && dotElement}
    </span>
  );
}

export default Badge;