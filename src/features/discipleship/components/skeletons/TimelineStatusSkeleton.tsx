import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface TimelineStatusSkeletonProps {
  /** Number of timeline steps to render (default: 3) */
  count?: number;
  /** Whether to render the section title skeleton (default: true) */
  showTitle?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable skeleton loader for StatusReviewTimeLine
 * Matches the layout and dimensions of the review process timeline steps.
 */
export function TimelineStatusSkeleton({
  count = 3,
  showTitle = true,
  className = "",
}: TimelineStatusSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full select-none ${className}`.trim()}
      role="status"
      aria-label="Loading review timeline..."
    >
      {/* ── Section Title Placeholder ────────────────────────────── */}
      {showTitle && (
        <Skeleton className="w-32 h-3 rounded mb-4" />
      )}

      {/* ── Timeline Track List Placeholder ──────────────────────── */}
      <div className="flex flex-col">
        {Array.from({ length: count }, (_, index) => {
          const isLast = index === count - 1;
          const isMiddle = index === 1;

          return (
            <div
              key={`timeline-step-skeleton-${index}`}
              className="flex gap-3.5 items-start"
            >
              {/* Left Column: Icon Circle and Connecting Line */}
              <div className="flex flex-col items-center shrink-0 self-stretch">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                {!isLast && (
                  <div
                    className="w-[1.5px] flex-1 my-1 min-h-[30px] bg-slate-200/80"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right Column: Step Title, Badge, Description */}
              <div className={`flex-1 min-w-0 ${!isLast ? "pb-5" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap min-h-5">
                  <Skeleton className="w-36 h-4 rounded" />
                  {isMiddle && (
                    <Skeleton className="w-20 h-5 rounded-full shrink-0" />
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  <Skeleton className="w-56 h-3 rounded" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Aliases for backwards compatibility
export const TimelineStatuSkeleton = TimelineStatusSkeleton;
export type TimelineStatuSkeletonProps = TimelineStatusSkeletonProps;

export default TimelineStatusSkeleton;
