import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface ScheduleSkeletonProps {
  /** Whether to show the bottom virtual meeting link box (default: true) */
  showVirtualLink?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable skeleton loader for NextGatheringCard
 * Matches the layout and dimensions of the next gathering schedule card.
 */
export function ScheduleSkeleton({
  showVirtualLink = true,
  className = "",
}: ScheduleSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3.5 shadow-xs select-none ${className}`.trim()}
      role="status"
      aria-label="Loading gathering schedule..."
    >
      {/* ── Card Header Row (Icon + Title + Badge) ───────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="w-28 h-3 rounded" />
        </div>
        <Skeleton className="w-14 h-5 rounded-md shrink-0" />
      </div>

      {/* ── Gathering Details Placeholder ────────────────────────── */}
      <div className="space-y-2.5 pt-0.5">
        {/* Timing Row */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="w-44 h-4 rounded" />
            <Skeleton className="w-36 h-3 rounded" />
          </div>
        </div>

        {/* Location Row */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="w-40 h-3.5 rounded" />
        </div>
      </div>

      {/* ── Bottom Virtual Meeting Box ───────────────────────────── */}
      {showVirtualLink && (
        <div className="w-full bg-slate-50 rounded-xl border border-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Skeleton className="w-4 h-4 rounded shrink-0" />
            <Skeleton className="w-32 h-3 rounded" />
          </div>
          <Skeleton className="w-16 h-7 rounded-lg shrink-0" />
        </div>
      )}
    </div>
  );
}

export default ScheduleSkeleton;
