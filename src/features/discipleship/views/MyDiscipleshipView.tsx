// src/features/discipleship/views/MyDiscipleshipView.tsx
import type { DiscipleshipChurch, DiscipleshipDashboardData } from "../models/types/discipleship.types";
import { EMPTY_DASHBOARD_DATA } from "../models/constants/discipleship.constants";
import { MyDiscipleshipEmptyStateView } from "./MyDiscipleshipEmptyStateView";
import { MyDiscipleshipGroupsDashboardView } from "./MyDiscipleshipGroupsDashboardView";

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
  dashboardData = EMPTY_DASHBOARD_DATA,
  onSelectChurch,
  onNavigateToChurchList,
  onOpenGroupRoom,
  onTrackApplication,
  onResumeGroup,
  className = "",
}: MyDiscipleshipViewProps = {}) {
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

