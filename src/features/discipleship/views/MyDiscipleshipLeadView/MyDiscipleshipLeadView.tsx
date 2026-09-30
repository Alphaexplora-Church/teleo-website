import { MyDiscipleshipLeadEmptyState } from "./MyDiscipleshipLeadEmptyState/MyDiscipleshipLeadEmptyState";

export interface MyDiscipleshipLeadViewProps {
  className?: string;
}

export function MyDiscipleshipLeadView({
  className = "",
}: MyDiscipleshipLeadViewProps = {}) {
  return (
    <div className={`w-full ${className}`.trim()}>
      <MyDiscipleshipLeadEmptyState />
    </div>
  );
}

export default MyDiscipleshipLeadView;