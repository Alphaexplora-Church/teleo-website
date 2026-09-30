import { MyDiscipleshipEmptyState } from "./MyDiscipleshipEmptyState/MyDiscipleshipEmptyState";

export interface MyDiscipleshipViewProps {
  className?: string;
}

export function MyDiscipleshipView({
  className = "",
}: MyDiscipleshipViewProps = {}) {
  // NOTE: When a user has a group, group view will be rendered here.
  // For users without a group, render MyDiscipleshipEmptyState.
  const hasGroup = false;

  return (
    <div className={`w-full ${className}`.trim()}>
      {!hasGroup ? (
        <MyDiscipleshipEmptyState />
      ) : (
        <div>{/* Active group view content */}</div>
      )}
    </div>
  );
}

export default MyDiscipleshipView;
