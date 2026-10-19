import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface GroupsDashboardCardSkeletonProps {
  /** Whether to show the bottom nested info slot (gathering schedule) */
  showInfo?: boolean;
  className?: string;
}

/**
 * Reusable single card skeleton matching DiscipleshipDashboardCard
 */
export function GroupsDashboardCardSkeleton({
  showInfo = true,
  className = "",
}: GroupsDashboardCardSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`
        w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left
        select-none flex flex-col space-y-3.5
        ${className}
      `.trim()}
      aria-hidden="true"
    >
      {/* ── Top Header Row (Image + Title/Subtitle + Badge) ── */}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Group Thumbnail */}
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />

          {/* Group Title & Subtitle */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="w-36 h-4 rounded" />
            <Skeleton className="w-48 h-3 rounded" />
          </div>
        </div>

        {/* Status Badge Pill Placeholder */}
        <Skeleton className="w-14 h-5 rounded-full shrink-0" />
      </div>

      {/* ── Bottom Info Box Placeholder (Next Gathering / Study) ── */}
      {showInfo && (
        <div className="w-full">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <Skeleton className="w-4 h-4 rounded-full shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="w-36 h-3.5 rounded" />
              <Skeleton className="w-48 h-2.5 rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface GroupsDashboardSkeletonProps {
  /** Number of active group card skeletons to render (default: 1) */
  activeCardCount?: number;
  /** Whether to show pending application card skeleton (default: false) */
  showPendingSection?: boolean;
  /** Whether to show the top dashboard header (default: false) */
  showHeader?: boolean;
  /** Whether to show the section title skeleton (default: false) */
  showSectionTitle?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable dashboard skeleton loader for My Discipleships view
 */
export function GroupsDashboardSkeleton({
  activeCardCount = 1,
  showPendingSection = false,
  showHeader = false,
  showSectionTitle = false,
  className = "",
}: GroupsDashboardSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full space-y-6 select-none ${className}`.trim()}
      role="status"
      aria-label="Loading discipleship dashboard..."
    >
      {/* ── Dashboard Header Placeholder ── */}
      {showHeader && (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="w-36 h-5 rounded" />
            <Skeleton className="w-28 h-3 rounded" />
          </div>
          <Skeleton className="w-20 h-7 rounded-full border border-slate-200/60" />
        </div>
      )}

      {/* ── Active Groups Section Placeholder ── */}
      <section className="space-y-3">
        {showSectionTitle && <Skeleton className="w-28 h-3 rounded px-0.5" />}
        <div className="space-y-3">
          {Array.from({ length: activeCardCount }, (_, index) => (
            <GroupsDashboardCardSkeleton key={`active-group-skeleton-${index}`} />
          ))}
        </div>
      </section>

      {/* ── Pending Applications Section Placeholder ── */}
      {showPendingSection && (
        <section className="space-y-3 pt-1">
          {showSectionTitle && <Skeleton className="w-36 h-3 rounded px-0.5" />}
          <GroupsDashboardCardSkeleton showInfo={false} />
        </section>
      )}
    </div>
  );
}

export default GroupsDashboardSkeleton;
