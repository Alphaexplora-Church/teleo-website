import type { LucideIcon } from "lucide-react";
import type {
  SharedButtonProps,
  ComponentIcon,
} from "../../../../shared/models/types/components.types";
import type { DiscipleshipChurch } from "./myDiscipleshipEmptyStateView.types";

export type DiscipleshipProcessChurchListIcons = Record<string, LucideIcon>;

export interface DiscipleshipChurchItem extends DiscipleshipChurch {
  city?: string;
}

export interface DiscipleshipProcessChurchListConfig {
  buttonBack: SharedButtonProps;
  searchBar: {
    icon: ComponentIcon;
    clearIcon?: ComponentIcon;
    placeHolder?: string;
    placeholder?: string;
  };
  icons: {
    chevronRight: ComponentIcon;
  };
  homeChurchHeader: string;
  allChurchesHeader: string;
  homeBadgeLabel: string;
  applicationPendingBadgeLabel: string;
  activeGroupsSuffix: string;
  availableSuffix: string;
  noResultsMessage: string;
}

export type DiscipleshipChurchListProps = DiscipleshipProcessChurchListConfig;

export interface DiscipleshipProcessChurchListViewProps {
  config?: Partial<DiscipleshipProcessChurchListConfig>;
  churches?: DiscipleshipChurchItem[];
  pendingChurchIds?: number[];
  onSelectChurch?: (church: DiscipleshipChurchItem) => void;
  onBack?: () => void;
  className?: string;
}
