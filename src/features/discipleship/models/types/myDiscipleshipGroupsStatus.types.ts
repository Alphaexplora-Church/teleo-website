import type { DiscipleshipApplicationMock } from "../mocks/discipleshipDashboard.mocks";

export interface MyDiscipleshipGroupsStatusConfig {
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

export interface MyDiscipleshipGroupsStatusProps {
  applicationId?: string;
  application?: DiscipleshipApplicationMock;
  config?: MyDiscipleshipGroupsStatusConfig;
  onBack?: () => void;
  onWithdrawApplication?: (applicationId: string) => void;
  className?: string;
}
