import React, { useCallback, useEffect, useState } from 'react';
import type { FeedPostModel } from '../models/homeTypes';

interface PostDetailViewProps { post: FeedPostModel; onClose: () => void; }

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Delay unmounting until the exit transition finishes. Repeated clicks are
  // ignored to prevent multiple close timers from racing one another.
  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 240);
  }, [isClosing, onClose]);

  useEffect(() => {
    // Escape mirrors the visible back control for keyboard accessibility.
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && requestClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [requestClose]);

  return (
    <div className={`fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] top-[59px] z-30 flex justify-center transition-colors duration-200 ${isClosing ? 'pointer-events-none bg-black/0' : 'bg-black/30'}`} role="dialog" aria-modal="true" aria-label={`${post.title} details`}>
      <div className={`h-full w-full max-w-[448px] overflow-y-auto bg-white text-[#111] shadow-2xl transition-all duration-200 ease-out ${isClosing ? 'translate-x-5 opacity-0' : 'translate-x-0 opacity-100'}`}>
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-[#ECECEC] bg-white/95 px-3 backdrop-blur-md">
          <button type="button" onClick={requestClose} aria-label="Back to feed" className="flex h-10 w-10 items-center justify-center rounded-full text-[#001739] transition-colors hover:bg-[#DBE0E4]/55 active:scale-95"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <h1 className="ml-2 text-[15px] font-bold text-[#001739]">Post</h1>
        </header>

        <article className="px-5 pb-8 pt-5">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0"><div className="h-10 w-10 rounded-full bg-[#DBE0E4]"/><span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#3399FF]"/></div>
            <div className="min-w-0 flex-1"><div className="flex items-start"><div className="flex-1"><p className="text-[13px] font-semibold">{post.author}</p><p className="mt-0.5 text-[10px] text-[#757575]">{post.meta}</p></div><span className="rounded-full bg-[#E6F7F5] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">{post.category}</span></div>

              <h2 className="mt-4 text-[19px] font-bold leading-[25px]">{post.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[12px] font-medium text-[#565F68]">{post.tags.map((tag, index) => <React.Fragment key={tag}>{index > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[#9AA2AA]" aria-hidden="true" />}<span>{tag}</span></React.Fragment>)}</div>
              <p className="mt-3 text-[12px] leading-[19px] text-[#4F4F4F]">{post.body}</p>
              {post.schedule && <p className="mt-3 whitespace-pre-line text-[11px] leading-[18px] text-[#666]">{post.schedule}</p>}
            </div>
          </div>

          {post.imageUrl && <img src={post.imageUrl} alt={post.imageAlt ?? ''} className="mt-4 h-[235px] w-full rounded-xl object-cover" />}

          {/* Compact, container-free metadata keeps the full post visually light. */}
          <section className="mt-5 grid grid-cols-3 gap-2 border-y border-[#ECEFF2] py-4" aria-label="Event details">
            <div className="flex min-w-0 items-start gap-1.5">
              <span className="mt-0.5 shrink-0 text-[#1D4ED8]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg></span>
              <div className="min-w-0"><p className="line-clamp-2 text-[11px] font-bold leading-[15px]">{post.date}</p><p className="mt-1 text-[9px] leading-[13px] text-[#626B73]">{post.time}</p></div>
            </div>
            <div className="flex min-w-0 items-start gap-1.5">
              <span className="mt-0.5 shrink-0 text-[#167C3A]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
              <div className="min-w-0"><p className="line-clamp-2 text-[11px] font-bold leading-[15px]">{post.location}</p><p className="mt-1 line-clamp-2 text-[9px] leading-[13px] text-[#626B73]">{post.locationNote}</p></div>
            </div>
            <div className="flex min-w-0 items-start gap-1.5">
              <span className="mt-0.5 shrink-0 text-[#A65F00]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 10h5M7 14h3M16 9v7"/></svg></span>
              <div className="min-w-0"><p className="text-[11px] font-bold leading-[15px]">{post.fee}</p><p className="mt-1 text-[9px] leading-[13px] text-[#626B73]">Event fee</p></div>
            </div>
          </section>

          <section className="mt-6 border-t border-[#ECECEC] pt-5"><h3 className="text-[14px] font-bold">Event information</h3><div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5"><div><p className="text-[11px] font-semibold">Organizers</p><p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-[#777]">{post.organizer}</p></div><div><p className="text-[11px] font-semibold">Speakers/Guests</p><p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-[#777]">{post.speakers}</p></div><div><p className="text-[11px] font-semibold">Participants</p><p className="mt-1 text-[10px] text-[#777]">{post.participants}</p></div><div><p className="text-[11px] font-semibold">Dress code</p><p className="mt-1 text-[10px] text-[#777]">{post.dressCode}</p></div></div></section>

          <button type="button" className="mt-7 w-full rounded-full bg-[#001739] py-3.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(0,23,57,0.22)] active:scale-[0.99]">Register Now</button>
        </article>
      </div>
    </div>
  );
};

export default PostDetailView;
