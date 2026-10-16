import { ChurchLeadGroupSection } from "../../../components/ChurchLeadGroupSection";
import {
  myDiscipleshipGroupsLeadDashboardViewConst,
} from "../../../models/constants/myDiscipleshipGroupsLeadDashboardView.constant";
import { mockLeadChurchGroups } from "../../../models/mocks/discipleshipLead.mocks";
import type { MyDiscipleshipGroupsLeadDashboardViewProps } from "../../../models/types/myDiscipleshipGroupsLeadDashboardView.types";

export function MyDiscipleshipGroupsLeadDashboardView({
  config = myDiscipleshipGroupsLeadDashboardViewConst,
  churchSections = mockLeadChurchGroups,
  onManageGroup,
  className = "",
}: MyDiscipleshipGroupsLeadDashboardViewProps) {
  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Dashboard Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
            {config.headerTitle}
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {config.headerSubtitle}
          </p>
        </div>
      </div>

      {/* ── Church Lead Group Sections ──────────────────────────── */}
      <div className="space-y-6">
        {churchSections.map((section) => (
          <ChurchLeadGroupSection
            key={section.church_id ?? section.church_name}
            section={section}
            onManageGroup={onManageGroup}
            membersSuffix={config.membersSuffix}
            singleGroupSuffix={config.singleGroupSuffix}
            multipleGroupsSuffix={config.multipleGroupsSuffix}
            activeBadgeLabel={config.activeBadgeLabel}
            pausedBadgeLabel={config.pausedBadgeLabel}
          />
        ))}
      </div>
    </div>
  );
}

export default MyDiscipleshipGroupsLeadDashboardView;