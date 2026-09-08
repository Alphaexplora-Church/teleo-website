// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentCatalogViewModel } from '../viewModels/useContentCatalogViewModel';
import { ContentSectionRail } from '../../../shared/components/Cards/ContentSectionRail';
import { ContentItemCard } from '../../../shared/components/Cards/ContentItemCard';

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

const ClearIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BookmarkIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);export const ContentCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedCategory,
    searchQuery,
    handleSearchChange,
    handleClearSearch,
    handleResetFilters,
    isFiltering,
    filteredSeries,
    categories,
    isLoading,
    loadError,
    retry,
    mostWatchedRail,
    continueRail,
    becauseYouWatchedRail,
    sundayServiceRail,
    devotionalRail,
    bibleStudyRail,
    generalRail,
    handleCategorySelect,
  } = useContentCatalogViewModel();

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* ── 1. Search & Category Chips Header ───────────────────────────── */}
      <section aria-label="Search and Categories" className="px-5 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <label htmlFor="catalog-search" className="sr-only">
              Search series, topics, devotionals
            </label>
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search series, topics, devotionals..."
              className="w-full h-11 pl-9 pr-9 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#1f2156] focus:ring-1 focus:ring-[#1f2156] text-sm text-black placeholder:text-gray-placeholder transition-all duration-150 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-3 flex items-center justify-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <ClearIcon />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/my-list')}
            aria-label="My List - Bookmarked Series"
            title="My List"
            className="size-11 rounded-xl bg-white border border-[#1f2156] flex items-center justify-center text-[#1f2156] hover:bg-[#336ef90d] hover:border-[#336ef9] active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <BookmarkIcon />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`rounded-xl px-4 py-2 text-xs font-medium border-none active:scale-95 transition-all duration-150 cursor-pointer shrink-0 ${selectedCategory === 'all'
                ? 'bg-[#1f2156] text-white shadow-xs'
                : 'bg-zinc-100 text-black/70 hover:bg-zinc-200'
              }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.category_id}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap border-none active:scale-95 transition-all duration-150 cursor-pointer shrink-0 ${isSelected
                    ? 'bg-[#1f2156] text-white shadow-xs'
                    : 'bg-zinc-100 text-black/70 hover:bg-zinc-200'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2. Content Display (Filtered Grid or Rails) ───────────────────── */}
      <div className="px-5 pt-4 pb-8 flex flex-col gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-gray-placeholder text-sm">Loading journeys...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <h3 className="text-black text-lg font-semibold mb-1">{loadError}</h3>
            <button
              type="button"
              onClick={() => void retry()}
              className="mt-4 px-5 py-2.5 bg-[#1f2156] hover:bg-[#2c2f6d] text-white text-sm font-medium rounded-xl shadow-xs active:scale-95 transition-all duration-150 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : isFiltering ? (
          /* Filter / Search Results State */
          filteredSeries.length === 0 ? (
            /* No Results Found State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="size-14 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                <SearchIcon />
              </div>
              <h3 className="text-black text-lg font-semibold mb-1">
                No results found
              </h3>
              <p className="text-gray-placeholder text-sm max-w-sm mb-5 leading-relaxed">
                {searchQuery
                  ? `We couldn't find any published journeys matching "${searchQuery}".`
                  : 'No published journeys found in this category.'}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#1f2156] hover:bg-[#2c2f6d] text-white text-sm font-medium rounded-xl shadow-xs active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Filtered Grid View */
            <div className="flex flex-col w-full gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-gray-900 text-lg font-semibold">
                  {searchQuery ? `Results for "${searchQuery}"` : 'Journeys'}
                </h2>
                <span className="text-xs sm:text-sm text-gray-placeholder">
                  {filteredSeries.length} {filteredSeries.length === 1 ? 'journey' : 'journeys'}
                </span>
              </div>
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5 items-stretch">
                {filteredSeries.map((series) => (
                  <ContentItemCard
                    key={series.series_id}
                    series={series}
                    onViewSeries={(id) => navigate(`/content/${id}`)}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )
        ) : filteredSeries.length === 0 ? (
          /* Nothing published for this church yet */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="size-14 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <SearchIcon />
            </div>
            <h3 className="text-black text-lg font-semibold mb-1">No journeys yet</h3>
            <p className="text-gray-placeholder text-sm max-w-sm leading-relaxed">
              Your church has not published any journeys yet. Check back soon.
            </p>
          </div>
        ) : (
          /* Standard Rails Default View */
          <>
            {/* Most Watched from Church */}
            <ContentSectionRail
              title="Most Watched from Church"
              seriesList={mostWatchedRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />

            {/* Continue Watching (automatically hides when empty) */}
            {continueRail && continueRail.length > 0 && (
              <ContentSectionRail
                title="Continue Watching"
                seriesList={continueRail}
                onViewSeries={(id) => navigate(`/content/${id}`)}
                showProgress={true}
              />
            )}

            {/* Because You Watched */}
            <ContentSectionRail
              title="Because You Watched"
              seriesList={becauseYouWatchedRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />

            {/* Sunday Service */}
            <ContentSectionRail
              title="Sunday Service"
              seriesList={sundayServiceRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />

            {/* Devotional */}
            <ContentSectionRail
              title="Devotional"
              seriesList={devotionalRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />

            {/* Bible Study */}
            <ContentSectionRail
              title="Bible Study"
              seriesList={bibleStudyRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />

            {/* General */}
            <ContentSectionRail
              title="General"
              seriesList={generalRail}
              onViewSeries={(id) => navigate(`/content/${id}`)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ContentCatalogView;