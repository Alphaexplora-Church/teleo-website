import type { DiscipleshipDashboardMock } from "../mocks/discipleshipDashboard.mocks";

export interface MyDiscipleshipGroupsDashboardConfig {
  // Header
  headerTitle: string;
  headerSubtitle: string;
  exploreButtonLabel: string;

  // Section Headers
  activeGroupsHeader: string;
  pendingApplicationsHeader: string;
  pausedGroupsHeader: string;

  // Badge Labels
  activeBadgeLabel: string;
  pendingBadgeLabel: string;
  pausedBadgeLabel: string;

  // Card Content & Notices
  pendingStatusTitle: string;
  pendingResponseEstimatePrefix: string;
  pendingApplicationSubtitle: string;

  pausedMeetingNotice: string;

  defaultActiveMeetingTime: string;
  defaultActiveMeetingTopic: string;

  // Action Labels
  openGroupRoomActionLabel: string;
  trackApplicationActionLabel: string;
  resumeGroupActionLabel: string;
}

export interface MyDiscipleshipGroupsDashboardProps {
  config?: MyDiscipleshipGroupsDashboardConfig;
  dashboardData?: DiscipleshipDashboardMock;
  onNavigateToChurchList?: () => void;
  onOpenGroupRoom?: (groupId: string) => void;
  onTrackApplication?: (applicationId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  className?: string;
}
