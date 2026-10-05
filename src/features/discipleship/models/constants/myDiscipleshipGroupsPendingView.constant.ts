import type { LucideIcon } from "lucide-react";
import { ChevronLeft, Clock } from "lucide-react";
import type { MyDiscipleshipGroupsPendingViewConfig } from "../types/myDiscipleshipGroupsPendingView.types";

export const MY_DISCIPLESHIP_GROUPS_PENDING_VIEW_ICONS: Record<string, LucideIcon> = {
  back: ChevronLeft,
  clock: Clock,
};

export const myDiscipleshipGroupsPendingViewConst: MyDiscipleshipGroupsPendingViewConfig = {
  // Navigation & Page Title
  buttonBackLabel: "Back to My Discipleships",
  titleHeader: "Application Status",

  // Card Content & Badge
  pendingBadgeLabel: "Pending Review",
  submittedPrefix: "Submitted",
  defaultSubmittedTime: "Submitted today",

  // Notice Box
  pastoralReviewNotice:
    "The discipleship pastoral team is reviewing your intake responses to match you with the right discipler and small group. You will receive an in-app notice once assigned.",

  // Timeline
  reviewTimelineTitle: "REVIEW TIMELINE",
  timelineStep1Title: "Application Submitted",
  timelineStep1Desc: "Intake questionnaire received.",
  timelineStep2Title: "Leadership Review",
  timelineStep2Desc: "Pastoral evaluation and discipler matching.",
  timelineStep2BadgeLabel: "In Progress",
  timelineStep3Title: "Group Assignment",
  timelineStep3Desc: "Notification of your assigned group and gathering schedule.",

  // Footer & Actions
  applicationIdPrefix: "Application ID: #",
  withdrawButtonLabel: "Withdraw Application",

  // Withdraw Confirmation Modal
  withdrawModalTitle: "Withdraw Application?",
  withdrawModalDescriptionPrefix:
    "Are you sure you want to cancel your discipleship request for ",
  withdrawModalDescriptionSuffix:
    "? Your submitted intake questionnaire will be removed from the pastoral review queue.",
  withdrawModalConfirmLabel: "Yes, Withdraw Application",
  withdrawModalCancelLabel: "Keep Application",
};

export { myDiscipleshipGroupsPendingViewConst as myDiscipleshipGroupsStatusConst };
export default myDiscipleshipGroupsPendingViewConst;
