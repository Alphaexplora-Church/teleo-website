import type { LucideIcon } from "lucide-react";
import type {
  LeadGroupItem,
  GroupMemberItem,
} from "../mocks/discipleshipLead.mocks";

export type MyDiscipleshipGroupsLeadCardViewIcons = Record<string, LucideIcon>;

export interface MyDiscipleshipGroupsLeadCardViewConfig {
  /** Back button label */
  buttonBackLabel: string;
  /** Active status badge text */
  activeBadgeLabel: string;
  /** Paused status badge text */
  pausedBadgeLabel: string;
  /** Suffix for members count */
  membersSuffix: string;
  /** Header title for group roster section */
  groupRosterHeaderTitle: string;
  /** Header title for meeting schedule section */
  scheduleSectionHeaderTitle: string;
  /** Header title for current study section */
  currentStudyHeaderTitle: string;
  /** Action label for journey reading CTA */
  openJourneyButtonLabel: string;
}

export interface MyDiscipleshipGroupsLeadCardViewProps {
  /** Target lead group ID to load */
  groupId?: string;
  /** Full lead group item data (falls back to mock lookup) */
  group?: LeadGroupItem;
  /** Associated church name */
  churchName?: string;
  /** Static UI copy configuration */
  config?: MyDiscipleshipGroupsLeadCardViewConfig;
  /** Navigation callback to return to dashboard */
  onBack?: () => void;
  /** Callback fired when setting up a new schedule */
  onSetSchedule?: () => void;
  /** Callback fired when clicking the journey reading action */
  onOpenJourneyReading?: (studyTitle: string) => void;
  /** Callback fired when clicking more options for a member */
  onMemberAction?: (member: GroupMemberItem) => void;
  /** Custom wrapper styling */
  className?: string;
}
