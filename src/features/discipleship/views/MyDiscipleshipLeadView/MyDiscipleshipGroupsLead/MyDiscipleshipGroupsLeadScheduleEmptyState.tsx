import { Button } from "../../../../../shared/components/Button/Button";
import {
  myDiscipleshipGroupsLeadScheduleEmptyStateConst,
  MY_DISCIPLESHIP_GROUPS_LEAD_SCHEDULE_EMPTY_STATE_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsLeadScheduleEmptyState.constant";
import type { MyDiscipleshipGroupsLeadScheduleEmptyStateProps } from "../../../models/types/myDiscipleshipGroupsLeadScheduleEmptyState.types";

export function MyDiscipleshipGroupsLeadScheduleEmptyState({
  config = myDiscipleshipGroupsLeadScheduleEmptyStateConst,
  onSetSchedule,
  className = "",
}: MyDiscipleshipGroupsLeadScheduleEmptyStateProps) {
  const {
    calendar: CalendarIcon,
    plus: PlusIcon,
  } = MY_DISCIPLESHIP_GROUPS_LEAD_SCHEDULE_EMPTY_STATE_ICONS;

  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-xs select-none space-y-5 text-center ${className}`.trim()}
    >
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-left">
        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase select-none">
          {config.headerTitle}
        </span>
      </div>

      {/* ── Center Content: Icon, Title & Description ─────────────── */}
      <div className="space-y-3 pt-1">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500 shrink-0">
          <CalendarIcon className="w-6 h-6 text-slate-500" />
        </div>

        <div className="space-y-1.5 max-w-[290px] mx-auto">
          <h3 className="text-[17px] font-bold text-slate-900 leading-snug">
            {config.title}
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      {/* ── Action Button (Shared Button Component) ───────────────── */}
      <Button
        type="button"
        variant="primary"
        size="md"
        fullWidth
        onClick={onSetSchedule}
        className="text-white"
      >
        <PlusIcon className="w-4 h-4 shrink-0" />
        <span>{config.setScheduleButtonLabel}</span>
      </Button>
    </div>
  );
}

export default MyDiscipleshipGroupsLeadScheduleEmptyState;