import React from 'react';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { usePrayerHistoryViewModel } from '../viewmodels/PrayerHistoryViewModel';

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

const EyeIcon = () => (
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
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const PrayerHistoryView: React.FC = () => {
  const {
    prayers,
    historyFilter,
    setHistoryFilter,
    goBack,
    navigateToTab,
  } = usePrayerHistoryViewModel();

  return (
    <main className="min-h-dvh w-full bg-off-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[448px] flex-col border-x border-black/10 bg-white shadow-[0_0_24px_rgba(27,50,82,0.1)]">
        <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center gap-3 border-b border-gray-border/60 bg-white/95 px-4 backdrop-blur">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to prayer wall"
            className="flex size-9 items-center justify-center rounded-lg bg-navy text-white transition hover:bg-navy-hover active:scale-95"
          >
            <BackIcon />
          </button>
          <h1 className="text-[17px] font-bold tracking-[-0.02em] text-navy">
            Post History
          </h1>
        </header>

        <section className="flex-1 px-5 pb-8 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#129e9a]">
            Prayer Wall
          </p>
          <h2 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-navy">
            Prayer History
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-gray-placeholder">
            Prayers you have viewed will appear here.
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#eef1f5] p-1">
            <button
              type="button"
              onClick={() => setHistoryFilter('others')}
              className={`rounded-lg px-3 py-2.5 text-[12px] font-bold transition ${
                historyFilter === 'others'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-gray-placeholder'
              }`}
            >
              Shared by Others
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('mine')}
              className={`rounded-lg px-3 py-2.5 text-[12px] font-bold transition ${
                historyFilter === 'mine'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-gray-placeholder'
              }`}
            >
              Shared by Me
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {prayers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-border bg-off-white px-5 py-10 text-center">
                <p className="text-[14px] font-bold text-navy">No posts yet</p>
                <p className="mt-1 text-[11px] text-gray-placeholder">
                  Prayer requests you share will appear here.
                </p>
              </div>
            )}
            {prayers.map((prayer) => (
              <article
                key={prayer.id}
                className="rounded-2xl p-4 text-white shadow-[0_10px_24px_rgba(27,50,82,0.16)]"
                style={{ backgroundColor: prayer.accentColor }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-white/85" />
                    <div>
                      <p className="text-[12px] font-bold">{prayer.author}</p>
                      <p className="text-[9px] text-white/65">{prayer.timeAgo}</p>
                    </div>
                  </div>
                  <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <EyeIcon />
                  </span>
                </div>
                <p className="mt-5 text-center text-[17px] font-black leading-[1.45] tracking-[-0.025em]">
                  {prayer.frontMessage}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 z-20 mt-auto">
          <BottomNavBar activeTab="prayer-wall" onTabChange={navigateToTab} />
        </div>
      </div>
    </main>
  );
};

export default PrayerHistoryView;
