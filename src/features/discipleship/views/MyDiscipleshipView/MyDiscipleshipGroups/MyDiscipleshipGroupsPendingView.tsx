import { useMemo, useState } from "react";
import { Badge } from "../../../../../shared/components/Badge/Badge";
import {
  StatusReviewTimeLine,
  type ReviewTimelineStep,
} from "../../../components/StatusReviewTimeLine";
import { ActionConfirmationModal } from "../../../components/ActionConfirmationModal";
import {
  myDiscipleshipGroupsPendingViewConst,
  MY_DISCIPLESHIP_GROUPS_PENDING_VIEW_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsPendingView.constant";
import type { MyDiscipleshipGroupsPendingViewProps } from "../../../models/types/myDiscipleshipGroupsPendingView.types";

export function MyDiscipleshipGroupsPendingView({
  applicationId,
  application,
  config = myDiscipleshipGroupsPendingViewConst,
  onBack,
  onWithdrawApplication,
  className = "",
}: MyDiscipleshipGroupsPendingViewProps) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { back: BackIcon, clock: ClockIcon } = MY_DISCIPLESHIP_GROUPS_PENDING_VIEW_ICONS;
  const displayAppId =
    application?.id ?? applicationId ?? "APP-84920";

  const churchName =
    application?.church_name ?? "Grace Community Church";

  const submittedTimeText = useMemo(() => {
    if (!application?.created_at) return config.defaultSubmittedTime;
    return `${config.submittedPrefix} today`;
  }, [application?.created_at, config.defaultSubmittedTime, config.submittedPrefix]);

  const timelineSteps: ReviewTimelineStep[] = useMemo(
    () => [
      {
        id: "step-1",
        title: config.timelineStep1Title,
        description: config.timelineStep1Desc,
        status: "completed",
      },
      {
        id: "step-2",
        title: config.timelineStep2Title,
        description: config.timelineStep2Desc,
        status: "in_progress",
        badgeLabel: config.timelineStep2BadgeLabel,
        badgeVariant: "success",
      },
      {
        id: "step-3",
        title: config.timelineStep3Title,
        description: config.timelineStep3Desc,
        status: "upcoming",
      },
    ],
    [
      config.timelineStep1Desc,
      config.timelineStep1Title,
      config.timelineStep2BadgeLabel,
      config.timelineStep2Desc,
      config.timelineStep2Title,
      config.timelineStep3Desc,
      config.timelineStep3Title,
    ]
  );

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button Only (No profile avatar) ── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[17px] font-semibold text-slate-900 hover:text-navy-hover transition-colors cursor-pointer border-none bg-transparent p-0"
          aria-label={config.buttonBackLabel}
        >
          <BackIcon className="w-5 h-5 -ml-1 text-slate-900" />
          <span>{config.buttonBackLabel}</span>
        </button>
      </div>

      {/* ── Header: Application Status (No church subtitle below) ─ */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {config.titleHeader}
        </h1>
      </div>

      {/* ── Main Application Card ───────────────────────────────── */}
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Card Header: Church Name, Time, and Orange Pending Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
              {churchName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <ClockIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{submittedTimeText}</span>
            </div>
          </div>

          {/* Orange Pending Review Badge (no dot) */}
          <div className="shrink-0">
            <Badge
              label={config.pendingBadgeLabel}
              variant="warning"
              size="sm"
              dotVisible={false}
            />
          </div>
        </div>

        {/* Notice Box (Pastoral Review Notice) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[13px] text-slate-600 leading-relaxed">
          {config.pastoralReviewNotice}
        </div>

        {/* Review Timeline */}
        <div className="pt-2">
          <StatusReviewTimeLine
            title={config.reviewTimelineTitle}
            steps={timelineSteps}
          />
        </div>
      </div>

      {/* ── Footer Section: Application ID & Withdraw Button ───── */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-2 text-center">
        <span className="text-xs font-medium text-slate-500">
          {config.applicationIdPrefix}
          {displayAppId}
        </span>

        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="text-[13.5px] font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-4 cursor-pointer transition-colors"
        >
          {config.withdrawButtonLabel}
        </button>
      </div>

      {/* ── Withdraw Confirmation Modal ──────────────────────── */}
      <ActionConfirmationModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title={config.withdrawModalTitle}
        description={`${config.withdrawModalDescriptionPrefix}${churchName}${config.withdrawModalDescriptionSuffix}`}
        confirmLabel={config.withdrawModalConfirmLabel}
        cancelLabel={config.withdrawModalCancelLabel}
        confirmVariant="danger"
        onConfirm={() => {
          setIsWithdrawModalOpen(false);
          onWithdrawApplication?.(displayAppId);
        }}
      />
    </div>
  );
}

export default MyDiscipleshipGroupsPendingView;