import React from 'react';
import type { FeedPostModel, PostCategory } from '../models/homeTypes';

const TAG_STYLES: Record<PostCategory, string> = {
  Announcement: 'bg-[#E8F1FF] text-[#1D4ED8] ring-[#BFDBFE]',
  Events: 'bg-[#E6F7F5] text-[#0F766E] ring-[#A7E3DC]',
};

interface FeedPostProps { post: FeedPostModel; first?: boolean; onOpen: () => void; }

const FeedPost: React.FC<FeedPostProps> = ({ post, first, onOpen }) => (
  <article className={`border-b border-[#ececec] px-5 pb-6 ${first ? 'pt-1' : 'pt-6'}`}>
    <div className="mb-4 flex items-center gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-[#DBE0E4]" aria-hidden="true" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[12px] font-medium text-black">{post.author}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-placeholder">
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
      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${TAG_STYLES[post.category]}`}>
        {post.category}
      </span>
    </div>
    <button type="button" onClick={onOpen} className="block w-full text-left">
      <h2 className="text-[16px] font-bold">{post.title}</h2>
      {post.details && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#666]">
          {post.details.map((detail) => <span key={detail}>{detail}</span>)}
        </p>
      )}
      <p className="mt-1 text-[11px] leading-4.25">{post.body}</p>
      {post.schedule && <p className="mt-4 whitespace-pre-line text-[11px] leading-4.25">{post.schedule}</p>}
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.imageAlt ?? ''} className="mt-2 h-42.5 w-full rounded-lg object-cover" />
      )}
    </button>
  </article>
);

export default FeedPost;