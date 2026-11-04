import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface MemberItemSkeletonProps {
  className?: string;
}

/**
 * Reusable single member row skeleton loader
 * Matches the layout and dimensions of GroupRosterList member item.
 */
export function MemberItemSkeleton({ className = "" }: MemberItemSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`p-4 flex items-center justify-between gap-3 select-none ${className}`.trim()}
      aria-hidden="true"
    >
      {/* Member Avatar & Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Avatar Circle */}
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />

        {/* Member Name & Subtitle */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="w-28 h-4 rounded" />
          <Skeleton className="w-36 h-3 rounded" />
        </div>
      </div>

      {/* Right Side: Status Badge Pill & Options Menu Placeholder */}
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="w-14 h-5 rounded-full" />
        <div className="w-4 h-5 flex flex-col justify-center items-center gap-0.5">
          <Skeleton className="w-1 h-1 rounded-full" />
          <Skeleton className="w-1 h-1 rounded-full" />
          <Skeleton className="w-1 h-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export interface MemberListSkeletonProps {
  /** Number of member row skeletons to render (default: 3) */
  count?: number;
  /** Whether to render the section header skeleton (default: false) */
  showHeader?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Reusable member list skeleton loader for Group Roster / Member views
 */
export function MemberListSkeleton({
  count = 3,
  showHeader = false,
  className = "",
}: MemberListSkeletonProps): React.JSX.Element {
  return (
    <div
      className={`w-full space-y-2.5 select-none ${className}`.trim()}
      role="status"
      aria-label="Loading disciples roster..."
    >
      {/* ── Section Header Placeholder ── */}
      {showHeader && (
        <div className="flex items-center justify-between px-1">
          <Skeleton className="w-28 h-3 rounded" />
        </div>
      )}

      {/* ── Members Card Container ── */}
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden divide-y divide-slate-100">
        {Array.from({ length: count }, (_, index) => (
          <MemberItemSkeleton key={`member-item-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default MemberListSkeleton;
