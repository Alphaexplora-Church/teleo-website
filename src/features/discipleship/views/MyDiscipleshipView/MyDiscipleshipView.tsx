import type { DiscipleshipChurch } from "../../models/types/myDiscipleshipEmptyState.types";
import { MyDiscipleshipEmptyState } from "./MyDiscipleshipEmptyState/MyDiscipleshipEmptyState";

export interface MyDiscipleshipViewProps {
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  className?: string;
}

export function MyDiscipleshipView({
  onSelectChurch,
  onNavigateToChurchList,
  className = "",
}: MyDiscipleshipViewProps = {}) {
  // NOTE: When a user has a group, group view will be rendered here.
  // For users without a group, render MyDiscipleshipEmptyState.
  const hasGroup = false;

  return (
    <div className={`w-full ${className}`.trim()}>
      {!hasGroup ? (
        <MyDiscipleshipEmptyState
          onSelectChurch={onSelectChurch}
          onNavigateToChurchList={onNavigateToChurchList}
        />
      ) : (
        <div>{/* Active group view content */}</div>
      )}
    </div>
  );
}

export default MyDiscipleshipView;
