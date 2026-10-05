import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Copy,
  Check,
  Quote,
  Lock,
  BookOpen,
  ArrowRight,
  CirclePause,
  PauseCircle,
  LogOut,
} from "lucide-react";
import type { MyDiscipleshipGroupsActivePauseViewConfig } from "../types/myDiscipleshipGroupsActivePauseView.types";

export const MY_DISCIPLESHIP_GROUPS_ACTIVE_PAUSE_VIEW_ICONS: Record<string, LucideIcon> = {
  back: ChevronLeft,
  pausedBanner: CirclePause,
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  video: Video,
  copy: Copy,
  copied: Check,
  quote: Quote,
  lock: Lock,
  study: BookOpen,
  openReading: ArrowRight,
  pauseMembership: PauseCircle,
  leaveGroup: LogOut,
};

export const myDiscipleshipGroupsActivePauseViewConst: MyDiscipleshipGroupsActivePauseViewConfig = {
  // Navigation & Header
  groupRoomTitle: "Group Room",
  buttonBackLabel: "My Discipleships",
  activeBadgeLabel: "ACTIVE",
  pausedBadgeLabel: "PAUSED",
  hybridBadgeLabel: "Hybrid",
  membersSuffix: "Members",

  // Paused Banner
  takingBreakNotice: "Taking a break · Meeting reminders are muted",
  resumeButtonLabel: "Resume",

  // Next Gathering Card
  nextGatheringHeader: "NEXT GATHERING",
  copyButtonLabel: "Copy",
  copiedButtonLabel: "Copied!",

  // This Week's Question Card
  thisWeekQuestionHeader: "THIS WEEK'S QUESTION",
  questionFootnoteText: "Read-only reflection prompt from your church.",

  // Current Study Card
  currentStudyHeader: "CURRENT STUDY",
  openJourneyButtonLabel: "Open Reading in Journey Tab",

  // Membership Settings Section (Active)
  membershipSettingsHeader: "MEMBERSHIP SETTINGS",
  pauseMembershipButtonLabel: "Pause Membership",
  pauseMembershipHint:
    "Temporarily turn off meeting reminders without leaving the group",
  leaveGroupButtonLabel: "Leave Group",

  // Membership Actions (Paused)
  leaveGroupPermanentlyButtonLabel: "Leave Group Permanently",
  leaveGroupPermanentlyHint:
    "Leaving removes your membership and frees up your spot.",

  // Leave Group Confirmation Modal
  leaveGroupModalTitle: "Leave Discipleship Group?",
  leaveGroupModalDescriptionPrefix: "Are you sure you want to leave ",
  leaveGroupModalDescriptionSuffix:
    "? You will no longer receive meeting updates or access group resources.",
  leaveGroupModalConfirmLabel: "Yes, Leave Group",
  leaveGroupModalCancelLabel: "Stay in Group",

  // Pause Membership Confirmation Modal
  pauseMembershipModalTitle: "Pause Membership?",
  pauseMembershipModalDescription:
    "Your meeting reminders and notifications will be paused. You can resume membership anytime.",
  pauseMembershipModalConfirmLabel: "Pause Reminders",
  pauseMembershipModalCancelLabel: "Keep Active",
};

// Backward-compatible constant alias
export { myDiscipleshipGroupsActivePauseViewConst as myDiscipleshipGroupsActiveViewConst };
export default myDiscipleshipGroupsActivePauseViewConst;
