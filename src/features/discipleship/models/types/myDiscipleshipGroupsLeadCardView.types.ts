import type React from "react";
import type { LucideIcon } from "lucide-react";
import type {
  LeadGroupItem,
  GroupMemberItem,
  NextGatheringData,
} from "../mocks/discipleshipLead.mocks";

/* ── Common & View Icons ─────────────────────────────────────────────── */
export type MyDiscipleshipGroupsLeadCardViewIcons = Record<string, LucideIcon>;

/* ── Set Gathering Schedule Modal Types ──────────────────────────────── */
export type MeetingFormat = "physical" | "virtual" | "hybrid";

export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type RecurrenceType = "Weekly" | "Bi-weekly" | "Monthly";

export interface GatheringScheduleFormData {
  format: MeetingFormat;
  dayOfWeek: string;
  recurrence: string;
  startTime: string;
  location?: string;
  virtualLink?: string;
}

export type SetGatheringScheduleModalIcons = Record<string, LucideIcon>;

export interface SetGatheringScheduleModalConfig {
  title: string;
  subtitle: string;
  editTitle: string;
  editSubtitle: string;
  meetingFormatLabel: string;
  formatPhysicalLabel: string;
  formatVirtualLabel: string;
  formatHybridLabel: string;
  dayOfWeekLabel: string;
  dayOfWeekPlaceholder: string;
  recurrenceLabel: string;
  gatheringTimeLabel: string;
  editingLabel: string;
  selectTimeLabel: string;
  doneButtonLabel: string;
  meetingLocationLabel: string;
  meetingLocationPlaceholder: string;
  meetingLinkLabel: string;
  meetingLinkPlaceholder: string;
  saveButtonLabel: string;
  saveChangesButtonLabel: string;
  removeScheduleButtonLabel: string;
  removeScheduleConfirmTitle: string;
  removeScheduleConfirmDescription: string;
  removeScheduleConfirmLabel: string;
  cancelButtonLabel: string;
  dayOptions: DayOfWeek[];
  recurrenceOptions: RecurrenceType[];
  hours: string[];
  minutes: string[];
  periods: ("AM" | "PM")[];
  icons: SetGatheringScheduleModalIcons;
}

export interface SetGatheringScheduleModalProps {
  /** Controls visibility of the modal bottom sheet */
  isOpen?: boolean;
  /** Modal mode: "create" (default) or "edit" */
  mode?: "create" | "edit";
  /** UI copy and icon configuration */
  config?: SetGatheringScheduleModalConfig;
  /** Callback fired when user closes or dismisses modal */
  onClose?: () => void;
  /** Callback fired when user saves the gathering schedule */
  onSave?: (data: GatheringScheduleFormData) => void;
  /** Callback fired when user removes the gathering schedule */
  onRemoveSchedule?: () => void;
  /** Optional initial form values */
  initialData?: Partial<GatheringScheduleFormData>;
  /** Custom wrapper CSS class names */
  className?: string;
}

/* ── Group Member Action Sheet Types ─────────────────────────────────── */
export interface GroupMemberActionSheetIcons {
  viewDetails: LucideIcon;
  removeMember: LucideIcon;
  chevronRight: LucideIcon;
}

export interface GroupMemberActionSheetConfig {
  viewDetailsLabel: string;
  viewDetailsDescription: string;
  removeMemberLabel: string;
  removeMemberDescription: string;
  cancelButtonLabel: string;
  enrolledPrefix: string;
  icons: GroupMemberActionSheetIcons;
}

export interface MemberActionItem {
  id: string;
  label: string;
  description?: string;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick: () => void;
}

export interface GroupMemberActionSheetProps {
  /** Controls visibility of the action sheet */
  isOpen: boolean;
  /** Member item to display actions for */
  member?: GroupMemberItem | null;
  /** UI copy and icon configuration */
  config?: GroupMemberActionSheetConfig;
  /** Close / dismiss callback */
  onClose: () => void;
  /** Callback when user clicks 'View Member Details' */
  onViewDetails?: (member: GroupMemberItem) => void;
  /** Callback when user clicks 'Remove from Group' */
  onRemoveMember?: (member: GroupMemberItem) => void;
  /** Optional custom action list override */
  actions?: MemberActionItem[];
  /** Custom text for enrolled subtitle */
  enrolledText?: string;
  /** Custom wrapper CSS class names */
  className?: string;
}

/* ── Journey Module List Modal Types ─────────────────────────────────── */
export interface JourneyModuleListModalIcons {
  submitArrow: LucideIcon;
  check: LucideIcon;
}

export interface JourneyModuleListModalConfig {
  title: string;
  currentBadgeLabel: string;
  updateButtonLabel: string;
  cancelButtonLabel: string;
  icons?: JourneyModuleListModalIcons;
}

/* ── My Discipleship Groups Lead Card View Types ─────────────────────── */
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
  /** Edit schedule button label on NextGatheringCard */
  editScheduleButtonLabel: string;
  /** Configuration for member action sheet modal */
  memberActionSheet?: GroupMemberActionSheetConfig;
  /** Configuration for journey module list modal */
  journeyModuleModal?: JourneyModuleListModalConfig;
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
  /** Callback fired when editing an existing schedule */
  onEditSchedule?: () => void;
  /** Callback fired when schedule is saved from modal */
  onScheduleSaved?: (
    data: GatheringScheduleFormData,
    newGathering: NextGatheringData
  ) => void;
  /** Callback fired when removing an existing schedule */
  onRemoveSchedule?: () => void;
  /** Callback fired when schedule is removed and cleared to empty state */
  onScheduleRemoved?: () => void;
  /** Callback fired when group status changes (Active vs Paused) */
  onStatusChange?: (status: "Active" | "Paused") => void;
  /** Callback fired when clicking the journey reading action */
  onOpenJourneyReading?: (studyTitle: string) => void;
  /** Callback fired when clicking more options for a member */
  onMemberAction?: (member: GroupMemberItem) => void;
  /** Callback fired when clicking 'View Member Details' in action sheet */
  onViewMemberDetails?: (member: GroupMemberItem) => void;
  /** Callback fired when clicking 'Remove from Group' in action sheet */
  onRemoveMember?: (member: GroupMemberItem) => void;
  /** Custom wrapper styling */
  className?: string;
}
