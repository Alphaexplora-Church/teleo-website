// src/features/discipleship/models/types/myDiscipleshipEmptyStateView.types.ts
import type { LucideIcon } from "lucide-react";
import type {
  ComponentIcon,
  SharedButtonProps,
} from "../../../../shared/models/types/components.types";

export * from './discipleship.types';

export type MyDiscipleshipEmptyStateViewIcons = Record<string, LucideIcon>;

export interface MyDiscipleshipEmptyStateProps {
  icon: ComponentIcon;
  titleHeader: string;
  joinCard: {
    title: string;
    description: string;
    buttonJoin: SharedButtonProps;
  };
}

export interface MyDiscipleshipEmptyStateListPropsConfig {
  homeChurchHeader: string;
  exploreOtherHeader: string;
  noChurchesCallout: string;
  homeChurchBadgeLabel: string;
  activeGroupsLabel: string;
  buttonMore: SharedButtonProps;
  maxDisplayedChurches?: number;
}
