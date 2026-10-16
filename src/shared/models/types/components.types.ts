import type { ElementType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ── Common Icon Type ──────────────────────────────────────────
export type ComponentIcon = LucideIcon | ElementType<{ className?: string }>;

// ── Button Interfaces & Types ─────────────────────────────────
export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface SharedButtonProps {
  to?: string;
  label?: string;
  icon?: ComponentIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

// ── Badge Interfaces & Types ──────────────────────────────────
export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface SharedBadgeProps {
  label?: string;
  icon?: ComponentIcon | ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dotVisible?: boolean;
  dotPosition?: "left" | "right";
  className?: string;
  classNameLabel?: string;
  classNameDot?: string;
}
