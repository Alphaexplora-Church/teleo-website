import type { MyDiscipleshipGroupsDashboardConfig } from "../types/myDiscipleshipGroupsDashboard.types";

export const myDiscipleshipGroupsDashboardConst: MyDiscipleshipGroupsDashboardConfig = {
  // Header
  headerTitle: "My Discipleships",
  headerSubtitle: "Groups you are part of",
  exploreButtonLabel: "+ Explore",

  // Section Headers
  activeGroupsHeader: "ACTIVE GROUPS",
  pendingApplicationsHeader: "PENDING APPLICATIONS",
  pausedGroupsHeader: "PAUSED GROUPS",

  // Badge Labels
  activeBadgeLabel: "Active",
  pendingBadgeLabel: "Pending",
  pausedBadgeLabel: "Paused",

  // Card Content & Notices
  pendingStatusTitle: "Church leadership is reviewing your answers",
  pendingResponseEstimatePrefix: "Estimated response in ",
  pendingApplicationSubtitle: "Discipleship Application · Submitted today",

  pausedMeetingNotice: "Meeting reminders and notifications paused",

  defaultActiveMeetingTime: "Tomorrow at 7:00 PM",
  defaultActiveMeetingTopic: "Romans 8: Life in the Spirit",

  // Action Labels
  openGroupRoomActionLabel: "Open group room",
  trackApplicationActionLabel: "Track application status",
  resumeGroupActionLabel: "Resume or view room",
};
