import { useMemo, useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { Badge } from "../../../../../shared/components/Badge/Badge";
import {
  StatusReviewTimeLine,
  type ReviewTimelineStep,
} from "../../../components/StatusReviewTimeLine";
import { ActionConfirmationModal } from "../../../components/ActionConfirmationModal";
import { myDiscipleshipGroupsStatusConst } from "../../../models/constants/myDiscipleshipGroupsStatus.constant";
import type { MyDiscipleshipGroupsStatusProps } from "../../../models/types/myDiscipleshipGroupsStatus.types";

export function MyDiscipleshipGroupsStatus({
  applicationId,
  application,
  config = myDiscipleshipGroupsStatusConst,
  onBack,
  onWithdrawApplication,
  className = "",
}: MyDiscipleshipGroupsStatusProps) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
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
          className="inline-flex items-center gap-1 text-[17px] font-semibold text-[#0E172A] hover:text-[#042C58] transition-colors cursor-pointer border-none bg-transparent p-0"
          aria-label={config.buttonBackLabel}
        >
          <ChevronLeft className="w-5 h-5 -ml-1 text-[#0E172A]" />
          <span>{config.buttonBackLabel}</span>
        </button>
      </div>

      {/* ── Header: Application Status (No church subtitle below) ─ */}
      <div>
        <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
          {config.titleHeader}
        </h1>
      </div>

      {/* ── Main Application Card ───────────────────────────────── */}
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        {/* Card Header: Church Name, Time, and Orange Pending Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-bold text-[#0E172A] leading-tight truncate">
              {churchName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#62718A] mt-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
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
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-[13px] text-[#475569] leading-relaxed">
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
        <span className="text-xs font-medium text-[#62718A]">
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

export default MyDiscipleshipGroupsStatus;