// features/dashboard/views/ContentTab.tsx
// View: Content tab — media article cards mimicking a content feed

import React from 'react';

// ── Mock content data ─────────────────────────────────────────
const MOCK_CONTENT = [
  {
    id: 'c1',
    tag: 'Devotional',
    tagColor: 'bg-blue-50 text-blue-600',
    title: 'Finding Peace in the Midst of Life\'s Storms',
    blurb: 'A short reflection on Matthew 14 and what it means to keep our eyes fixed on Christ when the waves rise around us.',
    readTime: '4 min read',
    date: 'Jul 1',
    gradient: 'from-[#1B3252] to-[#0B4E87]',
  },
  {
    id: 'c2',
    tag: 'Sermon',
    tagColor: 'bg-purple-50 text-purple-600',
    title: 'The Power of Community in the Body of Christ',
    blurb: 'This week\'s message unpacks Romans 12 and the essential role of unity, spiritual gifts, and fellowship in the Church.',
    readTime: '28 min watch',
    date: 'Jun 29',
    gradient: 'from-[#1F2156] to-[#0B4E87]',
  },
  {
    id: 'c3',
    tag: 'Podcast',
    tagColor: 'bg-green-50 text-green-600',
    title: 'Grace & Truth — Episode 14: Navigating Faith at Work',
    blurb: 'Practical conversation on how to live out your faith authentically in the modern workplace without compromising your convictions.',
    readTime: '42 min listen',
    date: 'Jun 27',
    gradient: 'from-[#042C58] to-[#1B3252]',
  },
  {
    id: 'c4',
    tag: 'Article',
    tagColor: 'bg-amber-50 text-amber-600',
    title: 'Why Sabbath Still Matters in a 24/7 World',
    blurb: 'A look at the theological roots of rest and how intentional rhythm can transform your spiritual life in the digital age.',
    readTime: '6 min read',
    date: 'Jun 24',
    gradient: 'from-[#336EF9] to-[#0B4E87]',
  },
];

// ── Content card ──────────────────────────────────────────────
interface ContentCardProps {
  tag: string;
  tagColor: string;
  title: string;
  blurb: string;
  readTime: string;
  date: string;
  gradient: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ tag, tagColor, title, blurb, readTime, date, gradient }) => (
  <button
    type="button"
    className="w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-border/60 shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.98] active:shadow-sm"
  >
    {/* Thumbnail gradient strip */}
    <div className={`w-full h-[88px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </div>
    {/* Body */}
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tagColor}`}>{tag}</span>
        <span className="text-[11px] text-gray-placeholder">{date}</span>
      </div>
      <p className="text-[14px] font-semibold text-navy leading-snug">{title}</p>
      <p className="text-[12px] text-gray-placeholder leading-relaxed line-clamp-2">{blurb}</p>
      <span className="text-[11px] font-medium text-link mt-0.5">{readTime}</span>
    </div>
  </button>
);

// ── Component ─────────────────────────────────────────────────
const ContentView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-bold text-navy leading-tight">Content</h1>
          <p className="text-[13px] text-gray-placeholder">Devotionals, sermons & more</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-5 px-5 no-scrollbar">
        {['All', 'Devotional', 'Sermon', 'Podcast', 'Article'].map((f, i) => (
          <button
            key={f}
            type="button"
            className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all cursor-pointer active:scale-95 ${i === 0
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-placeholder border-gray-border/80 hover:border-navy hover:text-navy'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content cards */}
      <div className="flex flex-col gap-3">
        {MOCK_CONTENT.map((item) => (
          <ContentCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ContentView;
