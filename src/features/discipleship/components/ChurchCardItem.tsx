import { ChevronRight } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import { myDiscipleshipEmptyStateListConst } from "../models/constants/myDiscipleshipEmptyState.constant";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyState.types";

export interface ChurchCardItemProps {
  church: DiscipleshipChurch;
  homeChurchBadgeLabel?: string;
  activeGroupsLabel?: string;
  onClick?: (church: DiscipleshipChurch) => void;
  className?: string;
}

export function ChurchCardItem({
  church,
  homeChurchBadgeLabel = myDiscipleshipEmptyStateListConst.homeChurchBadgeLabel,
  activeGroupsLabel = myDiscipleshipEmptyStateListConst.activeGroupsLabel,
  onClick,
  className = "",
}: ChurchCardItemProps) {

  return (
    <button
      type="button"
      onClick={() => onClick?.(church)}
      className={`
        w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm
        flex items-center justify-between gap-4 text-left transition-all duration-200
        hover:border-slate-200 hover:shadow-md cursor-pointer select-none
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

          {/* Home Church Badge */}
          {church.is_home_church && (
            <div className="mt-1">
              <Badge label={homeChurchBadgeLabel} size="sm" />
            </div>
          )}

          <span className="text-[13px] text-[#62718A] font-normal mt-1 truncate">
            {church.active_groups_count} {activeGroupsLabel}
            {church.city ? ` · ${church.city}` : ""}
          </span>
        </div>
      </div>


      {/* Right chevron navigation */}
      <ChevronRight className="w-5 h-5 text-[#62718A] shrink-0" />
    </button>
  );
}

export default ChurchCardItem;
