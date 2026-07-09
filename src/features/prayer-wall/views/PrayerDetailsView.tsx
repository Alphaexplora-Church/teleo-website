import React from 'react';
import { usePrayerDetailsViewModel } from '../viewmodels/PrayerDetailsViewModel';
import BottomNavBar from '../../../shared/components/BottomNavBar';

const BackIcon = () => (
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
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09A6.02 6.02 0 0 1 16.5 3 5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
  </svg>
);

const PrayIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M6 14a6 6 0 0 0 12 0v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2Z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

const PrayerDetailsView: React.FC = () => {
  const { prayer, goBack, navigateToTab } = usePrayerDetailsViewModel();

  if (!prayer) {
    return (
      <section className="flex min-h-dvh items-center justify-center bg-off-white px-5">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-placeholder">
            Prayer request not found.
          </p>
          <button
            type="button"
            onClick={goBack}
            className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  const comments = prayer.comments ?? [];

  return (
    <main className="min-h-dvh w-full bg-off-white">
      <div
        className="mx-auto flex min-h-dvh w-full max-w-[448px] flex-col overflow-hidden border-x border-black/10 text-white shadow-[0_0_24px_rgba(27,50,82,0.1)]"
        style={{ backgroundColor: prayer.accentColor }}
      >
        <header className="flex h-[66px] shrink-0 items-center gap-3 border-b border-white/16 px-4">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to prayer wall"
            className="flex size-9 items-center justify-center rounded-lg bg-black/20 text-white transition hover:bg-black/30 active:scale-95"
          >
            <BackIcon />
          </button>
          <h1 className="text-[17px] font-semibold">Prayer Request</h1>
        </header>

        <article className="px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 shrink-0 rounded-full bg-[#dfe7f1]" />
              <div>
                <p className="text-[14px] font-bold leading-tight">{prayer.author}</p>
                <p className="mt-0.5 text-[10px] text-white/60">{prayer.timeAgo}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {(prayer.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-semibold text-gray-label"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h2 className="mt-7 max-w-[330px] text-[22px] font-black leading-[1.3] tracking-[-0.035em]">
            {prayer.frontMessage}
          </h2>
          <p className="mt-6 text-[13px] leading-[1.6] text-white/82">
            {prayer.backDetails}
          </p>
        </article>

        <div className="grid grid-cols-[1fr_1.4fr] border-y border-white/22">
          <div className="flex items-center gap-2 border-r border-white/22 px-5 py-3 text-[13px] font-semibold">
            <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#9aa9bb]">
              <HeartIcon />
            </span>
            {prayer.prayerCount ?? 0}
          </div>
          <button
            type="button"
            className="m-2 flex items-center justify-center gap-2 rounded-full bg-white/35 px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-white/45 active:scale-[0.98]"
          >
            <PrayIcon />
            Pray
          </button>
        </div>

        <section aria-label="Prayer comments" className="flex-1 px-5 pb-8 pt-4">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold">
            <CommentIcon />
            Comments ({comments.length})
          </div>

          <div className="space-y-2.5">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-white/40 bg-white/90 px-3 py-2.5 text-gray-label shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold text-navy">{comment.author}</p>
                  <p className="text-[9px] text-gray-placeholder">{comment.timeAgo}</p>
                </div>
                <p className="mt-1 text-[11px] leading-4">{comment.message}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 z-20 mt-auto text-gray-label">
          <BottomNavBar activeTab="prayer-wall" onTabChange={navigateToTab} />
        </div>
      </div>
    </main>
  );
};

export default PrayerDetailsView;
