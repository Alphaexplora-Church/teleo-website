// features/profile/findmychurch/views/FindMyChurchView.tsx
// View layer: dumb UI only. NO useState, NO useEffect, NO API calls.

import React from 'react';
import { useFindMyChurchViewModel } from '../viewModels/useFindMyChurchViewModel';
import type { Church } from '../models/findMyChurchTypes';

// ── Search icon ───────────────────────────────────────────────
const SearchIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-[#1f2156]"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ── Church card ───────────────────────────────────────────────
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
      className="w-28 flex flex-col justify-center items-center gap-5 rounded-[20px] cursor-pointer hover:bg-black/5 active:scale-95 transition-all duration-150 p-2"
    >
      {/* Church avatar */}
      <div className="size-24 rounded-full bg-zinc-300 overflow-hidden shrink-0 flex items-center justify-center">
        {church.imageUrl && !imgError ? (
          <img
            src={church.imageUrl}
            alt={church.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-300 flex items-center justify-center text-zinc-500 text-xl font-bold" aria-hidden="true">
            {church.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Church name */}
      <div className="self-stretch flex flex-col justify-center items-center gap-2">
        <p className="w-28 text-center">
          <span className="text-black text-sm font-normal leading-4 block">
            {church.name}
          </span>
          <span className="text-neutral-400 text-[10px] font-normal leading-4">
            {church.shortName}
          </span>
        </p>
      </div>
    </article>
  );
};

// ── Loading skeleton ──────────────────────────────────────────
const ChurchCardSkeleton: React.FC = () => (
  <div className="w-28 flex flex-col justify-center items-center gap-5 p-2 animate-pulse">
    <div className="size-24 rounded-full bg-zinc-200" />
    <div className="flex flex-col items-center gap-1">
      <div className="w-20 h-3 bg-zinc-200 rounded" />
      <div className="w-14 h-2 bg-zinc-200 rounded" />
    </div>
  </div>
);

// ── View props ───────────────────────────────────────────────────
interface FindMyChurchViewProps {
  /** Called when the user taps a church card. Provided by AppShell. */
  onChurchSelect?: (church: Church) => void;
}

// ── Component ───────────────────────────────────────────────────
const FindMyChurchView: React.FC<FindMyChurchViewProps> = ({ onChurchSelect }) => {
  const {
    searchQuery,
    handleSearchChange,
    churchRows,
    handleChurchSelect,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useFindMyChurchViewModel(onChurchSelect);

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-screen pt-6 px-4 pb-10 bg-neutral-50">

      {/* ── Search bar ──────────────────────────────────────── */}
      <section
        aria-label="Search churches"
        className="w-full max-w-[371px] h-14 flex flex-col items-center justify-center gap-2.5 pl-[18px] pr-[13px] pt-[9px] pb-2.5 bg-blue-500/5 rounded-[20px] border border-solid border-[#1f2156] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0"
      >
        <div className="flex w-full items-center gap-2 relative">
          <SearchIcon />
          <label htmlFor="church-search" className="sr-only">Search for Churches</label>
          <input
            id="church-search"
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for Churches"
            aria-label="Search for Churches"
            className="flex-1 font-normal text-black text-xs leading-[14px] tracking-[0] placeholder:text-black/40 bg-transparent border-none outline-none"
          />
        </div>
      </section>

      {/* ── Churches near me ────────────────────────────────── */}
      <section
        className="flex flex-col w-full max-w-[371px] items-start gap-5 relative"
        aria-labelledby="churches-near-me-heading"
      >
        <div className="self-stretch inline-flex justify-between items-center">
          <h2
            id="churches-near-me-heading"
            className="text-black text-2xl font-medium leading-6"
          >
            Churches near me
          </h2>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="self-stretch flex justify-start items-center gap-1.5">
            {[1, 2, 3].map((i) => (
              <ChurchCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="w-full flex flex-col items-center gap-3 py-6">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        ) : churchRows.length === 0 ? (
          <p className="text-neutral-400 text-sm py-6 text-center w-full">
            No churches found{searchQuery ? ` for "${searchQuery}"` : ''}.
          </p>
        ) : (
          <>
            {churchRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="self-stretch flex justify-start items-center gap-1.5"
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

            {/* Load More button */}
            {hasMore && (
              <div className="w-full flex justify-center pt-2">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2.5 bg-[#1f2156] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#2c2f6d] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

    </main>
  );
};

export default FindMyChurchView;
