import { useMemo, useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import {
  StatusReviewTimeLine,
  type ReviewTimelineStep,
} from "../components/process/StatusReviewTimeLine";
import { ActionConfirmationModal } from "../components/modals/ActionConfirmationModal";
import type { DiscipleshipApplication } from "../models/types/discipleship.types";

export interface MyDiscipleshipGroupsPendingViewProps {
  applicationId?: string;
  application?: DiscipleshipApplication;
  onBack?: () => void;
  onWithdrawApplication?: (applicationId: string) => void;
  className?: string;
}

const DEFAULT_TIMELINE_STEPS: ReviewTimelineStep[] = [
  {
    id: "step-1",
    title: "Application Submitted",
    description: "Your responses have been received",
    status: "completed",
  },
  {
    id: "step-2",
    title: "Under Review",
    description: "Leadership is reviewing your answers",
    status: "in_progress",
    badgeLabel: "In Review",
    badgeVariant: "success",
  },
  {
    id: "step-3",
    title: "Group Placement",
    description: "You will be assigned to a discipleship group",
    status: "upcoming",
  },
];

export function MyDiscipleshipGroupsPendingView({
  applicationId,
  application,
  onBack,
  onWithdrawApplication,
  className = "",
}: MyDiscipleshipGroupsPendingViewProps) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const displayAppId = application?.id ?? applicationId ?? "";
  const churchName = application?.church_name ?? "Church";

  const submittedTimeText = useMemo(() => {
    if (!application?.created_at) return "Submitted today";
    return "Submitted today";
  }, [application?.created_at]);

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button (Icon Only) ──────────────── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-slate-900 hover:text-navy-hover hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
      </div>

      {/* ── Header: Application Status ───────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Application Status
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
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{submittedTimeText}</span>
            </div>
          </div>

          <div className="shrink-0">
            <Badge
              label="Pending"
              variant="warning"
              size="sm"
              dotVisible={false}
            />
          </div>
        </div>

        {/* Notice Box (Pastoral Review Notice) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[13px] text-slate-600 leading-relaxed">
          Your application has been received and is currently being reviewed by church leadership. You will be notified once placed into a discipleship group.
        </div>

        {/* Review Timeline */}
        <div className="pt-2">
          <StatusReviewTimeLine
            title="Application Progress"
            steps={DEFAULT_TIMELINE_STEPS}
          />
        </div>
      </div>

      {/* ── Footer Section: Application ID & Withdraw Button ───── */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-2 text-center">
        {displayAppId && (
          <span className="text-xs font-medium text-slate-500">
            Application ID: {displayAppId}
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="text-[13.5px] font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-4 cursor-pointer transition-colors"
        >
          Withdraw Application
        </button>
      </div>

      {/* ── Withdraw Confirmation Modal ──────────────────────── */}
      <ActionConfirmationModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Application"
        description={`Are you sure you want to withdraw your discipleship application to ${churchName}? This action cannot be undone.`}
        confirmLabel="Withdraw"
        cancelLabel="Keep Application"
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

