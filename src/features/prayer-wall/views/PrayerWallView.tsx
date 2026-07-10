import React from 'react';
import { Link } from 'react-router-dom';
import { usePrayerWallViewModel } from '../viewmodels/PrayerWallViewModel';

const PRAYER_STACK_STYLES = [
  { rotation: -5.5, offsetX: -12, offsetY: 12, scale: 0.985 },
  { rotation: 4.5, offsetX: 15, offsetY: 6, scale: 0.972 },
  { rotation: -2.5, offsetX: -4, offsetY: -2, scale: 0.96 },
] as const;

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

const ChevronUpIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
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

const HistoryIcon = () => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5M12 7v5l3 2" />
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
  variant: 'empty' | 'end';
}

const EmptyPrayerWall: React.FC<EmptyPrayerWallProps> = ({ onRefresh, variant }) => (
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
          {variant === 'end' ? 'You are all caught up' : 'No prayer requests yet'}
        </h2>
        <p className="mx-auto mt-2 max-w-[270px] text-[12px] leading-[1.55] text-gray-placeholder">
          {variant === 'end'
            ? 'Refresh the Prayer Wall to check if new requests have been shared.'
            : 'Be the first to share a prayer request, or refresh to check for new posts.'}
        </p>
        {variant === 'empty' && (
          <Link
            to="/prayer-request"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#252f91] px-5 py-3 text-[13px] font-bold text-white shadow-btn transition hover:bg-[#1d267d] active:scale-[0.98]"
          >
            Request Prayer
          </Link>
        )}
        <button
          type="button"
          onClick={onRefresh}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-gray-border bg-white px-5 py-3 text-[13px] font-bold text-navy transition hover:bg-[#f5f6ff] active:scale-[0.98] ${
            variant === 'empty' ? 'mt-3' : 'mt-6'
          }`}
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
  showPrayerMenu: boolean;
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
  showPrayerMenu,
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
      {isPrayerMenuOpen && showPrayerMenu && (
        <div
          role="menu"
          aria-label="Choose a prayer response"
          className="absolute bottom-[calc(100%+8px)] left-1/2 z-40 w-[min(256px,74vw)] -translate-x-1/2 overflow-hidden rounded-[4px] border border-[#d3e2e1] bg-[#eef8f8] text-left text-[#385153] shadow-[0_14px_30px_rgba(12,25,48,0.22)]"
        >
          {prayerResponses.map((response) => {
            const isSelected = selectedPrayerResponse === response;

            return (
              <button
                key={response}
                type="button"
                role="menuitem"
                onPointerDown={onPointerDown}
                onClick={() => onSelectPrayerResponse(response)}
                className={`flex min-h-7 w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[11px] leading-4 transition ${
                  isSelected
                    ? 'bg-white text-[#2f484b]'
                    : 'text-[#5b6e70] hover:bg-white/70'
                }`}
              >
                <span className="truncate">{response}</span>
                {isSelected && <ChevronUpIcon />}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        aria-pressed={prayed}
        aria-expanded={isPrayerMenuOpen && showPrayerMenu}
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
        <span className="min-w-0 truncate">
          {selectedPrayerResponse ?? (prayed ? 'Prayed' : 'Pray')}
        </span>
        {selectedPrayerResponse && <ChevronUpIcon />}
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
    isLoading,
    isOutOfPosts,
    errorMessage,
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
    togglePrayerMenu,
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
    onPray: togglePrayerMenu,
    onSelectPrayerResponse: (response: string) => {
      void selectPrayerResponse(response);
    },
    onPointerDown: handleActionPointerDown,
  };

  if (isLoading) {
    return (
      <section className="fixed inset-0 z-10 flex min-h-dvh items-center justify-center bg-[#faf9f7]">
        <div className="text-center text-navy">
          <div className="mx-auto size-10 animate-spin rounded-full border-[3px] border-navy/15 border-t-navy" />
          <p className="mt-4 text-sm font-semibold">Loading prayer wall...</p>
        </div>
      </section>
    );
  }

  if (!topCard) {
    return (
      <EmptyPrayerWall
        onRefresh={refreshPrayers}
        variant={isOutOfPosts ? 'end' : 'empty'}
      />
    );
  }

  return (
    <section
      aria-label="Community prayer requests"
      className="fixed inset-0 z-10 min-h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#faf8f6_55%,#f2eeea_100%)]"
    >
      <div className="relative mx-auto h-dvh min-h-[540px] w-full max-w-[448px] overflow-hidden border-x border-black/10 shadow-[0_0_24px_rgba(27,50,82,0.1)]">
        <div className="pointer-events-none absolute left-1/2 top-[47%] h-[clamp(420px,64vh,500px)] w-[clamp(288px,86vw,360px)] -translate-x-1/2 -translate-y-1/2">
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
          aria-label="Prayer request. Click to flip, swipe left for older prayers, or swipe right for newer prayers."
          className={`absolute left-1/2 top-[47%] z-10 h-[clamp(420px,64vh,500px)] w-[clamp(288px,86vw,360px)] -translate-x-1/2 -translate-y-1/2 touch-none select-none outline-none [perspective:1300px] focus-visible:ring-4 focus-visible:ring-[#2e69ff]/30 ${
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
                    <p className="truncate text-[13px] font-bold text-white">
                      {topCard.author ?? 'Teleo Member'}
                    </p>
                    <p className="text-[11px] text-white/60">{topCard.timeAgo}</p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center px-2 py-5 text-center">
                  <p className="max-w-[260px] text-[clamp(22px,6.4vw,28px)] font-black leading-[1.42] tracking-[-0.035em]">
                    {topCard.frontMessage}
                  </p>
                </div>

                <CardActions {...cardActions} showPrayerMenu={!isFlipped} />
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
                    <p className="truncate text-[13px] font-bold text-white">
                      {topCard.author ?? 'Teleo Member'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/60">Prayer details</p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-5 text-center">
                  <p className="max-w-[260px] text-[14px] leading-6 text-white/78">
                    {topCard.backDetails}
                  </p>
                </div>

                <CardActions {...cardActions} showPrayerMenu={isFlipped} />
              </article>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="absolute left-4 right-4 top-4 z-30 rounded-2xl bg-[#fff3f2] px-4 py-3 text-[12px] font-medium text-[#8b2d23] shadow-sm">
            {errorMessage}
          </div>
        )}

        <Link
          to="/prayer-history"
          aria-label="View prayer post history"
          className="absolute bottom-20 right-[88px] z-20 flex size-14 items-center justify-center rounded-full border border-[#171f5e]/15 bg-white text-[#171f5e] shadow-[0_14px_28px_rgba(23,31,94,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f6ff] active:scale-95"
        >
          <HistoryIcon />
        </Link>

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
