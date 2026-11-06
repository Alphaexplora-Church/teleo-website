// src/features/discipleship/components/skeletons/DiscipleshipSkeletons.tsx
// Consolidated skeleton loaders for the Discipleship feature.

import type React from "react";
import { Skeleton } from "../../../../shared/components/Skeleton/Skeleton";

export interface GroupsDashboardCardSkeletonProps {
  showInfo?: boolean;
  className?: string;
}

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
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="w-36 h-4 rounded" />
            <Skeleton className="w-48 h-3 rounded" />
          </div>
        </div>
        <Skeleton className="w-14 h-5 rounded-full shrink-0" />
      </div>

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

export function GroupsDashboardSkeleton({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <div
      className={`w-full max-w-md mx-auto space-y-6 select-none ${className}`.trim()}
      aria-busy="true"
      aria-label="Loading discipleship dashboard"
    >
      <div className="space-y-3.5">
        <Skeleton className="w-36 h-3.5 rounded" />
        <div className="space-y-3">
          <GroupsDashboardCardSkeleton showInfo />
          <GroupsDashboardCardSkeleton showInfo={false} />
        </div>
      </div>
    </div>
  );
}

export interface ChurchCardSkeletonProps {
  showChevron?: boolean;
  className?: string;
}

export function ChurchCardSkeleton({
  showChevron = false,
  className = "",
}: ChurchCardSkeletonProps): React.JSX.Element {
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
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
        <div className="flex flex-col items-start min-w-0 flex-1 space-y-1.5">
          <Skeleton className="w-44 h-4 rounded" />
          <Skeleton className="w-20 h-4.5 rounded-md" />
          <Skeleton className="w-40 h-3 rounded" />
        </div>
      </div>
      {showChevron && <Skeleton className="w-4 h-4 rounded shrink-0" />}
    </div>
  );
}

export function ChurchListSkeleton({
  count = 3,
  showChevron = false,
  className = "",
}: { count?: number; showChevron?: boolean; className?: string }): React.JSX.Element {
  return (
    <div className={`w-full space-y-3 select-none ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <ChurchCardSkeleton key={index} showChevron={showChevron} />
      ))}
    </div>
  );
}

