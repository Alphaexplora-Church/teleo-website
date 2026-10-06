import type React from "react";
import type { LucideIcon } from "lucide-react";
import type {
  ChurchLeadGroupData,
  LeadGroupItem,
  LeadGroupStatus,
} from "../../components/ChurchLeadGroupSection";

export type { ChurchLeadGroupData, LeadGroupItem, LeadGroupStatus };

export type MyDiscipleshipGroupsLeadDashboardViewIcons = Record<string, LucideIcon>;

export interface MyDiscipleshipGroupsLeadDashboardConfig {
  /** Page header title, e.g. "Groups I Lead" */
  headerTitle: string;
  /** Page header subtitle, e.g. "Discipleship groups under your care" */
  headerSubtitle: string;
  /** Label for manage group button row, e.g. "Manage group & roster" */
  manageActionLabel: string;
  /** Suffix for member count, e.g. "Members" */
  membersSuffix: string;
  /** Singular church group suffix, e.g. "Group" */
  singleGroupSuffix: string;
  /** Plural church groups suffix, e.g. "Groups" */
  multipleGroupsSuffix: string;
  /** Status badge label for active groups, e.g. "Active" */
  activeBadgeLabel: string;
  /** Status badge label for paused groups, e.g. "Paused" */
  pausedBadgeLabel: string;
}

export type MyDiscipleshipGroupsLeadDashboardViewConfig = MyDiscipleshipGroupsLeadDashboardConfig;

export interface MyDiscipleshipGroupsLeadDashboardViewProps {
  /** Static UI copy configuration */
  config?: MyDiscipleshipGroupsLeadDashboardConfig;
  /** List of church lead group sections */
  churchSections?: ChurchLeadGroupData[];
  /** Callback fired when manage group is clicked */
  onManageGroup?: (groupId: string, group: LeadGroupItem) => void;
  /** Optional header right-side action or avatar node */
  headerAction?: React.ReactNode;
  /** Custom wrapper styling */
  className?: string;
}

export type MyDiscipleshipGroupsLeadDashboardProps = MyDiscipleshipGroupsLeadDashboardViewProps;
