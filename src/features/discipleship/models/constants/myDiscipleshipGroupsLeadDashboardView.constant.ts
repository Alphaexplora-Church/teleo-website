import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";
import type { MyDiscipleshipGroupsLeadDashboardConfig } from "../types/myDiscipleshipGroupsLeadDashboardView.types";

export const MY_DISCIPLESHIP_GROUPS_LEAD_DASHBOARD_VIEW_ICONS: Record<string, LucideIcon> = {
  headerUsers: Users,
};

export const myDiscipleshipGroupsLeadDashboardViewConst: MyDiscipleshipGroupsLeadDashboardConfig = {
  headerTitle: "Groups I Lead",
  headerSubtitle: "Discipleship groups under your care",
  manageActionLabel: "Manage group & roster",
  membersSuffix: "Members",
  singleGroupSuffix: "Group",
  multipleGroupsSuffix: "Groups",
  activeBadgeLabel: "Active",
  pausedBadgeLabel: "Paused",
};
