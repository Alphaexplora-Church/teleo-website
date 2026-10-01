import type { DiscipleshipChurch } from "../../../models/types/myDiscipleshipEmptyState.types";
import { myDiscipleshipEmptyStateConst } from "../../../models/constants/myDiscipleshipEmptyState.constant";
import { MyDiscipleshipEmptyStateJoinCard } from "./MyDiscipleshipEmptyStateJoinCard";
import { MyDiscipleshipEmptyStateList } from "./MyDiscipleshipEmptyStateList";

export interface MyDiscipleshipEmptyStateProps {
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  className?: string;
}

export function MyDiscipleshipEmptyState({
  onSelectChurch,
  onNavigateToChurchList,
  className = "",
}: MyDiscipleshipEmptyStateProps = {}) {
  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Join Discipleship Card ──────────────────────────────── */}
      <MyDiscipleshipEmptyStateJoinCard
        joinCardLink={myDiscipleshipEmptyStateConst}
        onJoin={onNavigateToChurchList}
      />

      {/* ── Church List Sections ────────────────────────────────── */}
      <MyDiscipleshipEmptyStateList
        onSelectChurch={onSelectChurch}
        onMoreChurches={onNavigateToChurchList}
      />
    </div>
  );
}

export default MyDiscipleshipEmptyState;
