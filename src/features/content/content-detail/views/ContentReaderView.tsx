// View Layer — dumb UI only. Calls the ViewModel hook and renders.
// NO useState, NO useEffect, NO API calls allowed in this file.

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentReaderViewModel } from '../viewModels/useContentReaderViewModel';
import { toMediaEmbed } from '../models/contentReaderApi';

// ── Icons ────────────────────────────────────────────────────────────────────

const BackIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const BookClockIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ContentReaderView: React.FC = () => {
  const { seriesId, partId } = useParams<{ seriesId: string; partId: string }>();
  const navigate = useNavigate();

  const {
    chapter,
    error,
    readProgress,
    contentContainerRef,
  } = useContentReaderViewModel(seriesId, partId);

  const embed = toMediaEmbed(chapter?.media_url, chapter?.last_media_timestamp_seconds || 0);

  return (
    <div className="w-full min-h-screen bg-[#faf9f7] text-[#1c1c1e] font-sans antialiased selection:bg-[#336ef91a]">
      {/* ── 1. Top Reading Bar (Wattpad Style with Progress Tracker) ───────── */}
      <header className="sticky top-0 z-30 bg-[#faf9f7]/95 backdrop-blur-md border-b border-zinc-200/80 px-4 py-2.5 flex items-center justify-between transition-all">
        <button
          type="button"
          onClick={() => navigate(`/content/${seriesId}`, { replace: true })}
          className="size-9 rounded-full bg-zinc-100/80 flex items-center justify-center text-[#1f2156] hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer border-none"
          aria-label="Back to series details"
        >
          <BackIcon />
        </button>

        <div className="flex flex-col items-center max-w-[60%] text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-placeholder truncate w-full">
            {chapter?.series_title ?? ' '}
          </span>
          <span className="text-xs font-semibold text-black truncate w-full">
            {chapter ? `Part ${chapter.part_order} of ${chapter.total_parts}` : ' '}
          </span>
        </div>

        <div className="size-9" />

        {/* Global Reading Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-200/60">
          <div
            className="h-full bg-[#336ef9] transition-all duration-150"
            style={{ width: `${readProgress}%` }}
          />
        </div>
      </header>

      {/* ── 2. Editorial Content Layout ──────────────────────────────────── */}
      <main
        ref={contentContainerRef}
        className="w-full max-w-2xl mx-auto px-6 sm:px-8 pt-8 pb-10 flex flex-col"
      >
        {error ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-sm text-black/70 font-medium">{error}</p>
            <button
              type="button"
              onClick={() => navigate(`/content/${seriesId}`, { replace: true })}
              className="px-5 py-2.5 bg-[#1f2156] hover:bg-[#2c2f6d] text-white text-sm font-medium rounded-xl active:scale-95 transition-all duration-150 cursor-pointer border-none"
            >
              Back to the journey
            </button>
          </div>
        ) : !chapter ? (
          /* Skeleton in place, so the page frame never swaps out under the reader */
          <div className="flex flex-col items-center gap-4 pb-8 animate-pulse" aria-busy="true" aria-label="Opening chapter">
            <div className="h-3 w-20 rounded bg-zinc-200" />
            <div className="h-7 w-3/4 rounded bg-zinc-200" />
            <div className="h-3 w-32 rounded bg-zinc-200" />
            <div className="mt-6 w-full aspect-video rounded-2xl bg-zinc-200" />
            <div className="mt-4 w-full flex flex-col gap-3">
              <div className="h-3.5 w-full rounded bg-zinc-200" />
              <div className="h-3.5 w-11/12 rounded bg-zinc-200" />
              <div className="h-3.5 w-full rounded bg-zinc-200" />
              <div className="h-3.5 w-4/5 rounded bg-zinc-200" />
            </div>
          </div>
        ) : (
          <>
        {/* Chapter Title & Meta Header */}
        <header className="flex flex-col items-center text-center pb-8 border-b border-zinc-200/60">
          <span className="text-xs font-bold uppercase tracking-widest text-[#336ef9] mb-1.5">
            Chapter {chapter.part_order}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-snug">
            {chapter.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-gray-placeholder mt-3">
            {chapter.church_name && <span>{chapter.church_name}</span>}
            {chapter.estimated_read_time_minutes && (
              <span className="inline-flex items-center gap-1">
                <BookClockIcon />
                {chapter.estimated_read_time_minutes} min read
              </span>
            )}
          </div>
        </header>

        {/* ── 3. Embedded Media Section (Video/Audio Player) ────────────────── */}
        {embed?.kind === 'iframe' && (
          <section
            aria-label="Chapter Media"
            className="my-8 w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-zinc-200"
          >
            <iframe
              src={embed.src}
              title={chapter.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </section>
        )}

        {embed?.kind === 'audio' && (
          <section aria-label="Chapter Media" className="my-8 w-full">
            <audio src={embed.src} controls className="w-full" />
          </section>
        )}

        {embed?.kind === 'link' && (
          <section aria-label="Chapter Media" className="my-8 w-full">
            <a
              href={embed.src}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-semibold text-[#1f2156] hover:bg-zinc-50 transition-colors"
            >
              Open media in a new tab
            </a>
          </section>
        )}

        {/* ── 4. Wattpad-style Typography Reading Canvas ──────────────────── */}
        {chapter.reading_text && (
          <article className="prose prose-zinc max-w-none text-black/90 font-serif leading-[1.8] text-[17px] sm:text-[18px] tracking-normal space-y-6">
            {chapter.reading_text.split('\n\n').map((paragraph, index) => {
              // Basic Markdown headers & quote styling
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="font-sans font-bold text-xl text-black">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={index} className="font-sans font-semibold text-lg text-black pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-[#1f2156] pl-4 py-1 text-black/80 italic my-4 font-serif bg-[#336ef908] rounded-r-lg"
                  >
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-justify sm:text-left">
                  {paragraph}
                </p>
              );
            })}
          </article>
        )}

        {/* ── 5. Navigation Actions ────────────────────────────────────────── */}
        <section className="mt-12 pt-8 border-t border-zinc-200/80 flex flex-col items-center w-full">
          <div className="flex items-center gap-3 w-full max-w-md">
            {chapter.previous_part_id ? (
              <button
                type="button"
                onClick={() => navigate(`/content/${chapter.series_id}/part/${chapter.previous_part_id}`)}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-semibold rounded-xl transition-all cursor-pointer border-none"
              >
                ← Previous
              </button>
            ) : null}

            {chapter.next_part_id ? (
              <button
                type="button"
                onClick={() => navigate(`/content/${chapter.series_id}/part/${chapter.next_part_id}`)}
                className="flex-1 py-3 bg-[#1f2156] hover:bg-[#2c2f6d] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer border-none"
              >
                Next Chapter →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate(`/content/${chapter.series_id}`)}
                className="flex-1 py-3 bg-[#1f2156] hover:bg-[#2c2f6d] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer border-none"
              >
                Complete Series
              </button>
            )}
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ContentReaderView;
