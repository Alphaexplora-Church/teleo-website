// src/features/discipleship/views/MyDiscipleshipGroupsLeadDashboardView.tsx
import { ChurchLeadGroupSection } from "../components/groups/ChurchLeadGroupSection";
import type { ChurchLeadGroupData } from "../models/types/discipleship.types";
import type { LeadGroupItem } from "../components/groups/ChurchLeadGroupSection";

const EMPTY_SECTIONS: ChurchLeadGroupData[] = [];

export interface MyDiscipleshipGroupsLeadDashboardViewProps {
  churchSections?: ChurchLeadGroupData[];
  onManageGroup?: (groupId: string, group: LeadGroupItem) => void;
  className?: string;
}

export function MyDiscipleshipGroupsLeadDashboardView({
  churchSections = EMPTY_SECTIONS,
  onManageGroup,
  className = "",
}: MyDiscipleshipGroupsLeadDashboardViewProps) {
  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Dashboard Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
            Lead Groups
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Discipleship groups you facilitate and lead
          </p>
        </div>
      </div>

      {/* ── Church Lead Group Sections ──────────────────────────── */}
      {churchSections.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-xs">
          <p className="text-sm font-medium text-slate-600">No discipleship groups assigned yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Groups you lead will appear here once assigned by church administration.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {churchSections.map((section) => (
            <ChurchLeadGroupSection
              key={section.church_id ?? section.church_name}
              section={section}
              onManageGroup={onManageGroup}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDiscipleshipGroupsLeadDashboardView;

