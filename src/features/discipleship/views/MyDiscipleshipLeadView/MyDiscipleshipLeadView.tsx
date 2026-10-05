import { MyDiscipleshipLeadEmptyStateView } from "./MyDiscipleshipLeadEmptyState/MyDiscipleshipLeadEmptyStateView";

export interface MyDiscipleshipLeadViewProps {
  className?: string;
}

export function MyDiscipleshipLeadView({
  className = "",
}: MyDiscipleshipLeadViewProps = {}) {
  return (
    <div className={`w-full ${className}`.trim()}>
      <MyDiscipleshipLeadEmptyStateView />
    </div>
  );
}

export default MyDiscipleshipLeadView;