import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface ChurchCardSkeletonProps {
  className?: string;
}

/**
 * Reusable single church card skeleton loader
 * Matches the layout and dimensions of ChurchCardItem.
 */
export function ChurchCardSkeleton({ className = "" }: ChurchCardSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`
        w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm
        flex items-center justify-between gap-4 select-none
        ${className}
      `.trim()}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Church Image Thumbnail Placeholder */}
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />

        {/* Church Details Placeholders */}
        <div className="flex flex-col items-start min-w-0 flex-1 space-y-1.5">
          {/* Church Name */}
          <Skeleton className="w-44 h-4 rounded" />

          {/* Badge Placeholder (e.g. Home Church or Active) */}
          <Skeleton className="w-20 h-4.5 rounded-md" />

          {/* Subtitle Placeholder (Active groups count · City) */}
          <Skeleton className="w-40 h-3 rounded" />
        </div>
      </div>

      {/* Right Navigation Chevron Placeholder */}
      <Skeleton className="w-4 h-4 rounded shrink-0" />
    </div>
  );
}

export interface ChurchListSkeletonProps {
  /** Number of church card skeletons to render (default: 1) */
  count?: number;
  /** Whether to render the search input bar skeleton above the list (default: false) */
  showSearch?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable church list skeleton loader for Discipleship Process / Church Exploration
 */
export function ChurchListSkeleton({
  count = 1,
  showSearch = false,
  className = "",
}: ChurchListSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full space-y-4 select-none ${className}`.trim()}
      role="status"
      aria-label="Loading churches..."
    >
      {/* ── Search Input Bar Skeleton Placeholder ── */}
      {showSearch && (
        <div className="w-full h-11 bg-slate-100 border border-slate-200/70 rounded-2xl px-4 flex items-center gap-2.5">
          <Skeleton className="w-4 h-4 rounded-full shrink-0" />
          <Skeleton className="w-36 h-3 rounded" />
        </div>
      )}

      {/* ── Church Cards List Placeholder ── */}
      <div className="space-y-3 w-full">
        {Array.from({ length: count }, (_, index) => (
          <ChurchCardSkeleton key={`church-card-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default ChurchListSkeleton;
