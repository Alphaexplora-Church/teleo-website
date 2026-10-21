import React from 'react';
import type { PostCategory } from '../models/homeTypes';

// The post's type in its header, styled like the app's section labels
// ("GOSPEL OF THE DAY", "UPCOMING EVENTS"): a small icon tile and uppercase text.
const LABELS: Record<PostCategory, { text: string; icon: React.ReactNode }> = {
  Events: {
    text: 'Event',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
  },
  Announcement: {
    text: 'Announcement',
    icon: (
      <>
        <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      </>
    ),
  },
};

const PostTypeLabel: React.FC<{ category: PostCategory }> = ({ category }) => {
  const { text, icon } = LABELS[category];
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-navy">
      <span className="flex h-5 w-5 items-center justify-center rounded bg-off-white text-navy-hover">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon}
        </svg>
      </span>
      {text}
    </span>
  );
};

export default PostTypeLabel;
