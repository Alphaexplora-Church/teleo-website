import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface QuestionSkeletonProps {
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable skeleton loader for ThisWeekQuestionCard
 * Matches the layout and dimensions of the weekly reflection question card.
 */
export function QuestionSkeleton({ className = "" }: QuestionSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs select-none ${className}`.trim()}
      role="status"
      aria-label="Loading reflection question..."
    >
      {/* ── Card Header Placeholder (Icon + Title) ─────────────── */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded shrink-0" />
        <Skeleton className="w-36 h-3 rounded" />
      </div>

      {/* ── Quote Block Placeholder ─────────────────────────────── */}
      <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-4 flex gap-3">
        {/* Vertical Accent Bar */}
        <div className="w-1 bg-slate-200 rounded-full shrink-0 self-stretch my-0.5" />

        {/* Reflection Question Multi-line Text */}
        <div className="space-y-2 flex-1 py-0.5">
          <Skeleton className="w-full h-3.5 rounded" />
          <Skeleton className="w-3/4 h-3.5 rounded" />
        </div>
      </div>
    </div>
  );
}

export default QuestionSkeleton;
