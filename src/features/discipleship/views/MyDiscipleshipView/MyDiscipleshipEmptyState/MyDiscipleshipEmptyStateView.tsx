import type { DiscipleshipChurch } from "../../../models/types/myDiscipleshipEmptyStateView.types";
import { myDiscipleshipEmptyStateConst } from "../../../models/constants/myDiscipleshipEmptyStateView.constant";
import { MyDiscipleshipEmptyStateJoinCard } from "./MyDiscipleshipEmptyStateJoinCard";
import { MyDiscipleshipEmptyStateList } from "./MyDiscipleshipEmptyStateList";

export interface MyDiscipleshipEmptyStateViewProps {
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  className?: string;
}

export type MyDiscipleshipEmptyStateProps = MyDiscipleshipEmptyStateViewProps;

export function MyDiscipleshipEmptyStateView({
  onSelectChurch,
  onNavigateToChurchList,
  className = "",
}: MyDiscipleshipEmptyStateViewProps = {}) {
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

export default MyDiscipleshipEmptyStateView;
