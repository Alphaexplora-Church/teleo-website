import type { LucideIcon } from "lucide-react";
import { Calendar, Plus } from "lucide-react";
import type { MyDiscipleshipGroupsLeadScheduleEmptyStateConfig } from "../types/myDiscipleshipGroupsLeadScheduleEmptyState.types";

export const MY_DISCIPLESHIP_GROUPS_LEAD_SCHEDULE_EMPTY_STATE_ICONS: Record<string, LucideIcon> = {
  calendar: Calendar,
  plus: Plus,
};

export const myDiscipleshipGroupsLeadScheduleEmptyStateConst: MyDiscipleshipGroupsLeadScheduleEmptyStateConfig = {
  headerTitle: "MEETING SCHEDULE",
  title: "No Gathering Schedule Set",
  description:
    "Coordinate with your members and set up your regular meeting day, time, and location or video link.",
  setScheduleButtonLabel: "Set Schedule & Location",
};

export default myDiscipleshipGroupsLeadScheduleEmptyStateConst;
