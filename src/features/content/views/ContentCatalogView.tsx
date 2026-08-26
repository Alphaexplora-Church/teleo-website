// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentCatalogViewModel } from '../viewModels/useContentCatalogViewModel';
import { ContentSectionRail } from '../../../shared/components/Cards/ContentSectionRail';

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
);

export const ContentCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    mostWatchedRail,
    continueRail,
    becauseYouWatchedRail,
    sundayServiceRail,
    devotionalRail,
    bibleStudyRail,
    generalRail,
  } = useContentCatalogViewModel();

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* ── 1. Search & Category Chips Header (TO DO: Scrum 29) ───────────── */}
      <section aria-label="Search and Categories" className="px-5 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 w-full">
          <div className="relative flex-1 opacity-60">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search series, topics, devotionals..."
              disabled
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-zinc-200 bg-zinc-100 text-sm text-black placeholder:text-gray-placeholder cursor-not-allowed select-none"
            />
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

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 opacity-60">
          <button
            type="button"
            disabled
            className="rounded-xl px-4 py-2 text-xs font-medium bg-[#1f2156] text-white border-none cursor-not-allowed select-none shrink-0"
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              type="button"
              disabled
              className="rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap bg-zinc-100 text-black/70 border-none cursor-not-allowed select-none shrink-0"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ── 2. Content Rails ──────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-8 flex flex-col gap-6">
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
      </div>
    </div>
  );
};

export default ContentCatalogView;