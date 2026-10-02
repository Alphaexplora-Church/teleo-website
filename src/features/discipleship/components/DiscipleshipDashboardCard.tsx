import type React from "react";
import { Badge } from "../../../shared/components/Badge/Badge";
import type { BadgeVariant } from "../../../shared/components/Badge/badge.style";
import { Button } from "../../../shared/components/Button/Button";
import type { ButtonVariant } from "../../../shared/components/Button/button.style";

export interface DiscipleshipDashboardCardProps {
  // Avatar / Profile / Image Slot
  imageUrl?: string | null;
  imageAlt?: string;
  avatar?: React.ReactNode;

  // Title & Subtitle
  title: string;
  subtitle?: string;

  // Badge Slot & Config (Shared Badge Component)
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  badgeDotVisible?: boolean;
  badge?: React.ReactNode;

  // Info Section Slots
  info?: React.ReactNode;
  infoIcon?: React.ReactNode;
  infoTitle?: string;
  infoSubtitle?: string;

  // Bottom Action Slots (Shared Button Component)
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionButtonVariant?: ButtonVariant;
  onAction?: () => void;
  action?: React.ReactNode;

  className?: string;
}

export function DiscipleshipDashboardCard({
  imageUrl,
  imageAlt,
  avatar,
  title,
  subtitle,
  badge,
  badgeLabel,
  badgeVariant = "default",
  badgeDotVisible = false,
  info,
  infoIcon,
  infoTitle,
  infoSubtitle,
  action,
  actionLabel,
  actionIcon,
  actionButtonVariant = "ghost",
  onAction,
  className = "",
}: DiscipleshipDashboardCardProps) {
  const hasInfo = Boolean(info || infoTitle || infoSubtitle || infoIcon);
  const hasAction = Boolean(action || actionLabel);

  return (
    <div
      className={`
        w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left
        transition-all duration-200 select-none
        ${className}
      `.trim()}
    >
      {/* ── Header Row (Image/Avatar + Title/Subtitle + Badge) ─── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {imageUrl ? (
            <div className="w-11 h-11 rounded-xl bg-[#E2E8F0] shrink-0 overflow-hidden">
              <img
                src={imageUrl}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : avatar ? (
            <div className="w-11 h-11 rounded-xl bg-[#F1F3F6] flex items-center justify-center shrink-0 overflow-hidden text-[#0E172A]">
              {avatar}
            </div>
          ) : (
            <div
              className="w-11 h-11 rounded-xl bg-[#E2E8F0] shrink-0"
              aria-hidden="true"
            />
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-[15px] font-semibold text-[#0E172A] truncate leading-tight">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[12px] text-[#62718A] truncate mt-0.5 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Shared Badge Component */}
        {badge ??
          (badgeLabel ? (
            <div className="shrink-0">
              <Badge
                label={badgeLabel}
                variant={badgeVariant}
                size="sm"
                dotVisible={badgeDotVisible}
              />
            </div>
          ) : null)}
      </div>

      {/* ── Info Section Slot ───────────────────────────── */}
      {hasInfo && (
        <div className="mt-3.5">
          {info ?? (
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-start gap-2.5">
              {infoIcon && (
                <div className="shrink-0 mt-0.5 text-[#62718A] text-sm">
                  {infoIcon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {infoTitle && (
                  <p className="text-[13px] font-semibold text-[#0E172A] leading-snug truncate">
                    {infoTitle}
                  </p>
                )}
                {infoSubtitle && (
                  <p className="text-[12px] text-[#62718A] leading-normal truncate mt-0.5">
                    {infoSubtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom Action Slot (Shared Button Component) ── */}
      {hasAction && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          {action ?? (
            <Button
              type="button"
              variant={actionButtonVariant}
              onClick={onAction}
              fullWidth
              className="w-full !justify-between text-[13px] font-medium text-[#62718A] hover:text-[#0E172A] px-1 py-1 h-auto transition-colors cursor-pointer select-none"
            >
              <span>{actionLabel}</span>
              {actionIcon && (
                <span className="shrink-0 text-[#94A3B8]">{actionIcon}</span>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default DiscipleshipDashboardCard;
