import { createPortal } from "react-dom";
import { User } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import type { GroupMemberItem } from "../models/mocks/discipleshipLead.mocks";
import { groupMemberActionSheetConst } from "../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import type {
  GroupMemberActionSheetConfig,
  MemberActionItem,
  GroupMemberActionSheetProps,
} from "../models/types/myDiscipleshipGroupsLeadCardView.types";
import { useSwipeDownDismiss } from "../viewmodels/useSwipeDownDismiss";

export type {
  GroupMemberActionSheetConfig,
  MemberActionItem,
  GroupMemberActionSheetProps,
};

const DEFAULT_MEMBER: GroupMemberItem = {
  id: "member-default",
  name: "Juan Dela Cruz",
  initials: "JD",
  joined_date: "Joined 2 months ago",
  note: "Enrolled 2 months ago",
  status: "Active",
};

export function GroupMemberActionSheet({
  isOpen,
  member,
  config: userConfig,
  onClose,
  onViewDetails,
  onRemoveMember,
  actions,
  enrolledText,
  className = "",
}: GroupMemberActionSheetProps) {
  const config = {
    ...groupMemberActionSheetConst,
    ...userConfig,
    icons: {
      ...groupMemberActionSheetConst.icons,
      ...userConfig?.icons,
    },
  };

  const ViewDetailsIcon = config.icons.viewDetails;
  const RemoveMemberIcon = config.icons.removeMember;
  const ChevronRightIcon = config.icons.chevronRight;

  const activeMember = member ?? DEFAULT_MEMBER;

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

  // Default action items with Lucide icons from config layer
  const defaultActions: MemberActionItem[] = [
    {
      id: "view-details",
      label: config.viewDetailsLabel,
      description: config.viewDetailsDescription,
      variant: "default",
      icon: ViewDetailsIcon ? (
        <ViewDetailsIcon className="w-5 h-5 text-slate-700 shrink-0" />
      ) : undefined,
      trailingIcon: ChevronRightIcon ? (
        <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0" />
      ) : undefined,
      onClick: () => {
        onViewDetails?.(activeMember);
        onClose();
      },
    },
    {
      id: "remove-member",
      label: config.removeMemberLabel,
      description: config.removeMemberDescription,
      variant: "danger",
      icon: RemoveMemberIcon ? (
        <RemoveMemberIcon className="w-5 h-5 text-[#DC2626] shrink-0" />
      ) : undefined,
      trailingIcon: ChevronRightIcon ? (
        <ChevronRightIcon className="w-4 h-4 text-red-400 shrink-0" />
      ) : undefined,
      onClick: () => {
        onRemoveMember?.(activeMember);
        onClose();
      },
    },
  ];

  const resolvedActions = actions ?? defaultActions;

  const subtitleText =
    enrolledText ??
    (activeMember.joined_date
      ? activeMember.joined_date.replace(/^Joined\s+/i, `${config.enrolledPrefix} `)
      : activeMember.note ?? `${config.enrolledPrefix} 2 months ago`);

  return createPortal(
    <div className="fixed inset-0 z-100 flex flex-col justify-end">
      {/* ── Background Blur Backdrop (Tap to Auto-Close) ──────── */}
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
        aria-label={activeMember.name}
      >
        {/* Pull / Drag Handle Bar */}
        <div
          className="w-10 h-1 rounded-full bg-slate-300 shrink-0 cursor-grab mx-auto hover:bg-slate-400 transition-colors"
          aria-hidden="true"
        />

        {/* ── Member Profile Header (No X button) ────────────────── */}
        <div className="flex items-center gap-3.5 pt-1">
          {/* Avatar Circle */}
          <div
            className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden"
            aria-hidden="true"
          >
            {activeMember.avatar_url ? (
              <img
                src={activeMember.avatar_url}
                alt={activeMember.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-slate-400" />
            )}
          </div>

          {/* Name on left, Green Status Badge on right (justify-between) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[17px] font-bold text-[#0E172A] leading-tight truncate">
                {activeMember.name}
              </h2>
              <Badge
                label={activeMember.status ?? "Active"}
                variant={activeMember.status === "Paused" ? "outline" : "success"}
                dotVisible={false}
                size="sm"
                className={`font-semibold text-[11px] px-2.5 py-0.5 tracking-wider shrink-0 ${
                  activeMember.status === "Paused" ? "border-slate-300 text-slate-600" : ""
                }`}
              />
            </div>
            <p className="text-[12.5px] text-[#62718A] mt-0.5 truncate">
              {subtitleText}
            </p>
          </div>
        </div>

        {/* ── Action Items Card Container ───────────────────────── */}
        <div className="rounded-2xl border border-slate-100 bg-[#FAFAFA] divide-y divide-slate-100 overflow-hidden shadow-xs">
          {resolvedActions.map((action) => {
            const isDanger = action.variant === "danger";

            return (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-100/70 active:bg-slate-200/50 transition-colors cursor-pointer border-none bg-transparent"
              >
                {/* Left Action Content */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {action.icon && (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isDanger
                          ? "bg-rose-50"
                          : "bg-slate-100"
                      }`}
                    >
                      {action.icon}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-bold leading-tight ${
                        isDanger ? "text-[#DC2626]" : "text-[#0E172A]"
                      }`}
                    >
                      {action.label}
                    </span>
                    {action.description && (
                      <p className="text-[12.5px] text-[#62718A] leading-relaxed mt-0.5 truncate">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Trailing Icon (ChevronRight) */}
                {action.trailingIcon && (
                  <div className="shrink-0">
                    {action.trailingIcon}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Cancel Button ─────────────────────────────────────── */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-[#F1F3F6] hover:bg-slate-200 active:scale-[0.99] font-semibold text-[15px] text-[#0E172A] transition-all cursor-pointer border-none flex items-center justify-center"
          >
            {config.cancelButtonLabel}
          </button>
        </div>

        {/* Mobile bottom indicator bar */}
        <div className="w-28 h-1 bg-slate-300/60 rounded-full mx-auto select-none mt-1" />
      </div>
    </div>,
    document.body
  );
}

export default GroupMemberActionSheet;
