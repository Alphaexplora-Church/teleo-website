import { MyDiscipleshipLeadEmptyStateView } from "./MyDiscipleshipLeadEmptyState/MyDiscipleshipLeadEmptyStateView";
import { MyDiscipleshipGroupsLeadDashboardView } from "./MyDiscipleshipGroupsLead/MyDiscipleshipGroupsLeadDashboardView";
import { mockLeadChurchGroups } from "../../models/mocks/discipleshipLead.mocks";
import type {
  ChurchLeadGroupData,
  LeadGroupItem,
} from "../../components/ChurchLeadGroupSection";

export interface MyDiscipleshipLeadViewProps {
  churchSections?: ChurchLeadGroupData[];
  onManageGroup?: (groupId: string, group: LeadGroupItem) => void;
  className?: string;
}

export function MyDiscipleshipLeadView({
  churchSections = mockLeadChurchGroups,
  onManageGroup,
  className = "",
}: MyDiscipleshipLeadViewProps = {}) {
  // Check if user has any lead groups under their care
  const hasLeadGroups =
    churchSections.length > 0 &&
    churchSections.some((section) => (section.groups?.length ?? 0) > 0);

  return (
    <div className={`w-full ${className}`.trim()}>
      {hasLeadGroups ? (
        <MyDiscipleshipGroupsLeadDashboardView
          churchSections={churchSections}
          onManageGroup={onManageGroup}
        />
      ) : (
        <MyDiscipleshipLeadEmptyStateView />
      )}
    </div>
  );
}

export default MyDiscipleshipLeadView;