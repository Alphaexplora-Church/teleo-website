import { ChurchCardItem } from "../../../components/ChurchCardItem";
import { myDiscipleshipEmptyStateListConst } from "../../../models/myDiscipleshipEmptyState.constant";
import type {
  DiscipleshipChurch,
  MyDiscipleshipEmptyStateListPropsConfig,
} from "../../../models/myDiscipleshipEmptyState.types";
import { useDiscipleshipChurches } from "../../../viewmodels/useDiscipleshipChurches";

export interface MyDiscipleshipEmptyStateListProps {
  churches?: DiscipleshipChurch[];
  config?: MyDiscipleshipEmptyStateListPropsConfig;
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  className?: string;
}

export function MyDiscipleshipEmptyStateList({
  churches,
  config = myDiscipleshipEmptyStateListConst,
  onSelectChurch,
  className = "",
}: MyDiscipleshipEmptyStateListProps = {}) {
  const { homeChurches, otherChurches, hasHomeChurch, hasOtherChurches } =
    useDiscipleshipChurches({ churches });

  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Your Home Church Section ───────────────────────────── */}
      {hasHomeChurch && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-[#62718A] uppercase select-none">
            {config.homeChurchHeader}
          </h3>
          <div className="space-y-3">
            {homeChurches.map((church) => (
              <ChurchCardItem
                key={church.church_id}
                church={church}
                homeChurchBadgeLabel={config.homeChurchBadgeLabel}
                activeGroupsLabel={config.activeGroupsLabel}
                onClick={onSelectChurch}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Explore Other Churches Section ─────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-[#62718A] uppercase select-none">
          {config.exploreOtherHeader}
        </h3>

        {hasOtherChurches ? (
          <div className="space-y-3">
            {otherChurches.map((church) => (
              <ChurchCardItem
                key={church.church_id}
                church={church}
                homeChurchBadgeLabel={config.homeChurchBadgeLabel}
                activeGroupsLabel={config.activeGroupsLabel}
                onClick={onSelectChurch}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#62718A] text-center">
            {config.noChurchesCallout}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyDiscipleshipEmptyStateList;
