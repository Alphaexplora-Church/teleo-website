// src/features/discipleship/views/MyDiscipleshipEmptyStateView.tsx
import { Church, ArrowRight, ChevronRight } from "lucide-react";
import { LinkButton } from "../../../shared/components/Button/LinkButton";
import { ChurchCardItem } from "../components/cards/ChurchCardItem";
import type { DiscipleshipChurch } from "../models/types/discipleship.types";
import { useDiscipleshipChurches } from "../viewmodels/useDiscipleshipChurches";

export interface MyDiscipleshipEmptyStateViewProps {
  churches?: DiscipleshipChurch[];
  onSelectChurch?: (church: DiscipleshipChurch) => void;
  onNavigateToChurchList?: () => void;
  className?: string;
}

export function MyDiscipleshipEmptyStateView({
  churches,
  onSelectChurch,
  onNavigateToChurchList,
  className = "",
}: MyDiscipleshipEmptyStateViewProps = {}) {
  const { homeChurches, displayedOtherChurches, hasHomeChurch, hasOtherChurches } =
    useDiscipleshipChurches({ churches, maxDisplayed: 3 });

  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Join Discipleship Card ──────────────────────────────── */}
      <div className="w-full bg-slate-100 rounded-3xl p-6 text-center flex flex-col items-center select-none">
        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mb-4 shrink-0">
          <Church className="w-6 h-6 text-slate-900" />
        </div>

        <div className="mb-6">
          <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-2">
            You're not part of a Discipleship yet
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-70 mx-auto">
            Connect with a local group to grow in faith, accountability, and community with fellow believers.
          </p>
        </div>

        <LinkButton
          to="/discipleship/church-list"
          onClick={(e) => {
            if (onNavigateToChurchList) {
              e.preventDefault();
              onNavigateToChurchList();
            }
          }}
          fullWidth
          className="text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Join a Discipleship</span>
          <ArrowRight className="w-4 h-4" />
        </LinkButton>
      </div>

      {/* ── Church List Sections ────────────────────────────────── */}
      <div className="w-full space-y-6">
        {/* ── Your Home Church Section ───────────────────────────── */}
        {hasHomeChurch && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
              Your Home Church
            </h3>
            <div className="space-y-3">
              {homeChurches.map((church) => (
                <ChurchCardItem
                  key={church.church_id}
                  church={church}
                  onClick={onSelectChurch}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Explore Other Churches Section ─────────────────────── */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
            Explore Other Churches
          </h3>

          {hasOtherChurches ? (
            <div className="space-y-3">
              {displayedOtherChurches.map((church) => (
                <ChurchCardItem
                  key={church.church_id}
                  church={church}
                  onClick={onSelectChurch}
                />
              ))}

              {/* ── More Churches Button ────────────────────────────── */}
              <div className="pt-1">
                <LinkButton
                  to="/discipleship/church-list"
                  onClick={(e) => {
                    if (onNavigateToChurchList) {
                      e.preventDefault();
                      onNavigateToChurchList();
                    }
                  }}
                  variant="outline"
                  fullWidth
                  className="flex items-center justify-center gap-1.5"
                >
                  <span>More Churches</span>
                  <ChevronRight className="w-4 h-4" />
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 text-center">
              No churches found
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyDiscipleshipEmptyStateView;

