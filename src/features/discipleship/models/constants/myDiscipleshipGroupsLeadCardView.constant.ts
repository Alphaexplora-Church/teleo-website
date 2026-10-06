import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import type { MyDiscipleshipGroupsLeadCardViewConfig } from "../types/myDiscipleshipGroupsLeadCardView.types";

export const MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS: Record<string, LucideIcon> = {
  back: ChevronLeft,
};

export const myDiscipleshipGroupsLeadCardViewConst: MyDiscipleshipGroupsLeadCardViewConfig = {
  buttonBackLabel: "Groups I Lead",
  activeBadgeLabel: "Active",
  pausedBadgeLabel: "Paused",
  membersSuffix: "Members",
  groupRosterHeaderTitle: "GROUP ROSTER",
  scheduleSectionHeaderTitle: "MEETING SCHEDULE",
  currentStudyHeaderTitle: "CURRENT STUDY",
  openJourneyButtonLabel: "Open Reading in Journey Tab",
};

export default myDiscipleshipGroupsLeadCardViewConst;
