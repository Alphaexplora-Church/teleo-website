// features/dashboard/views/HomeTab.tsx
// View: Home tab — greeting banner + placeholder cards

import React from 'react';

// ── Skeleton card ─────────────────────────────────────────────
const PlaceholderCard: React.FC<{ title: string; subtitle: string; accent?: boolean }> = ({ title, subtitle, accent }) => (
  <div className={`w-full rounded-2xl p-5 flex flex-col gap-2 shadow-sm border ${accent ? 'bg-navy text-white border-navy' : 'bg-white border-gray-border/60'}`}>
    <div className={`w-8 h-8 rounded-lg mb-1 ${accent ? 'bg-white/20' : 'bg-off-white'}`} />
    <p className={`text-[15px] font-semibold leading-snug ${accent ? 'text-white' : 'text-navy'}`}>{title}</p>
    <p className={`text-[13px] leading-relaxed ${accent ? 'text-white/70' : 'text-gray-placeholder'}`}>{subtitle}</p>
  </div>
);

// ── Announcement strip ────────────────────────────────────────
const AnnouncementStrip: React.FC = () => (
  <div className="w-full rounded-2xl bg-gradient-to-r from-[#1B3252] to-[#0B4E87] p-5 flex items-center justify-between shadow-md">
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Upcoming</span>
      <span className="text-[15px] font-bold text-white leading-tight">Sunday Service</span>
      <span className="text-[12px] text-white/70">July 6 · 9:00 AM</span>
    </div>
    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>
  </div>
);

// ── Section header ────────────────────────────────────────────
const SectionHeader: React.FC<{ title: string; action?: string }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-3">
    <span className="text-[16px] font-bold text-navy">{title}</span>
    {action && <span className="text-[13px] font-medium text-link cursor-pointer hover:underline">{action}</span>}
  </div>
);

// ── Component ─────────────────────────────────────────────────
const HomeFeedView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
      {/* Greeting */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] text-gray-placeholder font-medium">Good morning 👋</p>
        <h1 className="text-[22px] font-bold text-navy leading-tight">Welcome to Teleo</h1>
      </div>

      {/* Announcement */}
      <AnnouncementStrip />

      {/* Quick access */}
      <div>
        <SectionHeader title="Quick Access" action="See all" />
        <div className="flex flex-col gap-3">
          <PlaceholderCard
            title="Today's Devotional"
            subtitle="Start your day with a short reflection from the Word."
          />
          <PlaceholderCard
            title="Prayer Requests"
            subtitle="Submit or view prayer needs from your community."
          />
          <PlaceholderCard
            title="Upcoming Events"
            subtitle="Browse and register for church events near you."
          />
        </div>
      </div>
    </div>
  );
};

export default HomeFeedView;
