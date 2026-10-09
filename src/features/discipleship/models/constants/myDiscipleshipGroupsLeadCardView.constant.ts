import {
  ArrowLeft,
  User,
  UserMinus,
  ChevronRight,
  MapPin,
  Video,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  Store,
  Calendar,
  Check,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  MyDiscipleshipGroupsLeadCardViewConfig,
  GroupMemberActionSheetIcons,
  GroupMemberActionSheetConfig,
  SetGatheringScheduleModalConfig,
  SetGatheringScheduleModalIcons,
  DayOfWeek,
  RecurrenceType,
} from "../types/myDiscipleshipGroupsLeadCardView.types";

/* ── View Icons ──────────────────────────────────────────────────────── */
export const MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS: Record<string, LucideIcon> = {
  back: ArrowLeft,
  group: Users,
  chevronDown: ChevronDown,
};

/* ── Set Gathering Schedule Modal Constants ──────────────────────────── */
export const SET_GATHERING_SCHEDULE_MODAL_ICONS: SetGatheringScheduleModalIcons = {
  physical: MapPin,
  virtual: Video,
  hybrid: SlidersHorizontal,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  clock: Clock,
  location: Store,
  calendar: Calendar,
  check: Check,
  trash: Trash2,
};

export const SET_GATHERING_SCHEDULE_DAY_OPTIONS: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SET_GATHERING_SCHEDULE_RECURRENCE_OPTIONS: RecurrenceType[] = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
];

export const SET_GATHERING_SCHEDULE_HOURS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const SET_GATHERING_SCHEDULE_MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

export const SET_GATHERING_SCHEDULE_PERIODS: ("AM" | "PM")[] = ["AM", "PM"];

export const setGatheringScheduleModalConst: SetGatheringScheduleModalConfig = {
  title: "Set Gathering Schedule",
  subtitle: "Choose when and where your group will meet.",
  editTitle: "Edit Gathering Schedule",
  editSubtitle: "Changes will update all member schedules immediately.",
  meetingFormatLabel: "MEETING FORMAT",
  formatPhysicalLabel: "Physical",
  formatVirtualLabel: "Virtual",
  formatHybridLabel: "Hybrid",
  dayOfWeekLabel: "DAY OF WEEK",
  dayOfWeekPlaceholder: "Select day",
  recurrenceLabel: "RECURRENCE",
  gatheringTimeLabel: "GATHERING TIME",
  editingLabel: "Editing",
  selectTimeLabel: "SELECT TIME",
  doneButtonLabel: "Done",
  meetingLocationLabel: "MEETING LOCATION",
  meetingLocationPlaceholder: "e.g. Antioch Hall, Room 204 or address",
  meetingLinkLabel: "MEETING LINK",
  meetingLinkPlaceholder: "e.g. https://zoom.us/j/... or Google Meet link",
  saveButtonLabel: "Save Gathering Schedule",
  saveChangesButtonLabel: "Save Changes",
  removeScheduleButtonLabel: "Remove Schedule",
  removeScheduleConfirmTitle: "Remove Gathering Schedule",
  removeScheduleConfirmDescription:
    "Are you sure you want to remove this gathering schedule? The group will show as having no upcoming schedule.",
  removeScheduleConfirmLabel: "Remove Schedule",
  cancelButtonLabel: "Cancel",
  dayOptions: SET_GATHERING_SCHEDULE_DAY_OPTIONS,
  recurrenceOptions: SET_GATHERING_SCHEDULE_RECURRENCE_OPTIONS,
  hours: SET_GATHERING_SCHEDULE_HOURS,
  minutes: SET_GATHERING_SCHEDULE_MINUTES,
  periods: SET_GATHERING_SCHEDULE_PERIODS,
  icons: SET_GATHERING_SCHEDULE_MODAL_ICONS,
};

/* ── Group Member Action Sheet Constants ─────────────────────────────── */
export const GROUP_MEMBER_ACTION_SHEET_ICONS: GroupMemberActionSheetIcons = {
  viewDetails: User,
  removeMember: UserMinus,
  chevronRight: ChevronRight,
};

export const groupMemberActionSheetConst: GroupMemberActionSheetConfig = {
  viewDetailsLabel: "View Member Details",
  viewDetailsDescription: "Contact phone, email, and spiritual background.",
  removeMemberLabel: "Remove from Group",
  removeMemberDescription: "Unenroll member, open capacity slot, and",
  cancelButtonLabel: "Cancel",
  enrolledPrefix: "Enrolled",
  icons: GROUP_MEMBER_ACTION_SHEET_ICONS,
};

/* ── Lead Card View Main Config ──────────────────────────────────────── */
export const myDiscipleshipGroupsLeadCardViewConst: MyDiscipleshipGroupsLeadCardViewConfig = {
  buttonBackLabel: "Groups I Lead",
  activeBadgeLabel: "Active",
  pausedBadgeLabel: "Paused",
  membersSuffix: "Members",
  groupRosterHeaderTitle: "GROUP ROSTER",
  scheduleSectionHeaderTitle: "MEETING SCHEDULE",
  currentStudyHeaderTitle: "CURRENT STUDY",
  openJourneyButtonLabel: "Open Reading in Journey Tab",
  editScheduleButtonLabel: "Edit Schedule & Location",
  memberActionSheet: groupMemberActionSheetConst,
};

export default myDiscipleshipGroupsLeadCardViewConst;
