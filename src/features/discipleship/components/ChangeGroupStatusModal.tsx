import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import { Badge } from "../../../shared/components/Badge/Badge";
import { useSwipeDownDismiss } from "../viewmodels/useSwipeDownDismiss";

export interface ChangeGroupStatusOption {
  /** Unique status key, e.g. "active" | "paused" */
  id: string;
  /** Primary status display title */
  title: string;
  /** Optional badge label rendered in green */
  badge?: string;
  /** Detailed description explaining the status outcome */
  description: string;
}

export interface ChangeGroupStatusModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close / dismiss modal */
  onClose: () => void;
  /** Callback fired when user confirms status update with selected status ID */
  onUpdateStatus?: (statusId: string) => void;
  /** Currently active status ID */
  currentStatusId?: string;
  /** Modal header title, defaults to "Change Group Status" */
  title?: string;
  /** Array of status options to select from */
  options?: ChangeGroupStatusOption[];
  /** Primary submit button label, defaults to "Update Status" */
  updateButtonLabel?: string;
  /** Secondary cancel button label, defaults to "Cancel" */
  cancelButtonLabel?: string;
  /** Custom wrapper styling */
  className?: string;
}

const DEFAULT_GROUP_STATUS_OPTIONS: ChangeGroupStatusOption[] = [
  {
    id: "active",
    title: "Active",
    description:
      "Members receive scheduled scripture reading, reflections, and notifications. Discipleship tracking is fully enabled.",
  },
  {
    id: "paused",
    title: "Pause Group",
    description:
      "Temporarily pauses gathering schedule and silences reminders. Group history and journals remain preserved.",
  },
];

export function ChangeGroupStatusModal({
  isOpen,
  onClose,
  onUpdateStatus,
  currentStatusId = "active",
  title = "Change Group Status",
  options = DEFAULT_GROUP_STATUS_OPTIONS,
  updateButtonLabel = "Update Status",
  cancelButtonLabel = "Cancel",
  className = "",
}: ChangeGroupStatusModalProps) {
  const [selectedStatusId, setSelectedStatusId] = useState<string>(currentStatusId);

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
  } = useSwipeDownDismiss({
    isOpen,
    onClose,
  });

  // Sync selected status with currentStatusId prop on open
  useEffect(() => {
    if (isOpen) {
      setSelectedStatusId(currentStatusId);
    }
  }, [isOpen, currentStatusId]);

  const handleUpdate = () => {
    onUpdateStatus?.(selectedStatusId);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* ── Background Blur Backdrop (Tap to Close) ──────────── */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* ── Bottom Sheet Container ────────────────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={sheetStyle}
        className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl
          flex flex-col space-y-5 select-none animate-in slide-in-from-bottom duration-300 max-h-[92dvh] overflow-y-auto
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-group-status-title"
      >
        {/* Pull / Drag Handle Bar */}
        <div
          className="w-10 h-1 rounded-full bg-slate-300 shrink-0 cursor-grab mx-auto hover:bg-slate-400 transition-colors"
          aria-hidden="true"
        />

        {/* ── Header Title (No X icon, no group name) ─────────── */}
        <div className="pt-1">
          <h2
            id="change-group-status-title"
            className="text-[20px] font-bold text-[#0E172A] tracking-tight leading-tight"
          >
            {title}
          </h2>
        </div>

        {/* ── Status Options List ─────────────────────────────── */}
        <div className="space-y-3" role="radiogroup" aria-labelledby="change-group-status-title">
          {options.map((option) => {
            const isSelected = selectedStatusId === option.id;
            const isCurrent =
              option.id.toLowerCase() === (currentStatusId || "active").toLowerCase();
            const badgeLabel = isCurrent
              ? (option.badge || "CURRENT")
              : (option.badge && option.badge.toUpperCase() !== "CURRENT" ? option.badge : undefined);

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedStatusId(option.id)}
                className={`
                  w-full text-left rounded-2xl p-4.5 transition-all cursor-pointer select-none
                  flex flex-col space-y-2
                  ${
                    isSelected
                      ? "bg-white border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-500/10"
                      : "bg-[#F8FAFC] hover:bg-slate-100/80 border border-slate-200/80"
                  }
                `.trim()}
              >
                {/* Header Row: Title + Green Badge on left, Green Check Indicator on right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[16px] text-[#0E172A] leading-tight">
                      {option.title}
                    </span>
                    {badgeLabel && (
                      <Badge
                        label={badgeLabel}
                        variant="success"
                        dotVisible={false}
                        size="sm"
                        className="font-semibold text-[11px] px-2.5 py-0.5 tracking-wide uppercase shrink-0"
                      />
                    )}
                  </div>

                  {/* Green Check Indicator */}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E2E8F0]/80 shrink-0" />
                  )}
                </div>

                {/* Option Description */}
                <p className="text-[13px] text-slate-500 leading-relaxed text-left">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Action Buttons ──────────────────────────────────── */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleUpdate}
            className="text-white rounded-2xl font-semibold text-[15px] shadow-sm active:scale-[0.99]"
          >
            {updateButtonLabel}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClose}
            className="text-[#62718A] hover:text-[#0E172A] font-medium text-[14px]"
          >
            {cancelButtonLabel}
          </Button>
        </div>

        {/* Mobile bottom indicator pill */}
        <div className="w-28 h-1 bg-slate-300/60 rounded-full mx-auto select-none mt-1" />
      </div>
    </div>,
    document.body
  );
}

export default ChangeGroupStatusModal;
