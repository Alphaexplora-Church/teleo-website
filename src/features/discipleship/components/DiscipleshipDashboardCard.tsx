import type React from "react";
import { Badge } from "../../../shared/components/Badge/Badge";
import type { BadgeVariant } from "../../../shared/components/Badge/badge.style";
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

  // Action Slots & Callbacks (for backwards compatibility)
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionButtonVariant?: ButtonVariant;
  action?: React.ReactNode;
  onAction?: () => void;
  onClick?: () => void;

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
  onAction,
  onClick,
  className = "",
}: DiscipleshipDashboardCardProps) {
  const hasInfo = Boolean(info || infoTitle || infoSubtitle || infoIcon);
  const handleClick = onClick ?? onAction;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left
        transition-all duration-200 select-none cursor-pointer
        hover:border-slate-200 hover:shadow-md active:scale-[0.99]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
        flex flex-col
        ${className}
      `.trim()}
    >
      {/* ── Header Row (Image/Avatar + Title/Subtitle + Badge) ─── */}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {imageUrl ? (
            <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
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
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden text-slate-900">
              {avatar}
            </div>
          ) : (
            <div
              className="w-11 h-11 rounded-xl bg-slate-200 shrink-0"
              aria-hidden="true"
            />
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-[15px] font-semibold text-slate-900 truncate leading-tight">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[12px] text-slate-500 truncate mt-0.5 leading-normal">
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
        <div className="mt-3.5 w-full">
          {info ?? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              {infoIcon && (
                <div className="shrink-0 mt-0.5 text-slate-500 text-sm">
                  {infoIcon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {infoTitle && (
                  <p className="text-[13px] font-semibold text-slate-900 leading-snug truncate">
                    {infoTitle}
                  </p>
                )}
                {infoSubtitle && (
                  <p className="text-[12px] text-slate-500 leading-normal truncate mt-0.5">
                    {infoSubtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

export default DiscipleshipDashboardCard;
