import type { LucideIcon } from "lucide-react";
import type { DiscipleshipGroupMock } from "../mocks/discipleshipDashboard.mocks";

export type MyDiscipleshipGroupsActivePauseViewIcons = Record<string, LucideIcon>;

// ── Dynamic Data Interfaces (Props / Mocks / API) ─────────────
export interface ActiveGroupGatheringData {
  timing: string;
  subtitle?: string;
  location: string;
  virtual_link: string;
  gathering_type?: string;
}

export interface ActiveGroupStudyData {
  module_badge?: string;
  title: string;
  lesson_subtitle: string;
}

export interface ActiveGroupData {
  id: string;
  church_id: number;
  church_name: string;
  name: string;
  leader_id: string;
  leader_name: string;
  members_count?: number;
  image_url?: string | null;
  status: "active" | "paused" | "archived";
  role?: "leader" | "member";
  next_gathering?: ActiveGroupGatheringData;
  this_week_question?: string;
  current_study?: ActiveGroupStudyData;
}

// ── Static UI Copy Configuration (Pure UI Labels & Headers) ────
export interface MyDiscipleshipGroupsActivePauseViewConfig {
  groupRoomTitle: string;
  buttonBackLabel: string;
  activeBadgeLabel: string;
  pausedBadgeLabel: string;
  hybridBadgeLabel: string;
  membersSuffix: string;

  // Paused Banner
  takingBreakNotice: string;
  resumeButtonLabel: string;

  // Next Gathering Card
  nextGatheringHeader: string;
  copyButtonLabel: string;
  copiedButtonLabel: string;

  // This Week's Question Card
  thisWeekQuestionHeader: string;
  questionFootnoteText: string;

  // Current Study Card
  currentStudyHeader: string;
  openJourneyButtonLabel: string;

  // Membership Settings Section (Active)
  membershipSettingsHeader: string;
  pauseMembershipButtonLabel: string;
  pauseMembershipHint: string;
  leaveGroupButtonLabel: string;

  // Membership Actions (Paused)
  leaveGroupPermanentlyButtonLabel: string;
  leaveGroupPermanentlyHint: string;

  // Confirmation Modals
  leaveGroupModalTitle: string;
  leaveGroupModalDescriptionPrefix: string;
  leaveGroupModalDescriptionSuffix: string;
  leaveGroupModalConfirmLabel: string;
  leaveGroupModalCancelLabel: string;

  pauseMembershipModalTitle: string;
  pauseMembershipModalDescription: string;
  pauseMembershipModalConfirmLabel: string;
  pauseMembershipModalCancelLabel: string;
}

export interface MyDiscipleshipGroupsActivePauseViewProps {
  groupId?: string;
  group?: ActiveGroupData | DiscipleshipGroupMock;
  config?: MyDiscipleshipGroupsActivePauseViewConfig;
  onBack?: () => void;
  onOpenJourneyReading?: (studyTitle: string) => void;
  onPauseMembership?: (groupId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  onLeaveGroup?: (groupId: string) => void;
  className?: string;
}

// Backward-compatible type aliases
export type MyDiscipleshipGroupsActiveViewConfig = MyDiscipleshipGroupsActivePauseViewConfig;
export type MyDiscipleshipGroupsActiveViewProps = MyDiscipleshipGroupsActivePauseViewProps;
