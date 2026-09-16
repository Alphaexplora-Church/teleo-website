import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { usePrayerHistoryViewModel } from '../viewModels/usePrayerHistoryViewModel';

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

const BookmarkIcon = ({ filled = false, size = 15 }: { filled?: boolean; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const PrayerHistoryView: React.FC = () => {
  const {
    prayers,
    historyFilter,
    isLoading,
    isLoadingMore,
    hasMore,
    errorMessage,
    setHistoryFilter,
    loadMorePrayers,
    removeBookmarkItem,
    goBack,
    navigateToTab,
  } = usePrayerHistoryViewModel();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMorePrayers();
        }
      },
      { rootMargin: '180px' },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, loadMorePrayers]);

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
            {historyFilter === 'bookmarks' ? 'Saved Bookmarks' : 'Post History'}
          </h1>
        </header>

        <section className="flex-1 px-5 pb-8 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#129e9a]">
            Prayer Wall
          </p>
          <h2 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-navy">
            {historyFilter === 'bookmarks' ? 'Saved Prayers' : 'Prayer History'}
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-gray-placeholder">
            {historyFilter === 'bookmarks'
              ? 'Prayers you have bookmarked for intercession and prayer.'
              : 'Prayers you have shared or viewed will appear here.'}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-[#eef1f5] p-1">
            <button
              type="button"
              onClick={() => setHistoryFilter('others')}
              className={`rounded-lg px-2 py-2.5 text-[11px] font-bold transition text-center ${
                historyFilter === 'others'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-gray-placeholder hover:text-navy'
              }`}
            >
              Others
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('mine')}
              className={`rounded-lg px-2 py-2.5 text-[11px] font-bold transition text-center ${
                historyFilter === 'mine'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-gray-placeholder hover:text-navy'
              }`}
            >
              My Posts
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('bookmarks')}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-bold transition text-center ${
                historyFilter === 'bookmarks'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-gray-placeholder hover:text-navy'
              }`}
            >
              <BookmarkIcon size={13} filled={historyFilter === 'bookmarks'} />
              <span>Saved</span>
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading && (
              <div className="rounded-2xl border border-gray-border bg-off-white px-5 py-10 text-center">
                <p className="text-[14px] font-bold text-navy">
                  {historyFilter === 'bookmarks' ? 'Loading saved prayers...' : 'Loading history...'}
                </p>
              </div>
            )}
            {errorMessage && !isLoading && (
              <div className="rounded-2xl border border-[#f1c2bc] bg-[#fff3f2] px-5 py-4 text-center">
                <p className="text-[12px] font-medium text-[#8b2d23]">{errorMessage}</p>
              </div>
            )}
            {!isLoading && !errorMessage && prayers.length === 0 && !hasMore && (
              <div className="rounded-2xl border border-dashed border-gray-border bg-off-white px-5 py-10 text-center">
                <p className="text-[14px] font-bold text-navy">
                  {historyFilter === 'bookmarks' ? 'No saved prayers yet' : 'No posts yet'}
                </p>
                <p className="mt-1 text-[11px] text-gray-placeholder">
                  {historyFilter === 'bookmarks'
                    ? 'Tap the bookmark icon on any prayer request to save it here for prayer.'
                    : historyFilter === 'mine'
                    ? 'Prayer requests you share will appear here.'
                    : 'No prayer requests shared by others found.'}
                </p>
              </div>
            )}
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="relative overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(27,50,82,0.16)] transition"
                style={{ backgroundColor: prayer.accentColor }}
              >
                <Link
                  to={`/prayer/${prayer.id}`}
                  className="block p-4 text-white active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-white/85" />
                      <div>
                        <p className="text-[12px] font-bold text-white">
                          {prayer.author ?? 'Teleo Member'}
                        </p>
                        <p className="text-[9px] text-white/65">{prayer.timeAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {historyFilter === 'bookmarks' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void removeBookmarkItem(prayer.id);
                          }}
                          aria-label="Remove from saved bookmarks"
                          title="Remove bookmark"
                          className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35 active:scale-95"
                        >
                          <BookmarkIcon size={14} filled />
                        </button>
                      ) : (
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white">
                          <EyeIcon />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-5 text-center text-[17px] font-black leading-[1.45] tracking-[-0.025em]">
                    {prayer.frontMessage}
                  </p>
                </Link>
              </div>
            ))}
            {hasMore && (
              <div ref={loadMoreRef} className="py-4 text-center">
                <p className="text-[11px] font-semibold text-gray-placeholder">
                  {isLoadingMore ? 'Loading more prayers...' : 'Loading more when you scroll'}
                </p>
              </div>
            )}
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
