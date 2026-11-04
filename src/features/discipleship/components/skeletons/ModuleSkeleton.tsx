import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface ModuleSkeletonProps {
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable skeleton loader for the Current Study / Module card
 * Matches the layout and dimensions of CurrentStudyCard.
 */
export function ModuleSkeleton({ className = "" }: ModuleSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3.5 shadow-xs select-none ${className}`.trim()}
      aria-hidden="true"
      role="status"
      aria-label="Loading study module..."
    >
      {/* ── Header Row: Icon + Section Title + Module Badge ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="w-24 h-3 rounded" />
        </div>
        <Skeleton className="w-16 h-5 rounded-md" />
      </div>

      {/* ── Study Title Placeholder ── */}
      <div className="space-y-1.5 py-0.5">
        <Skeleton className="w-3/4 h-5 rounded-md" />
      </div>

      {/* ── Action Button Box Placeholder ── */}
      <div className="w-full bg-slate-50 border border-slate-200/70 rounded-xl py-3 px-3.5 flex items-center justify-between mt-1">
        <Skeleton className="w-40 h-3.5 rounded" />
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    </div>
  );
}

export default ModuleSkeleton;
