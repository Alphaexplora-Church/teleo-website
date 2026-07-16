import React from 'react';
import { usePrayerDetailsViewModel } from '../viewModels/usePrayerDetailsViewModel';
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

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
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

const MoreIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const PrayerDetailsView: React.FC = () => {
  const {
    prayer,
    comments,
    isOwner,
    isLoading,
    errorMessage,
    reactingAction,
    isPostMenuOpen,
    setIsPostMenuOpen,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editPrayerTag,
    setEditPrayerTag,
    editAudience,
    setEditAudience,
    isSavingEdit,
    isDeleting,
    isMarkingAnswered,
    hasHeartReacted,
    reactToPost,
    startEditing,
    markCurrentPrayerAsAnswered,
    savePrayerEdit,
    deleteCurrentPrayer,
    goBack,
    navigateToTab,
  } = usePrayerDetailsViewModel();

  if (isLoading) {
    return (
      <section className="flex min-h-dvh items-center justify-center bg-off-white px-5">
        <div className="text-center text-navy">
          <div className="mx-auto size-10 animate-spin rounded-full border-[3px] border-navy/15 border-t-navy" />
          <p className="mt-4 text-sm font-semibold">Loading prayer request...</p>
        </div>
      </section>
    );
  }

  if (!prayer) {
    return (
      <section className="flex min-h-dvh items-center justify-center bg-off-white px-5">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-placeholder">
            {errorMessage ?? 'Prayer request not found.'}
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
          <h1 className="min-w-0 flex-1 text-[17px] font-semibold">Prayer Request</h1>
          {isOwner && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
                aria-label="Open post actions"
                aria-expanded={isPostMenuOpen}
                className="flex size-9 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/30 active:scale-95"
              >
                <MoreIcon />
              </button>
              {isPostMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-44 overflow-hidden rounded-xl border border-black/8 bg-white py-1.5 text-gray-label shadow-[0_16px_36px_rgba(12,25,48,0.24)]">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="block w-full px-4 py-2.5 text-left text-[12px] font-semibold transition hover:bg-[#f5f6ff]"
                  >
                    Edit post
                  </button>
                  <button
                    type="button"
                    onClick={markCurrentPrayerAsAnswered}
                    disabled={prayer.isAnswered || isMarkingAnswered}
                    className="block w-full px-4 py-2.5 text-left text-[12px] font-semibold text-[#096f5f] transition hover:bg-[#ecfbf7] disabled:cursor-not-allowed disabled:text-gray-placeholder disabled:opacity-65 disabled:hover:bg-transparent"
                  >
                    {prayer.isAnswered
                      ? 'Prayer answered'
                      : isMarkingAnswered
                        ? 'Marking answered...'
                        : 'Mark as answered'}
                  </button>
                  <button
                    type="button"
                    onClick={deleteCurrentPrayer}
                    disabled={isDeleting}
                    className="block w-full px-4 py-2.5 text-left text-[12px] font-semibold text-[#9a281f] transition hover:bg-[#fff3f2] disabled:opacity-60"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete post'}
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        <article className="px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-9 shrink-0 rounded-full bg-[#dfe7f1]" />
              <div>
                <p className="text-[13px] font-bold text-white">
                  {prayer.author ?? 'Teleo Member'}
                </p>
                <p className="text-[10px] text-white/60">{prayer.timeAgo}</p>
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

          {isEditing ? (
            <div className="mt-7 space-y-3 rounded-2xl bg-white/92 p-4 text-gray-label shadow-sm">
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-navy">
                  Subject
                </span>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-border px-3 text-[12px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/8"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold text-navy">
                  Prayer request
                </span>
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-border px-3 py-2 text-[12px] leading-5 outline-none focus:border-navy focus:ring-4 focus:ring-navy/8"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold text-navy">
                    Tag
                  </span>
                  <input
                    value={editPrayerTag}
                    onChange={(event) => setEditPrayerTag(event.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-border px-3 text-[12px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/8"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold text-navy">
                    Audience
                  </span>
                  <select
                    value={editAudience}
                    onChange={(event) =>
                      setEditAudience(event.target.value as typeof editAudience)
                    }
                    className="h-11 w-full rounded-xl border border-gray-border px-3 text-[12px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/8"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="HOME_CHURCH">Church</option>
                    <option value="PRIVATE">Only Me</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-gray-border px-4 py-2 text-[12px] font-bold text-gray-placeholder"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={savePrayerEdit}
                  disabled={isSavingEdit}
                  className="rounded-full bg-navy px-4 py-2 text-[12px] font-bold text-white disabled:opacity-60"
                >
                  {isSavingEdit ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mt-7 max-w-[330px] text-[22px] font-black leading-[1.3] tracking-[-0.035em]">
                {prayer.frontMessage}
              </h2>
              <p className="mt-6 text-[13px] leading-[1.6] text-white/82">
                {prayer.backDetails}
              </p>
            </>
          )}
        </article>

        <div className="flex items-center gap-3 border-y border-white/22 px-4 py-3">
          <button
            type="button"
            onClick={() => reactToPost('HEART')}
            disabled={Boolean(reactingAction)}
            aria-label="Heart react to prayer"
            className={`flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              hasHeartReacted
                ? 'bg-white text-[#d92d20] hover:bg-white/92'
                : 'bg-white/22 text-white hover:bg-white/32'
            }`}
          >
            <HeartIcon filled={hasHeartReacted || reactingAction === 'HEART'} />
          </button>
          <button
            type="button"
            onClick={() => reactToPost('PRAYING')}
            disabled={Boolean(reactingAction)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-white/35 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/45 active:scale-[0.98]"
          >
            <PrayIcon />
            {reactingAction === 'PRAYING' ? 'Sending...' : 'Pray'}
          </button>
        </div>

        <section aria-label="Prayer comments" className="flex-1 px-5 pb-8 pt-4">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold">
            <CommentIcon />
            Comments
          </div>

          <div className="space-y-2.5">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-white/40 bg-white/90 px-3 py-2.5 text-gray-label shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  {comment.author ? (
                    <p className="text-[11px] font-bold text-navy">{comment.author}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[9px] text-gray-placeholder">{comment.timeAgo}</p>
                </div>
                <p className="mt-1 text-[11px] leading-4">{comment.message}</p>
              </article>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="rounded-lg bg-white/10 px-3 py-3 text-[11px] text-white/78">
              No comments yet.
            </p>
          )}

          {errorMessage && (
            <p className="mt-4 rounded-xl bg-white/90 px-3 py-2 text-[11px] font-medium text-[#8b2d23]">
              {errorMessage}
            </p>
          )}

        </section>

        <div className="sticky bottom-0 z-20 mt-auto text-gray-label">
          <BottomNavBar activeTab="prayer-wall" onTabChange={navigateToTab} />
        </div>
      </div>
    </main>
  );
};

export default PrayerDetailsView;
