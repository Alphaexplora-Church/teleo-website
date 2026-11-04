import type {
  ComponentIcon,
  SharedButtonProps,
} from "../../../../shared/models/types/components.types";

export interface DiscipleshipUserGuestJoinCardConfig {
  icon?: ComponentIcon;
  title: string;
  description: string;
  buttonJoin: SharedButtonProps;
}

export interface DiscipleshipUserGuestChurchListConfig {
  homeChurchHeader: string;
  exploreOtherHeader: string;
}

export interface DiscipleshipUserGuestViewConfig {
  joinCard: DiscipleshipUserGuestJoinCardConfig;
  churchList: DiscipleshipUserGuestChurchListConfig;
}

export interface DiscipleshipUserGuestViewProps {
  /** Optional custom action when clicking Join a Discipleship (defaults to navigating to /welcome) */
  onJoin?: () => void;
  /** Optional configuration override for texts, headers, and buttons */
  config?: Partial<DiscipleshipUserGuestViewConfig>;
  /** Optional custom CSS class name */
  className?: string;
}
