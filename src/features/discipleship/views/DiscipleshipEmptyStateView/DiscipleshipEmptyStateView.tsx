import { discipleshipEmptyStateConst } from "../../models/discipleshipEmptyState.constant";
import { DiscipleshipEmptyStateJoinCard } from "./DiscipleshipEmptyStateJoinCard";
import { DiscipleshipEmptyStateList } from "./DiscipleshipEmptyStateList";

export interface DiscipleshipEmptyStateViewProps {
  className?: string;
}

export function DiscipleshipEmptyStateView({
  className = "",
}: DiscipleshipEmptyStateViewProps = {}) {
  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Join Discipleship Card ──────────────────────────────── */}
      <DiscipleshipEmptyStateJoinCard joinCardLink={discipleshipEmptyStateConst} />

      {/* ── Church List Sections ────────────────────────────────── */}
      <DiscipleshipEmptyStateList />
    </div>
  );
}

export default DiscipleshipEmptyStateView;
