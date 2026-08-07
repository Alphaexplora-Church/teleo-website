// features/services/select-church/views/SelectChurchView.tsx
// View layer: dumb UI only. NO useState (except img error fallback), NO useEffect, NO API calls.

import React from 'react';
import { useFindMyChurchViewModel } from '../viewModels/useSelectChurchViewModel';
import type { Church } from '../models/selectChurchTypes';

// ── Search Icon ──────────────────────────────────────────────────────────────

const SearchIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-gray-400"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ── Church Card ──────────────────────────────────────────────────────────────

interface ChurchCardProps {
  church: Church;
  onClick: () => void;
}

const ChurchCard: React.FC<ChurchCardProps> = ({ church, onClick }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Select ${church.name}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group w-full max-w-[112px] flex flex-col items-center gap-3 p-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:shadow-black/5 active:scale-95 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white"
    >
      {/* Circular church avatar with hover pop */}
      <div className="relative size-20 sm:size-24 rounded-full overflow-hidden shrink-0 shadow-sm border border-black/5 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
        {church.imageUrl && !imgError ? (
          <img
            src={church.imageUrl}
            alt={church.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold"
            aria-hidden="true"
          >
            {church.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Church name & short name */}
      <div className="w-full flex flex-col justify-center items-center gap-0.5">
        <h3 className="w-full text-center text-gray-900 text-sm font-medium leading-tight line-clamp-2">
          {church.name}
        </h3>
        {church.shortName && (
          <span className="text-gray-500 text-xs font-normal line-clamp-1">
            {church.shortName}
          </span>
        )}
      </div>
    </article>
  );
};

// ── Skeleton Loader ──────────────────────────────────────────────────────────

const ChurchCardSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-3 p-2 w-full max-w-[112px]">
    <div className="size-20 sm:size-24 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="w-3/4 h-3.5 rounded bg-gray-200 animate-pulse" />
      <div className="w-1/2 h-2.5 rounded bg-gray-100 animate-pulse" />
    </div>
  </div>
);

// ── View Props ───────────────────────────────────────────────────────────────

interface SelectChurchViewProps {
  /** Injected by parent/AppShell — selected service name (e.g. "Baptism", "Counseling"). */
  serviceName?: string;
  /** Called when the user taps a church card. Provided by parent/AppShell. */
  onChurchSelect?: (church: Church) => void;
}

// ── SelectChurchView Component ────────────────────────────────────────────────

const SelectChurchView: React.FC<SelectChurchViewProps> = ({ serviceName, onChurchSelect }) => {
  const { searchQuery, handleSearchChange, churchRows, handleChurchSelect, isLoading, error } =
    useFindMyChurchViewModel(onChurchSelect);

  return (
    <main className="w-full min-h-screen bg-gray-50 flex flex-col items-center overflow-x-hidden">
      {/* ── Search Hero ───────────────────────────────────────────── */}
      <header className="w-full bg-gray-50 px-5 py-3 flex flex-col items-center sticky top-0 z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div
            aria-label="Search churches"
            className="w-full max-w-sm mx-auto h-9 px-3.5 bg-white hover:bg-white/90 focus-within:bg-white rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 flex items-center transition-all duration-200 shadow-sm"
          >
            <SearchIcon />
            <label htmlFor="church-search" className="sr-only">
              Search for Churches
            </label>
            <input
              id="church-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for Churches"
              aria-label="Search for Churches"
              className="flex-1 w-full ml-2.5 text-gray-800 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal bg-transparent border-none outline-none appearance-none"
            />
          </div>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <section
        className="w-full max-w-4xl mx-auto px-5 py-2 flex-1 flex flex-col"
        aria-labelledby="churches-offering-heading"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="churches-offering-heading"
            className="text-gray-900 text-lg font-semibold leading-tight"
          >
            Churches offering {serviceName || 'Services'}
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="w-full grid grid-cols-3 justify-items-center items-start gap-2">
            {[1, 2, 3].map((i) => (
              <ChurchCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-red-500 bg-red-50 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </p>
          </div>
        ) : churchRows.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <SearchIcon />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No churches found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {searchQuery.trim()
                ? `We couldn't find any matches for "${searchQuery}". Try adjusting your search.`
                : 'No churches are currently available.'}
            </p>
          </div>
        ) : (
          /* Grid Results (Strict 3 per row) */
          <div className="flex flex-col w-full gap-6">
            {churchRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="w-full grid grid-cols-3 justify-items-center items-start gap-2"
              >
                {row.map((church) => (
                  <ChurchCard
                    key={church.id}
                    church={church}
                    onClick={() => handleChurchSelect(church)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SelectChurchView;
