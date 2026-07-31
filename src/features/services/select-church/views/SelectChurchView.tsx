// features/services/select-church/views/SelectChurchView.tsx
// View layer: dumb UI only. NO useState, NO useEffect, NO API calls.

import React from 'react';
import { useFindMyChurchViewModel } from '../viewModels/useSelectChurchViewModel';
import type { Church } from '../models/selectChurchTypes';

// ── Search Icon ──────────────────────────────────────────────────────────────

const SearchIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-black/50"
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
      className="w-full max-w-28 flex flex-col justify-start items-center gap-3 rounded-[20px] cursor-pointer hover:bg-black/5 active:scale-95 transition-all duration-150 p-1"
    >
      {/* Circular church avatar */}
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
      <div className="w-full flex flex-col justify-center items-center">
        <p className="w-full text-center">
          <span className="text-black text-sm font-normal font-['Roboto'] leading-4 block break-words">
            {church.name}
          </span>
        </p>
      </div>
    </article>
  );
};

// ── View Props ───────────────────────────────────────────────────────────────

interface SelectChurchViewProps {
  /** Injected by parent/AppShell — selected service name (e.g. "Baptism", "Counseling"). */
  serviceName?: string;
  /** Called when the user taps a church card. Provided by parent/AppShell. */
  onChurchSelect?: (church: Church) => void;
}

// ── SelectChurchView ──────────────────────────────────────────────────────────

const SelectChurchView: React.FC<SelectChurchViewProps> = ({ serviceName, onChurchSelect }) => {
  const { searchQuery, handleSearchChange, churchRows, handleChurchSelect, isLoading, error } =
    useFindMyChurchViewModel(onChurchSelect);

  return (
    <main className="w-full min-h-screen bg-neutral-50 flex flex-col items-center gap-4 overflow-hidden px-5 pt-4 pb-10">
      {/* ── Search bar ───────────────────────────────────────────── */}
      <section
        aria-label="Search churches"
        className="w-full h-10 px-3.5 bg-blue-500/5 rounded-xl border border-blue-950/30 flex items-center"
      >
        <div className="w-full inline-flex items-center gap-2">
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
            className="flex-1 text-black text-xs font-normal font-['Roboto'] leading-4 placeholder:text-black/40 bg-transparent border-none outline-none"
          />
        </div>
      </section>

      {/* ── Churches near me ─────────────────────────────────────── */}
      <section
        className="w-full flex flex-col items-start gap-3"
        aria-labelledby="churches-near-me-heading"
      >
        <div className="self-stretch inline-flex justify-between items-center h-6">
          <h2
            id="churches-near-me-heading"
            className="text-black text-xl font-bold font-['Poppins'] leading-6"
          >
            Churches offering {serviceName || 'Services'}
          </h2>
        </div>

        {/* Church grid — 3 cards per row */}
        {isLoading ? (
          <p className="text-black/60 text-sm font-normal font-['Roboto'] py-6 text-center w-full">
            Loading churches…
          </p>
        ) : error ? (
          <p className="text-red-500 text-sm font-normal font-['Roboto'] py-6 text-center w-full">
            {error}
          </p>
        ) : churchRows.length === 0 ? (
          <p className="text-black/60 text-sm font-normal font-['Roboto'] py-6 text-center w-full">
            {searchQuery.trim() ? `No churches found for "${searchQuery}".` : 'No churches available.'}
          </p>
        ) : (
          churchRows.map((row, rowIndex) => (
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
          ))
        )}
      </section>

    </main>
  );
};

export default SelectChurchView;
