// src/features/discipleship/views/MyDiscipleshipView/MyDiscipleshipView.tsx
import type { DiscipleshipChurch } from "../../models/types/myDiscipleshipEmptyStateView.types";
import { MyDiscipleshipEmptyStateView } from "./MyDiscipleshipEmptyState/MyDiscipleshipEmptyStateView";
import { MyDiscipleshipGroupsDashboardView } from "./MyDiscipleshipGroups/MyDiscipleshipGroupsDashboardView";
import type { DiscipleshipDashboardData } from "../../models/types/discipleshipDashboard.types";

const EMPTY_DASHBOARD: DiscipleshipDashboardData = {
  applications: [],
  groups: [],
};

export interface MyDiscipleshipViewProps {
  dashboardData?: DiscipleshipDashboardData;
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  onOpenGroupRoom?: (groupId: string) => void;
  onTrackApplication?: (applicationId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  className?: string;
}

export function MyDiscipleshipView({
  dashboardData = EMPTY_DASHBOARD,
  onSelectChurch,
  onNavigateToChurchList,
  onOpenGroupRoom,
  onTrackApplication,
  onResumeGroup,
  className = "",
}: MyDiscipleshipViewProps = {}) {
  // Check if user has active/paused groups or pending applications
  const hasGroupsOrApplications =
    (dashboardData.groups?.length ?? 0) > 0 ||
    (dashboardData.applications?.length ?? 0) > 0;

  return (
    <div className={`w-full ${className}`.trim()}>
      {hasGroupsOrApplications ? (
        <MyDiscipleshipGroupsDashboardView
          dashboardData={dashboardData}
          onNavigateToChurchList={onNavigateToChurchList}
          onOpenGroupRoom={onOpenGroupRoom}
          onTrackApplication={onTrackApplication}
          onResumeGroup={onResumeGroup}
        />
      ) : (
        <MyDiscipleshipEmptyStateView
          onSelectChurch={onSelectChurch}
          onNavigateToChurchList={onNavigateToChurchList}
        />
      )}
    </div>
  );
}

export default MyDiscipleshipView;
