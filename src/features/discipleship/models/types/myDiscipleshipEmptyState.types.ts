import type {
  ComponentIcon,
  SharedButtonProps,
} from "../../../../shared/models/types/components.types";


// ── My Discipleship Empty State Props ────────────────────────
export interface MyDiscipleshipEmptyStateProps {
  icon: ComponentIcon;
  titleHeader: string;
  joinCard: {
    title: string;
    description: string;
    buttonJoin: SharedButtonProps;
  };
}

// ── Discipleship Church Props ─────────────────────────────────
export interface DiscipleshipChurch {
  church_id: number;
  name: string;
  is_home_church: boolean;
  active_groups_count: number;
  city?: string;
}

// ── My Discipleship Empty State List Props Config ────────────
export interface MyDiscipleshipEmptyStateListPropsConfig {
  homeChurchHeader: string;
  exploreOtherHeader: string;
  noChurchesCallout: string;
  homeChurchBadgeLabel: string;
  activeGroupsLabel: string;
  buttonMore: SharedButtonProps;
  maxDisplayedChurches?: number;
}
