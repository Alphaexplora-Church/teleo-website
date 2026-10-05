import { LinkButton } from "../../../../../shared/components/Button/LinkButton";
import { ChurchCardItem } from "../../../components/ChurchCardItem";
import { myDiscipleshipEmptyStateListConst } from "../../../models/constants/myDiscipleshipEmptyStateView.constant";
import type {
  DiscipleshipChurch,
  MyDiscipleshipEmptyStateListPropsConfig,
} from "../../../models/types/myDiscipleshipEmptyStateView.types";
import { useDiscipleshipChurches } from "../../../viewmodels/useDiscipleshipChurches";

export interface MyDiscipleshipEmptyStateListProps {
  churches?: DiscipleshipChurch[];
  config?: MyDiscipleshipEmptyStateListPropsConfig;
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onMoreChurches?: () => void;
  className?: string;
}

export function MyDiscipleshipEmptyStateList({
  churches,
  config = myDiscipleshipEmptyStateListConst,
  onSelectChurch,
  onMoreChurches,
  className = "",
}: MyDiscipleshipEmptyStateListProps = {}) {
  const maxDisplayed = config.maxDisplayedChurches ?? 3;
  const { homeChurches, displayedOtherChurches, hasHomeChurch, hasOtherChurches } =
    useDiscipleshipChurches({ churches, maxDisplayed });

  const MoreIcon = config.buttonMore?.icon;

  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Your Home Church Section ───────────────────────────── */}
      {hasHomeChurch && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
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
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
          {config.exploreOtherHeader}
        </h3>

        {hasOtherChurches ? (
          <div className="space-y-3">
            {displayedOtherChurches.map((church) => (
              <ChurchCardItem
                key={church.church_id}
                church={church}
                homeChurchBadgeLabel={config.homeChurchBadgeLabel}
                activeGroupsLabel={config.activeGroupsLabel}
                onClick={onSelectChurch}
              />
            ))}

            {/* ── More Churches Button ────────────────────────────── */}
            {config.buttonMore && (
              <div className="pt-1">
                <LinkButton
                  to={config.buttonMore.to ?? "/discipleship/church-list"}
                  onClick={(e) => {
                    if (onMoreChurches) {
                      e.preventDefault();
                      onMoreChurches();
                    }
                  }}
                  variant={config.buttonMore.variant ?? "outline"}
                  fullWidth
                  className="flex items-center justify-center gap-1.5"
                >
                  <span>{config.buttonMore.label}</span>
                  {MoreIcon && <MoreIcon className="w-4 h-4" />}
                </LinkButton>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 text-center">
            {config.noChurchesCallout}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyDiscipleshipEmptyStateList;
