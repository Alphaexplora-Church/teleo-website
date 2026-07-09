import React from 'react';
import { Link } from 'react-router-dom';
import { usePrayerWallViewModel } from '../viewmodels/PrayerWallViewModel';
import { PRAYER_STACK_STYLES } from '../models/Prayer';

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
    <path d="M18 11V6a2 2 0 0 0-4 0" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M6 14a6 6 0 0 0 12 0v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2Z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="16"
    height="16"
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

const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const RefreshIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
  </svg>
);

interface EmptyPrayerWallProps {
  onRefresh: () => void;
}

const EmptyPrayerWall: React.FC<EmptyPrayerWallProps> = ({ onRefresh }) => (
  <section
    aria-label="All prayers viewed"
    className="fixed inset-0 z-10 min-h-dvh w-full overflow-hidden bg-[#faf9f7]"
  >
    <div className="relative mx-auto flex h-dvh min-h-[540px] w-full max-w-[448px] items-center justify-center overflow-hidden border-x border-black/10 bg-white px-6 shadow-[0_0_24px_rgba(27,50,82,0.1)]">
      <div className="w-full max-w-[320px] -translate-y-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center text-[#253aa6]">
          <RefreshIcon size={52} />
        </div>
        <h2 className="mt-4 text-[20px] font-black tracking-[-0.035em] text-navy">
          You&apos;ve seen all prayers
        </h2>
        <p className="mx-auto mt-2 max-w-[270px] text-[12px] leading-[1.55] text-gray-placeholder">
          Check back later or refresh to see if there are new prayer requests.
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#252f91] px-5 py-3 text-[13px] font-bold text-white shadow-btn transition hover:bg-[#1d267d] active:scale-[0.98]"
        >
          <RefreshIcon />
          Refresh Prayer Wall
        </button>
      </div>
    </div>
  </section>
);

interface CardActionsProps {
  prayerId: string;
  liked: boolean;
  prayed: boolean;
  isPrayerMenuOpen: boolean;
  prayerResponses: readonly string[];
  selectedPrayerResponse: string | null;
  onLike: () => void;
  onPray: () => void;
  onSelectPrayerResponse: (response: string) => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  prayerId,
  liked,
  prayed,
  isPrayerMenuOpen,
  prayerResponses,
  selectedPrayerResponse,
  onLike,
  onPray,
  onSelectPrayerResponse,
  onPointerDown,
}) => (
  <div className="flex w-full items-center justify-between gap-3">
    <button
      type="button"
      aria-label={liked ? 'Unlike prayer request' : 'Like prayer request'}
      aria-pressed={liked}
      onPointerDown={onPointerDown}
      onClick={onLike}
      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition duration-200 active:scale-90 ${
        liked ? 'text-[#e33686]' : 'text-[#9aa9bb]'
      }`}
    >
      <HeartIcon />
    </button>

    <div className="relative min-w-0 flex-1">
      {isPrayerMenuOpen && (
        <div
          role="menu"
          aria-label="Choose a prayer response"
          className="absolute bottom-[calc(100%+10px)] left-1/2 z-30 w-[min(240px,72vw)] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-border/80 bg-white py-1.5 text-left text-navy shadow-[0_16px_36px_rgba(12,25,48,0.28)]"
        >
          <p className="border-b border-gray-border/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-placeholder">
            Choose a prayer response
          </p>
          {prayerResponses.map((response) => (
            <button
              key={response}
              type="button"
              role="menuitem"
              onPointerDown={onPointerDown}
              onClick={() => onSelectPrayerResponse(response)}
              className={`block w-full px-3 py-2.5 text-left text-[11px] leading-4 transition hover:bg-navy/6 ${
                selectedPrayerResponse === response
                  ? 'bg-navy text-white hover:bg-navy'
                  : 'text-gray-label'
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-pressed={prayed}
        aria-expanded={isPrayerMenuOpen}
        aria-haspopup="menu"
        onPointerDown={onPointerDown}
        onClick={onPray}
        className={`flex w-full min-w-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition duration-200 active:scale-[0.97] ${
          prayed
            ? 'bg-white text-[#1e3a5f]'
            : 'bg-white/28 text-white hover:bg-white/35'
        }`}
      >
        <PrayIcon />
        {prayed ? 'Prayed' : 'Pray'}
      </button>
    </div>

    <Link
      to={`/prayer/${prayerId}`}
      aria-label="View prayer comments"
      onPointerDown={onPointerDown}
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#9aa9bb] shadow-sm transition duration-200 active:scale-90"
    >
      <CommentIcon />
    </Link>
  </div>
);

const PrayerWallView: React.FC = () => {
  const viewModel = usePrayerWallViewModel();
  const {
    topCard,
    cardsBehind,
    dragOffsetX,
    isDragging,
    isFlipped,
    isLiked,
    isPrayed,
    isPrayerMenuOpen,
    prayerResponses,
    selectedPrayerResponse,
    handleActionPointerDown,
    handleCardKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    toggleLike,
    togglePray,
    selectPrayerResponse,
    refreshPrayers,
  } = viewModel;

  const cardActions = {
    prayerId: topCard?.id ?? '',
    liked: isLiked,
    prayed: isPrayed,
    isPrayerMenuOpen,
    prayerResponses,
    selectedPrayerResponse,
    onLike: toggleLike,
    onPray: togglePray,
    onSelectPrayerResponse: selectPrayerResponse,
    onPointerDown: handleActionPointerDown,
  };

  if (!topCard) {
    return <EmptyPrayerWall onRefresh={refreshPrayers} />;
  }

  return (
    <section
      aria-label="Community prayer requests"
      className="fixed inset-0 z-10 min-h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#faf8f6_55%,#f2eeea_100%)]"
    >
      <div className="relative mx-auto h-dvh min-h-[540px] w-full max-w-[448px] overflow-hidden border-x border-black/10 shadow-[0_0_24px_rgba(27,50,82,0.1)]">
        <div className="pointer-events-none absolute left-1/2 top-[47%] h-[clamp(390px,60vh,456px)] w-[clamp(276px,78vw,326px)] -translate-x-1/2 -translate-y-1/2">
          {cardsBehind.map((card, index) => {
            const stackStyle = PRAYER_STACK_STYLES[index];

            return (
              <div
                key={card.id}
                className="absolute inset-0 rounded-[24px] shadow-[0_14px_35px_rgba(30,58,95,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  backgroundColor: card.accentColor,
                  transform: `translate(${stackStyle.offsetX}px, ${stackStyle.offsetY}px) rotate(${stackStyle.rotation}deg) scale(${stackStyle.scale})`,
                  zIndex: cardsBehind.length - index,
                }}
              />
            );
          })}
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label={`${topCard.author}'s prayer request. Click to flip, or swipe left or right for the next request.`}
          className={`absolute left-1/2 top-[47%] z-10 h-[clamp(390px,60vh,456px)] w-[clamp(276px,78vw,326px)] -translate-x-1/2 -translate-y-1/2 touch-none select-none outline-none [perspective:1300px] focus-visible:ring-4 focus-visible:ring-[#2e69ff]/30 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onKeyDown={handleCardKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className={`h-full w-full ${
              isDragging
                ? ''
                : 'transition-transform duration-[260ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]'
            }`}
            style={{
              transform: `translateX(${dragOffsetX}px) rotate(${dragOffsetX / 18}deg)`,
            }}
          >
            <div
              className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <article
                className="absolute inset-0 flex flex-col rounded-[24px] px-5 pb-6 pt-5 text-white shadow-[0_22px_50px_rgba(22,46,76,0.3)] transition-colors duration-300 sm:px-6"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: topCard.accentColor,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-full bg-[#dfe7f1] ring-4 ring-white/5" />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold leading-tight">
                      {topCard.author}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/60">{topCard.timeAgo}</p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center px-2 py-5 text-center">
                  <p className="max-w-[260px] text-[clamp(22px,6.4vw,28px)] font-black leading-[1.42] tracking-[-0.035em]">
                    {topCard.frontMessage}
                  </p>
                </div>

                <CardActions {...cardActions} />
              </article>

              <article
                className="absolute inset-0 flex flex-col rounded-[24px] px-5 pb-6 pt-5 text-white shadow-[0_22px_50px_rgba(22,46,76,0.3)] transition-colors duration-300 sm:px-6"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: `linear-gradient(rgba(8, 18, 32, 0.18), rgba(8, 18, 32, 0.18)), ${topCard.accentColor}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-full bg-[#dfe7f1] ring-4 ring-white/5" />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold leading-tight">
                      {topCard.author}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/60">Prayer details</p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-5 text-center">
                  <p className="mb-4 text-[23px] font-black leading-tight tracking-[-0.025em]">
                    {topCard.backTitle}
                  </p>
                  <p className="max-w-[260px] text-[14px] leading-6 text-white/78">
                    {topCard.backDetails}
                  </p>
                </div>

                <CardActions {...cardActions} />
              </article>
            </div>
          </div>
        </div>

        <Link
          to="/prayer-request"
          aria-label="Add prayer request"
          className="absolute bottom-20 right-5 z-20 flex size-14 items-center justify-center rounded-full bg-[#171f5e] text-white shadow-[0_14px_28px_rgba(23,31,94,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#202c78] active:scale-95"
        >
          <PlusIcon />
        </Link>
      </div>
    </section>
  );
};

export default PrayerWallView;
