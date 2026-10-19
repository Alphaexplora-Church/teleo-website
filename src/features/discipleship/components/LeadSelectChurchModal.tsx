import { createPortal } from "react-dom";
import { ChevronRight } from "lucide-react";
import { useSwipeDownDismiss } from "../viewmodels/useSwipeDownDismiss";

export interface LeadSelectChurchGroupItem {
  id: string;
  name: string;
  role?: string;
  members_count: number;
  max_members?: number;
}

export interface LeadSelectChurchModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Church name header */
  churchName?: string;
  /** Subtitle instruction */
  subtitle?: string;
  /** List of groups the leader manages in this church */
  groups?: LeadSelectChurchGroupItem[];
  /** Callback fired to close the modal */
  onClose: () => void;
  /** Callback fired when a group card is clicked */
  onSelectGroup: (groupId: string) => void;
  /** Optional custom CSS classes */
  className?: string;
}

export function LeadSelectChurchModal({
  isOpen,
  churchName = "Grace Community Church",
  subtitle = "Select a group to open or manage",
  groups = [],
  onClose,
  onSelectGroup,
  className = "",
}: LeadSelectChurchModalProps) {
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
  } = useSwipeDownDismiss({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* ── Background Blur Backdrop (Tap to Dismiss) ─────────── */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* ── Bottom Sheet Container ────────────────────────────── */}
      <div
        style={sheetStyle}
        className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl
          flex flex-col space-y-4 select-none animate-in slide-in-from-bottom duration-300 max-h-[85dvh] overflow-y-auto
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-select-church-title"
      >
        {/* Pull / Drag Handle Bar Area (Touch swipe down to dismiss only from here) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="pt-1 pb-1 shrink-0 bg-white cursor-grab active:cursor-grabbing touch-none select-none"
          aria-hidden="true"
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 shrink-0 mx-auto hover:bg-slate-400 transition-colors" />
        </div>

        {/* ── Header: Church Name & Subtitle (No X icon) ────────── */}
        <div className="space-y-1 pt-1">
          <h2
            id="lead-select-church-title"
            className="text-[20px] font-bold text-[#0E172A] tracking-tight leading-snug"
          >
            {churchName}
          </h2>
          <p className="text-[13.5px] text-[#62718A]">
            {subtitle}
          </p>
        </div>

        {/* ── Groups List ───────────────────────────────────────── */}
        <div className="space-y-3 pt-2" role="list">
          {groups.map((group) => {
            const roleLabel = group.role ?? "Discipler (Lead)";
            const maxCount = group.max_members ?? 10;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className="w-full text-left rounded-2xl p-4.5 bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs active:bg-slate-50 transition-all cursor-pointer select-none flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-bold text-[16px] text-[#0E172A] leading-snug truncate">
                    {group.name}
                  </h3>
                  <p className="text-[13px] text-[#62718A] truncate">
                    {roleLabel} · {group.members_count} / {maxCount} members
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* ── Footer: Cancel Button ─────────────────────────────── */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-center text-[#62718A] hover:text-[#0E172A] font-medium text-[15px] transition-colors cursor-pointer border-none bg-transparent"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LeadSelectChurchModal;