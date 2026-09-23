import React, { useEffect, useRef } from 'react';
import type { FeedPostModel } from '../models/homeTypes';

interface PostDetailViewProps {
  post: FeedPostModel;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    // Escape mirrors the visible back control for keyboard accessibility.
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      onClose();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > 40 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      onClose();
    }
  };

  const hasDateTime = Boolean(post.date || post.time);
  const hasLocation = Boolean(post.location || post.locationNote);
  const hasFee = Boolean(post.fee);
  const hasEventDetails = hasDateTime || hasLocation || hasFee;
  const detailCount = [hasDateTime, hasLocation, hasFee].filter(Boolean).length;

  const isUnspecified = (val?: string | null) =>
    !val ||
    val.trim() === '' ||
    ['not specified', 'none', 'n/a', 'null', 'undefined'].includes(
      val.trim().toLowerCase(),
    );

  const hasSpeakers = !isUnspecified(post.speakers);
  const hasParticipants = !isUnspecified(post.participants);
  const hasDressCode = !isUnspecified(post.dressCode);
  const hasEventInfo = hasSpeakers || hasParticipants || hasDressCode;

  return (
    <div
      className="w-full bg-white text-[#111] touch-pan-y"
      role="region"
      aria-label={`${post.title} details`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="px-5 pt-4 pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to feed"
          className="inline-flex items-center gap-2 rounded-full py-1.5 pr-3 text-xs font-semibold text-[#1f2156] transition-colors hover:bg-[#DBE0E4]/40 active:scale-95 cursor-pointer border-none bg-transparent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to Feed</span>
        </button>
      </div>

      <article className="px-5 pb-8 pt-2">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="h-10 w-10 rounded-full bg-[#DBE0E4]" />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#3399FF]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{post.author}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-[#757575]">
                  <span>{post.meta}</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-[#9AA2AA]" aria-hidden="true" />
                      {post.tags.map((tag, index) => (
                        <React.Fragment key={tag}>
                          {index > 0 && <span className="h-1 w-1 rounded-full bg-[#9AA2AA]" aria-hidden="true" />}
                          <span>{tag}</span>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <span className="rounded-full bg-[#E6F7F5] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">
                {post.category}
              </span>
            </div>

            <h2 className="mt-4 text-[19px] font-bold leading-[25px]">{post.title}</h2>
            <p className="mt-1 text-[12px] leading-[19px] text-[#4F4F4F]">{post.body}</p>
            {post.schedule && <p className="mt-3 whitespace-pre-line text-[11px] leading-[18px] text-[#666]">{post.schedule}</p>}
          </div>
        </div>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.imageAlt ?? ''} className="mt-4 h-[235px] w-full rounded-xl object-cover" />
        )}

        {hasEventDetails && (
          <section
            className={`mt-5 grid gap-2 border-y border-[#ECEFF2] py-4 ${detailCount === 1
                ? 'grid-cols-1'
                : detailCount === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            aria-label="Event details"
          >
            {hasDateTime && (
              <div className="flex min-w-0 items-start gap-1.5">
                <span className="mt-0.5 shrink-0 text-[#1D4ED8]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                  </svg>
                </span>
                <div className="min-w-0">
                  {post.date && <p className="line-clamp-2 text-[11px] font-bold leading-[15px]">{post.date}</p>}
                  {post.time && <p className="mt-1 text-[9px] leading-[13px] text-[#626B73]">{post.time}</p>}
                </div>
              </div>
            )}
            {hasLocation && (
              <div className="flex min-w-0 items-start gap-1.5">
                <span className="mt-0.5 shrink-0 text-[#167C3A]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div className="min-w-0">
                  {post.location && <p className="line-clamp-2 text-[11px] font-bold leading-[15px]">{post.location}</p>}
                  {post.locationNote && <p className="mt-1 line-clamp-2 text-[9px] leading-[13px] text-[#626B73]">{post.locationNote}</p>}
                </div>
              </div>
            )}
            {hasFee && (
              <div className="flex min-w-0 items-start gap-1.5">
                <span className="mt-0.5 shrink-0 text-[#A65F00]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="6" width="18" height="13" rx="2" />
                    <path d="M7 10h5M7 14h3M16 9v7" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-[15px]">{post.fee}</p>
                  <p className="mt-1 text-[9px] leading-[13px] text-[#626B73]">Event fee</p>
                </div>
              </div>
            )}
          </section>
        )}

        {hasEventInfo && (
          <section className={`${hasEventDetails ? 'mt-5' : 'mt-6 border-t border-[#ECECEC] pt-5'}`}>
            <h3 className="text-[14px] font-bold">Event information</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5">
              {hasSpeakers && (
                <div>
                  <p className="text-[11px] font-semibold">Speakers/Guests</p>
                  <p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-[#777]">{post.speakers}</p>
                </div>
              )}
              {hasParticipants && (
                <div>
                  <p className="text-[11px] font-semibold">Participants</p>
                  <p className="mt-1 text-[10px] text-[#777]">{post.participants}</p>
                </div>
              )}
              {hasDressCode && (
                <div>
                  <p className="text-[11px] font-semibold">Dress code</p>
                  <p className="mt-1 text-[10px] text-[#777]">{post.dressCode}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {post.category === 'Events' && (
          <button
            type="button"
            className="mt-7 w-full rounded-full bg-[#001739] py-3.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(0,23,57,0.22)] active:scale-[0.99]"
          >
            Register Now
          </button>
        )}
      </article>
    </div>
  );
};

export default PostDetailView;
