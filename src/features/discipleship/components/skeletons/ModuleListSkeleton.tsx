import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface ModuleListItemSkeletonProps {
  className?: string;
}

/**
 * Reusable single module item skeleton for the Journey Module List Modal
 */
export function ModuleListItemSkeleton({ className = "" }: ModuleListItemSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`
        w-full rounded-2xl p-3.5 border border-slate-200/90 bg-white
        flex items-center justify-between gap-3 select-none
        ${className}
      `.trim()}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Left Side: Gray image box placeholder */}
        <Skeleton className="w-14 h-14 rounded-xl shrink-0" />

        {/* Middle Info Placeholders */}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="w-16 h-2.5 rounded" />
          <Skeleton className="w-44 h-3.5 rounded" />
          <Skeleton className="w-20 h-2.5 rounded" />
        </div>
      </div>

      {/* Right Side: Radio Indicator Circle */}
      <Skeleton className="w-5 h-5 rounded-full shrink-0" />
    </div>
  );
}

export interface ModuleListSkeletonProps {
  /** Number of module item skeletons to render (default: 1) */
  count?: number;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable module list skeleton loader for curriculum selection
 */
export function ModuleListSkeleton({
  count = 1,
  className = "",
}: ModuleListSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`space-y-2.5 w-full select-none ${className}`.trim()}
      role="status"
      aria-label="Loading available curricula..."
    >
      {Array.from({ length: count }, (_, index) => (
        <ModuleListItemSkeleton key={`module-item-skeleton-${index}`} />
      ))}
    </div>
  );
}

export default ModuleListSkeleton;
