import { Badge } from "../../../shared/components/Badge/Badge";
import {
  myDiscipleshipEmptyStateListConst,
  MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS,
} from "../models/constants/myDiscipleshipEmptyStateView.constant";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";

export interface ChurchCardItemProps {
  church: DiscipleshipChurch;
  homeChurchBadgeLabel?: string;
  activeGroupsLabel?: string;
  isPending?: boolean;
  pendingBadgeLabel?: string;
  onClick?: (church: DiscipleshipChurch) => void;
  className?: string;
}

export function ChurchCardItem({
  church,
  homeChurchBadgeLabel = myDiscipleshipEmptyStateListConst.homeChurchBadgeLabel,
  activeGroupsLabel = myDiscipleshipEmptyStateListConst.activeGroupsLabel,
  isPending = false,
  pendingBadgeLabel = "Pending Application",
  onClick,
  className = "",
}: ChurchCardItemProps) {

  return (
    <button
      type="button"
      disabled={isPending}
      aria-disabled={isPending}
      onClick={() => !isPending && onClick?.(church)}
      className={`
        w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm
        flex items-center justify-between gap-4 text-left transition-all duration-200 select-none
        ${
          isPending
            ? "opacity-60 cursor-not-allowed bg-slate-50/70"
            : "hover:border-slate-200 hover:shadow-md cursor-pointer"
        }
        ${className}
      `.trim()}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Placeholder image shape (gray div) */}
        <div className="w-14 h-14 rounded-2xl bg-[#E2E8F0] shrink-0" aria-hidden="true" />

        {/* Church details */}
        <div className="flex flex-col items-start min-w-0">
          <h4 className="text-[15px] font-semibold text-[#0E172A] truncate">
            {church.name}
          </h4>

          {/* Badges container */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {church.is_home_church && (
              <Badge label={homeChurchBadgeLabel} size="sm" />
            )}
            {isPending && (
              <Badge
                label={pendingBadgeLabel}
                variant="warning"
                size="sm"
                dotVisible={false}
              />
            )}
          </div>

          <span className="text-[13px] text-[#62718A] font-normal mt-1 truncate">
            {church.active_groups_count} {activeGroupsLabel}
            {church.city ? ` · ${church.city}` : ""}
          </span>
        </div>
      </div>

      {/* Right chevron navigation */}
      {(() => {
        const ChevronRightIcon = MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS.moreChevron;
        return (
          <ChevronRightIcon
            className={`w-5 h-5 shrink-0 ${
              isPending ? "text-slate-300" : "text-slate-500"
            }`}
          />
        );
      })()}
    </button>
  );
}

export default ChurchCardItem;
