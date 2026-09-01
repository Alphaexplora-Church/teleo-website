// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentDetailViewModel } from '../viewModels/useContentDetailViewModel';

// ── Icons ────────────────────────────────────────────────────────────────────

const BackArrowIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const BookmarkIcon: React.FC<{ isSaved?: boolean }> = ({ isSaved }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={isSaved ? '#1f2156' : 'none'}
    stroke="#1f2156"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const ReadIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const SortIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M6 12h12M10 18h4" />
  </svg>
);

export const ContentDetailView: React.FC = () => {
  const { id, seriesId } = useParams<{ id?: string; seriesId?: string }>();
  const navigate = useNavigate();
  const effectiveId = id || seriesId;
  const {
    detail,
    loading,
    activeTab,
    hasProgress,
    completedCount,
    totalCount,
    nextIncompletePartOrder,
    churchName,
    previewSnippet,
    relatedSeries,
    sortOrder,
    sortedParts,
    handleToggleSortOrder,
    handleTabChange,
    handleToggleBookmark,
    handleSelectPart,
    handlePrimaryReadAction,
  } = useContentDetailViewModel(effectiveId);

  if (loading || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-black/60 font-medium">Loading series details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24">
      {/* ── Top Navigation Bar (Sticky) ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-5 py-3 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => navigate('/content')}
          className="size-9 rounded-full bg-zinc-100 flex items-center justify-center text-[#1f2156] hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer border-none"
          aria-label="Back to content"
        >
          <BackArrowIcon />
        </button>
        <span className="text-xs font-semibold text-[#1f2156] uppercase tracking-wider">
          {detail.content_type.replace('_', ' ')}
        </span>
        <button
          type="button"
          onClick={handleToggleBookmark}
          className="size-9 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer border-none"
          aria-label={detail.is_bookmarked ? 'Remove bookmark' : 'Save bookmark'}
        >
          <BookmarkIcon isSaved={detail.is_bookmarked} />
        </button>
      </header>

      <main className="w-full flex flex-col items-center">
        {/* ── Top Hero & Details ─────────────────────────────────────────── */}
        <div className="w-full max-w-xl px-5 pt-6 flex flex-col items-center">
          {/* ── 1. Wattpad-style Hero: Vertical Book Cover ──────────────────── */}
          <div className="relative w-40 sm:w-44 aspect-2/3 rounded-2xl bg-zinc-200 shadow-[0_12px_24px_rgba(31,33,86,0.18)] border border-zinc-200 overflow-hidden shrink-0">
            {detail.thumbnail_url ? (
              <img
                src={detail.thumbnail_url}
                alt={detail.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-b from-[#1f2156] to-[#2c2f6d]" />
            )}
          </div>

          {/* ── 2. Meta: Title, Publishing Church, Categories ────────────────── */}
          <div className="flex flex-col items-center text-center mt-5 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight tracking-tight">
              {detail.title}
            </h1>

            <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-[#336ef9]">
              <span>{churchName || 'Affiliated Church'}</span>
            </div>

            {/* ── Progress Indicator ────────────────────────────────────────── */}
            {hasProgress && detail.percent_complete !== undefined && (
              <div className="w-full mt-3 flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#1f2156]">
                    {completedCount} of {totalCount} chapters completed
                  </span>
                  <span className="text-[#336ef9]">{Math.round(detail.percent_complete)}%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#336ef9] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, detail.percent_complete))}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── 3. Primary CTA: Read (Full Width with smaller height) ──────── */}
            <div className="w-full mt-5">
              <button
                type="button"
                onClick={handlePrimaryReadAction}
                className="w-full h-10 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] transition-all duration-200 rounded-xl flex items-center justify-center gap-2 text-white font-medium text-sm shadow-sm cursor-pointer border-none"
              >
                <ReadIcon />
                <span>
                  {hasProgress
                    ? nextIncompletePartOrder
                      ? `Continue Reading: Chapter ${nextIncompletePartOrder}`
                      : 'Continue Reading'
                    : 'Start Reading'}
                </span>
              </button>
            </div>

            {/* Synopsis */}
            <p className="mt-5 text-sm text-black/75 leading-relaxed text-left sm:text-center w-full">
              {detail.description || detail.summary}
            </p>

            {/* Categories */}
            {detail.categories && detail.categories.length > 0 && (
              <p className="mt-2 text-xs text-gray-placeholder text-left sm:text-center w-full">
                <span className="font-medium text-black/70">Categories:</span>{' '}
                {detail.categories.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* ── 4. Dynamic Tabs Section (Chapters / More on this / Preview) ─── */}
        <section className="w-full max-w-xl mt-2 bg-white overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-zinc-200 bg-white px-2 sm:px-4">
            <button
              type="button"
              onClick={() => handleTabChange('chapters')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${activeTab === 'chapters'
                ? 'border-[#1f2156] text-[#1f2156]'
                : 'border-transparent text-gray-placeholder hover:text-black'
                }`}
            >
              Chapters
            </button>

            {!hasProgress && (
              <button
                type="button"
                onClick={() => handleTabChange('preview')}
                className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${activeTab === 'preview'
                  ? 'border-[#1f2156] text-[#1f2156]'
                  : 'border-transparent text-gray-placeholder hover:text-black'
                  }`}
              >
                Preview
              </button>
            )}

            <button
              type="button"
              onClick={() => handleTabChange('more')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${activeTab === 'more'
                ? 'border-[#1f2156] text-[#1f2156]'
                : 'border-transparent text-gray-placeholder hover:text-black'
                }`}
            >
              More on this
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="px-2 sm:px-4">
            {/* Tab: Chapters */}
            {activeTab === 'chapters' && (
              <div className="flex flex-col">
                {/* Chapters subheader with count & sort filter */}
                <div className="flex items-center justify-between py-1 px-2 text-xs">
                  <span className="font-semibold text-black">
                    {detail.parts.length} {detail.parts.length === 1 ? 'Chapter' : 'Chapters'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSortOrder}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-placeholder hover:text-black transition-colors bg-transparent border-none cursor-pointer p-0"
                    aria-label={`Sort chapters: ${sortOrder === 'asc' ? 'Oldest' : 'Newest'}`}
                  >
                    <span>{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
                    <SortIcon />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 py-1">
                  {sortedParts.map((part) => {
                    const timeLabel = part.estimated_read_time_minutes
                      ? `${part.estimated_read_time_minutes} min read`
                      : part.media_duration_seconds
                        ? `${Math.round(part.media_duration_seconds / 60)} min`
                        : null;

                    const isNextUp =
                      !part.is_completed && nextIncompletePartOrder === part.part_order;

                    return (
                      <div
                        key={part.part_id}
                        onClick={() => handleSelectPart(part.part_id)}
                        className={`py-3 flex items-center justify-between gap-3 rounded-xl px-2.5 transition-all cursor-pointer ${part.is_completed
                          ? 'opacity-60 bg-zinc-50/60 hover:opacity-80 hover:bg-zinc-100/70'
                          : isNextUp
                            ? 'bg-[#336ef9]/8 border border-[#336ef9]/25 shadow-2xs hover:bg-[#336ef9]/12'
                            : 'hover:bg-zinc-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${part.is_completed
                              ? 'bg-emerald-50 text-emerald-600'
                              : isNextUp
                                ? 'bg-[#1f2156] text-white shadow-xs'
                                : 'bg-zinc-100 text-[#1f2156]'
                              }`}
                          >
                            {part.part_order}
                          </div>
                          <div className="flex flex-col text-left">
                            <h4
                              className={`text-sm leading-snug ${part.is_completed
                                ? 'font-medium text-zinc-500'
                                : isNextUp
                                  ? 'font-bold text-[#1f2156]'
                                  : 'font-semibold text-black'
                                }`}
                            >
                              {part.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-placeholder mt-0.5">
                              {part.published_at && <span>{part.published_at}</span>}
                              {timeLabel && (
                                <span>{part.published_at ? `• ${timeLabel}` : timeLabel}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          {part.is_completed ? (
                            <span className="text-xs font-medium text-emerald-600 select-none">
                              Done
                            </span>
                          ) : isNextUp ? (
                            <span className="px-2.5 py-0.5 border border-[#1f2156] text-[#1f2156] text-[11px] font-semibold rounded-full hover:bg-[#1f2156]/5 transition-colors whitespace-nowrap select-none">
                              Read
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-black/50 hover:text-black transition-colors select-none">
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Preview (Only available when hasProgress === false) */}
            {activeTab === 'preview' && (
              <div className="flex flex-col gap-3 text-left">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1f2156] mb-2">
                    Chapter 1 Sneak Peek
                  </h4>
                  <p className="text-xs sm:text-sm text-black/80 leading-relaxed italic">
                    "{previewSnippet || detail.summary || 'Start reading this series to explore its complete devotionals and scripture teachings.'}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrimaryReadAction}
                  className="w-full py-2.5 bg-[#1f2156] text-white rounded-xl text-xs font-semibold hover:bg-[#2c2f6d] transition-all cursor-pointer border-none mt-1"
                >
                  Unlock & Begin Full Track
                </button>
              </div>
            )}

            {/* Tab: More on this */}
            {activeTab === 'more' && (
              <div className="flex flex-col gap-3 text-left">
                {relatedSeries && relatedSeries.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {relatedSeries.map((item) => (
                      <div
                        key={item.series_id}
                        onClick={() => navigate(`/content/${item.series_id}`)}
                        className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 rounded-md bg-zinc-200 overflow-hidden shrink-0">
                            {item.thumbnail_url && (
                              <img
                                src={item.thumbnail_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-black line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-placeholder uppercase mt-0.5">
                              {item.content_type.replace('_', ' ')} • {item.total_parts} Parts
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#336ef9]">View →</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-xs text-gray-placeholder">
                    No other series in this category yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentDetailView;