import type { ElementType } from "react";
import type { LucideIcon } from "lucide-react";

// ── Icon Type (PascalCase & Exported) ────────────────────────
export type DiscipleshipIcon = LucideIcon | ElementType<{ className?: string }>;

// ── Button Props ─────────────────────────────────────────────
export interface ButtonDiscipleshipProps {
  to?: string;
  label?: string;
  icon?: DiscipleshipIcon;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  className?: string;
}

// ── Discipleship Empty State Props ───────────────────────────
export interface DiscipleshipEmptyStateProps {
  icon: DiscipleshipIcon;
  titleHeader: string;
  joinCard: {
    title: string;
    description: string;
    buttonJoin: ButtonDiscipleshipProps;
  };
}

// ── Discipleship Church Props ─────────────────────────────────
export interface DiscipleshipChurch {
  church_id: number;
  name: string;
  is_home_church: boolean;
  active_groups_count: number;
}

// ── Discipleship Empty State List Props Config ────────────────
export interface DiscipleshipEmptyStateListPropsConfig {
  homeChurchHeader: string;
  exploreOtherHeader: string;
  noChurchesCallout: string;
  homeChurchBadgeLabel: string;
  activeGroupsLabel: string;
}
