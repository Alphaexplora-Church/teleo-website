import { Link } from "react-router-dom";
import { Badge } from "../../../../shared/components/Badge/Badge";
import { discipleshipProcessChurchListConst } from "../../models/constants/discipleshipProcessChurchList.constant";
import type {
  DiscipleshipChurchItem,
  DiscipleshipProcessChurchListViewProps,
} from "../../models/types/discipleshipProcessChurchList.types";
import { useDiscipleshipProcessChurchList } from "../../viewmodels/useDiscipleshipProcessChurchList";

export function DiscipleshipProcessChurchList({
  config: userConfig,
  churches,
  onSelectChurch,
  onBack,
  className = "",
}: DiscipleshipProcessChurchListViewProps = {}) {
  const config = {
    ...discipleshipProcessChurchListConst,
    ...userConfig,
    buttonBack: {
      ...discipleshipProcessChurchListConst.buttonBack,
      ...userConfig?.buttonBack,
    },
    searchBar: {
      ...discipleshipProcessChurchListConst.searchBar,
      ...userConfig?.searchBar,
    },
    icons: {
      ...discipleshipProcessChurchListConst.icons,
      ...userConfig?.icons,
    },
  };

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    homeChurches,
    otherChurches,
    availableCount,
    hasResults,
    hasQuery,
  } = useDiscipleshipProcessChurchList({ churches });

  // Icons are injected exclusively from Model/Constant layer
  const BackIcon = config.buttonBack.icon;
  const SearchIcon = config.searchBar.icon;
  const ClearIcon = config.searchBar.clearIcon;
  const ChevronIcon = config.icons.chevronRight;

  const searchPlaceholder =
    config.searchBar.placeHolder ??
    config.searchBar.placeholder ??
    "Search church name or city...";

  const handleCardClick = (church: DiscipleshipChurchItem) => {
    onSelectChurch?.(church);
  };

  return (
    <div className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}>
      {/* ── Top Header: Back Button Only ──────────────────────── */}
      <div className="flex items-center">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[17px] font-semibold text-[#0E172A] hover:text-[#042C58] transition-colors cursor-pointer border-none bg-transparent p-0"
            aria-label={config.buttonBack.label || "Back"}
          >
            {BackIcon && <BackIcon className="w-5 h-5 -ml-1 text-[#0E172A]" />}
            <span>{config.buttonBack.label}</span>
          </button>
        ) : (
          <Link
            to={config.buttonBack.to || "/discipleship"}
            className="inline-flex items-center gap-1 text-[17px] font-semibold text-[#0E172A] hover:text-[#042C58] transition-colors cursor-pointer"
            aria-label={config.buttonBack.label || "Back"}
          >
            {BackIcon && <BackIcon className="w-5 h-5 -ml-1 text-[#0E172A]" />}
            <span>{config.buttonBack.label}</span>
          </Link>
        )}
      </div>

      {/* ── Search Bar Input ───────────────────────────────────── */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none flex items-center justify-center text-[#62718A]">
          {SearchIcon && <SearchIcon className="w-5 h-5" aria-hidden="true" />}
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full h-12 pl-12 pr-10 bg-[#F1F3F6] rounded-2xl text-[15px] text-[#0E172A] placeholder-[#62718A] border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all duration-200"
        />

        {hasQuery && ClearIcon && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search query"
            className="absolute right-3.5 p-1 rounded-full text-[#62718A] hover:text-[#0E172A] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ClearIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Empty Search Results ───────────────────────────────── */}
      {!hasResults && (
        <div className="py-12 text-center">
          <p className="text-[14px] text-[#62718A]">{config.noResultsMessage}</p>
        </div>
      )}

      {/* ── 1. Home Church Section ─────────────────────────────── */}
      {homeChurches.length > 0 && (
        <section aria-labelledby="home-church-heading" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2
              id="home-church-heading"
              className="text-xs font-bold text-[#62718A] tracking-wider uppercase"
            >
              {config.homeChurchHeader}
            </h2>
          </div>

          <div className="space-y-3">
            {homeChurches.map((church) => (
              <button
                key={church.church_id}
                type="button"
                onClick={() => handleCardClick(church)}
                className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 text-left transition-all duration-200 hover:border-slate-200 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Gray placeholder for future church image */}
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#E2E8F0] shrink-0"
                    aria-hidden="true"
                  />

                  {/* Church Details */}
                  <div className="flex flex-col items-start min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#0E172A] truncate">
                      {church.name}
                    </h3>

                    {/* Soft Gray Home Church Badge */}
                    <div className="mt-1">
                      <Badge label={config.homeBadgeLabel} size="sm" />
                    </div>

                    <span className="text-[13px] text-[#62718A] font-normal mt-1 truncate">
                      {church.active_groups_count} {config.activeGroupsSuffix}
                      {church.city ? ` · ${church.city}` : ""}
                    </span>
                  </div>
                </div>

                {ChevronIcon && (
                  <ChevronIcon className="w-5 h-5 text-[#62718A] shrink-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── 2. All Churches Section ────────────────────────────── */}
      {otherChurches.length > 0 && (
        <section aria-labelledby="all-churches-heading" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2
              id="all-churches-heading"
              className="text-xs font-bold text-[#62718A] tracking-wider uppercase"
            >
              {config.allChurchesHeader}
            </h2>
            <span className="text-xs font-medium text-[#62718A]">
              {availableCount} {config.availableSuffix}
            </span>
          </div>

          <div className="space-y-3">
            {otherChurches.map((church) => (
              <button
                key={church.church_id}
                type="button"
                onClick={() => handleCardClick(church)}
                className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 text-left transition-all duration-200 hover:border-slate-200 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Gray placeholder for future church image */}
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#E2E8F0] shrink-0"
                    aria-hidden="true"
                  />

                  {/* Church Details */}
                  <div className="flex flex-col items-start min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#0E172A] truncate">
                      {church.name}
                    </h3>
                    <span className="text-[13px] text-[#62718A] font-normal mt-1 truncate">
                      {church.active_groups_count} {config.activeGroupsSuffix}
                      {church.city ? ` · ${church.city}` : ""}
                    </span>
                  </div>
                </div>

                {ChevronIcon && (
                  <ChevronIcon className="w-5 h-5 text-[#62718A] shrink-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DiscipleshipProcessChurchList;
