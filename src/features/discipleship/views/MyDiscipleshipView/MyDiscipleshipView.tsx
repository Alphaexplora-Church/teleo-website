import type { DiscipleshipChurch } from "../../models/types/myDiscipleshipEmptyState.types";
import { MyDiscipleshipEmptyState } from "./MyDiscipleshipEmptyState/MyDiscipleshipEmptyState";
import { MyDiscipleshipGroupsDashboard } from "./MyDiscipleshipGroups/MyDiscipleshipGroupsDashboard";
import {
  mockDiscipleshipDashboard,
  type DiscipleshipDashboardMock,
} from "../../models/mocks/discipleshipDashboard.mocks";

export interface MyDiscipleshipViewProps {
  dashboardData?: DiscipleshipDashboardMock;
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  onOpenGroupRoom?: (groupId: string) => void;
  onTrackApplication?: (applicationId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  className?: string;
}

export function MyDiscipleshipView({
  dashboardData = mockDiscipleshipDashboard,
  onSelectChurch,
  onNavigateToChurchList,
  onOpenGroupRoom,
  onTrackApplication,
  onResumeGroup,
  className = "",
}: MyDiscipleshipViewProps = {}) {
  // Check if user has active/paused groups or pending applications
  const hasGroupsOrApplications =
    dashboardData.groups.length > 0 ||
    dashboardData.applications.length > 0;

  return (
    <div className={`w-full ${className}`.trim()}>
      {hasGroupsOrApplications ? (
        <MyDiscipleshipGroupsDashboard
          dashboardData={dashboardData}
          onNavigateToChurchList={onNavigateToChurchList}
          onOpenGroupRoom={onOpenGroupRoom}
          onTrackApplication={onTrackApplication}
          onResumeGroup={onResumeGroup}
        />
      ) : (
        <MyDiscipleshipEmptyState
          onSelectChurch={onSelectChurch}
          onNavigateToChurchList={onNavigateToChurchList}
        />
      )}
    </div>
  );
}

export default MyDiscipleshipView;
