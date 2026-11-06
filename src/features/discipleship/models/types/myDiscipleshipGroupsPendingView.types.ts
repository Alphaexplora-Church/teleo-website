import type { LucideIcon } from "lucide-react";
import type { DiscipleshipApplication } from "./discipleshipDashboard.types";

export type MyDiscipleshipGroupsPendingViewIcons = Record<string, LucideIcon>;

export interface MyDiscipleshipGroupsPendingViewConfig {
  buttonBackLabel: string;
  titleHeader: string;
  pendingBadgeLabel: string;
  submittedPrefix: string;
  defaultSubmittedTime: string;
  pastoralReviewNotice: string;
  reviewTimelineTitle: string;
  timelineStep1Title: string;
  timelineStep1Desc: string;
  timelineStep2Title: string;
  timelineStep2Desc: string;
  timelineStep2BadgeLabel: string;
  timelineStep3Title: string;
  timelineStep3Desc: string;
  applicationIdPrefix: string;
  withdrawButtonLabel: string;
  withdrawModalTitle: string;
  withdrawModalDescriptionPrefix: string;
  withdrawModalDescriptionSuffix: string;
  withdrawModalConfirmLabel: string;
  withdrawModalCancelLabel: string;
}

export interface MyDiscipleshipGroupsPendingViewProps {
  applicationId?: string;
  application?: DiscipleshipApplication;
  config?: MyDiscipleshipGroupsPendingViewConfig;
  onBack?: () => void;
  onWithdrawApplication?: (applicationId: string) => void;
  className?: string;
}

// Backward-compatible type aliases
export type MyDiscipleshipGroupsStatusConfig = MyDiscipleshipGroupsPendingViewConfig;
export type MyDiscipleshipGroupsStatusProps = MyDiscipleshipGroupsPendingViewProps;

