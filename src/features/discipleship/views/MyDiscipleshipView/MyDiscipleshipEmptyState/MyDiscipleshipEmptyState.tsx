import { myDiscipleshipEmptyStateConst } from "../../../models/myDiscipleshipEmptyState.constant";
import { MyDiscipleshipEmptyStateJoinCard } from "./MyDiscipleshipEmptyStateJoinCard";
import { MyDiscipleshipEmptyStateList } from "./MyDiscipleshipEmptyStateList";

export interface MyDiscipleshipEmptyStateProps {
  className?: string;
}

export function MyDiscipleshipEmptyState({
  className = "",
}: MyDiscipleshipEmptyStateProps = {}) {
  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Join Discipleship Card ──────────────────────────────── */}
      <MyDiscipleshipEmptyStateJoinCard joinCardLink={myDiscipleshipEmptyStateConst} />

      {/* ── Church List Sections ────────────────────────────────── */}
      <MyDiscipleshipEmptyStateList />
    </div>
  );
}

export default MyDiscipleshipEmptyState;
