import { Calendar, Plus } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";

export interface MyDiscipleshipGroupsLeadScheduleEmptyStateProps {
  onSetSchedule?: () => void;
  className?: string;
}

export function MyDiscipleshipGroupsLeadScheduleEmptyState({
  onSetSchedule,
  className = "",
}: MyDiscipleshipGroupsLeadScheduleEmptyStateProps) {
  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-xs select-none space-y-5 text-center ${className}`.trim()}
    >
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-left">
        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase select-none">
          Schedule
        </span>
      </div>

      {/* ── Center Content: Icon, Title & Description ─────────────── */}
      <div className="space-y-3 pt-1">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500 shrink-0">
          <Calendar className="w-6 h-6 text-slate-500" />
        </div>

        <div className="space-y-1.5 max-w-[290px] mx-auto">
          <h3 className="text-[17px] font-bold text-slate-900 leading-snug">
            No Schedule Set
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            Set up a regular meeting schedule for your group so members know when to gather.
          </p>
        </div>
      </div>

      {/* ── Action Button ─────────────────────────────────────────── */}
      <Button
        type="button"
        variant="primary"
        size="md"
        fullWidth
        onClick={onSetSchedule}
        className="text-white flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>Set Schedule</span>
      </Button>
    </div>
  );
}

export default MyDiscipleshipGroupsLeadScheduleEmptyState;

