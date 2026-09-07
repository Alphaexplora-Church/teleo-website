// features/content/views/MyListView.tsx
// View Layer: Dumb UI only. Calls ViewModel hook and renders JSX.
// Strictly NO useState, NO useEffect, NO direct API calls.

import React from 'react';
import { useMyListViewModel } from '../viewModels/useMyListViewModel';
import { toContentSeriesSummary } from '../models/myListTypes';
import { ContentItemCard } from '../../../shared/components/Cards/ContentItemCard';

// ── Icons ────────────────────────────────────────────────────────────────────

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

const BookmarkIcon: React.FC<{ className?: string }> = ({ className = 'size-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

// ── Skeleton Loader ──────────────────────────────────────────────────────────

const ContentItemCardSkeleton: React.FC = () => (
  <div className="w-full bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col justify-between animate-pulse">
    <div>
      <div className="w-full aspect-video sm:h-22 bg-gray-200" />
      <div className="p-2.5 flex flex-col gap-2">
        <div className="w-full h-3.5 bg-gray-200 rounded" />
        <div className="w-1/2 h-2.5 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

// ── View Props ───────────────────────────────────────────────────────────────

interface MyListViewProps {
  onSeriesSelect?: (seriesId: string) => void;
}

// ── MyListView ───────────────────────────────────────────────────────────────

export const MyListView: React.FC<MyListViewProps> = ({ onSeriesSelect }) => {
  const {
    searchQuery,
    handleSearchChange,
    filteredSeries,
    handleSeriesSelect,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useMyListViewModel(
    onSeriesSelect ? (series) => onSeriesSelect(series.id) : undefined
  );

  return (
    <main className="w-full min-h-screen bg-gray-50 flex flex-col items-center overflow-x-hidden">
      {/* ── Search Header ─────────────────────────────────────────────── */}
      <header className="w-full bg-gray-50 px-5 py-3 flex flex-col items-center sticky top-0 z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div
            aria-label="Search bookmarked series"
            className="w-full mx-auto h-9 px-3.5 bg-white hover:bg-white/90 focus-within:bg-white rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 flex items-center transition-all duration-200 shadow-sm"
          >
            <SearchIcon />
            <label htmlFor="my-list-search" className="sr-only">
              Search Bookmarked Series
            </label>
            <input
              id="my-list-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search my list..."
              aria-label="Search my list"
              className="flex-1 w-full ml-2.5 text-gray-800 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal bg-transparent border-none outline-none appearance-none"
            />
          </div>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <section
        className="w-full max-w-4xl mx-auto px-5 py-2 flex-1"
        aria-labelledby="my-list-heading"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="my-list-heading"
            className="text-gray-900 text-lg font-semibold"
          >
            Bookmarked Series
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5 items-stretch">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ContentItemCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) :

          /* Error State */
          error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-red-500 bg-red-50 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </p>
            </div>
          ) :

            /* Empty State */
            filteredSeries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <BookmarkIcon className="size-6" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">
                  {searchQuery ? 'No matching series found' : 'Your list is empty'}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  {searchQuery
                    ? `We couldn't find any bookmarks matching "${searchQuery}".`
                    : 'Bookmark your favorite series from the catalog to easily find them here.'}
                </p>
              </div>
            ) :

              /* Grid Results */
              (
                <div className="flex flex-col w-full gap-6">
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5 items-stretch">
                    {filteredSeries.map((series) => (
                      <ContentItemCard
                        key={series.id}
                        series={toContentSeriesSummary(series)}
                        onViewSeries={() => handleSeriesSelect(series)}
                        className="w-full"
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="w-full flex justify-center pt-4 pb-8">
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="px-8 py-3 bg-navy text-white text-sm font-medium rounded-full shadow-md hover:bg-navy-hover active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isLoadingMore ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
      </section>
    </main>
  );
};

export default MyListView;

