import type { LucideIcon } from "lucide-react";
import { UserKey } from "lucide-react";
import type { MyDiscipleshipLeadCardProps } from "../types/myDiscipleshipLeadEmptyStateView.types";

export const MY_DISCIPLESHIP_LEAD_EMPTY_STATE_VIEW_ICONS: Record<string, LucideIcon> = {
  leaderRole: UserKey,
};

export const myDiscipleshipLeadCardConst: MyDiscipleshipLeadCardProps = {
  icon: MY_DISCIPLESHIP_LEAD_EMPTY_STATE_VIEW_ICONS.leaderRole,
  title: "You don't lead any groups yet",
  description:
    "Leadership roles are assigned by your church. Once designated as a Discipler, your group roster, schedule, and curriculum will appear here.",
};
