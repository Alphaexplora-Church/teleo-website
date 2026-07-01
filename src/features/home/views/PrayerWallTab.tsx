// features/dashboard/views/PrayerWallTab.tsx
// View: Prayer Wall tab — community prayer post list with avatar placeholders

import React, { useState } from 'react';

// ── Mock prayer request data ──────────────────────────────────
const MOCK_PRAYERS = [
  {
    id: 'p1',
    initials: 'AM',
    name: 'Anonymous Member',
    time: '2h ago',
    text: 'Please pray for my family as we navigate a difficult season. We are trusting in God\'s provision and grace during this time.',
    prayerCount: 14,
  },
  {
    id: 'p2',
    initials: 'JR',
    name: 'James R.',
    time: '5h ago',
    text: 'Asking for prayers for healing. I have a medical procedure coming up next week and I\'m believing for a full recovery.',
    prayerCount: 32,
  },
  {
    id: 'p3',
    initials: 'SC',
    name: 'Sarah C.',
    time: '1d ago',
    text: 'Praise report! The job I prayed about last month came through. Thank you all for standing with me in faith. God is so good!',
    prayerCount: 57,
    isPraise: true,
  },
  {
    id: 'p4',
    initials: 'MT',
    name: 'Michael T.',
    time: '2d ago',
    text: 'Please intercede for peace in my marriage. We are going through counseling and need strength and wisdom from above.',
    prayerCount: 21,
  },
];

// ── Praying hands icon ────────────────────────────────────────
const PrayIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
    <path d="M6 14v0a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2z" />
  </svg>
);

// ── Prayer card ───────────────────────────────────────────────
interface PrayerCardProps {
  initials: string;
  name: string;
  time: string;
  text: string;
  prayerCount: number;
  isPraise?: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ initials, name, time, text, prayerCount, isPraise }) => {
  const [prayed, setPrayed] = useState(false);

  return (
    <div className={`w-full rounded-2xl bg-white border shadow-sm p-4 flex flex-col gap-3 ${isPraise ? 'border-amber-200' : 'border-gray-border/60'}`}>
      {isPraise && (
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-[11px]">✦</span>
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Praise Report</span>
        </div>
      )}
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-white">{initials}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-navy truncate">{name}</span>
          <span className="text-[11px] text-gray-placeholder">{time}</span>
        </div>
      </div>
      {/* Text */}
      <p className="text-[14px] text-gray-label leading-relaxed">{text}</p>
      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-border/40">
        <button
          type="button"
          onClick={() => setPrayed((p) => !p)}
          className={`flex items-center gap-1.5 text-[12px] font-semibold transition-all active:scale-95 cursor-pointer border-none bg-transparent p-0 ${prayed ? 'text-navy' : 'text-gray-placeholder hover:text-navy'}`}
          aria-pressed={prayed}
          aria-label="Pray for this request"
        >
          <PrayIcon />
          {prayed ? 'Praying' : 'Pray'} · {prayerCount + (prayed ? 1 : 0)}
        </button>
      </div>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────
const PrayerWallTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-bold text-navy leading-tight">Prayer Wall</h1>
          <p className="text-[13px] text-gray-placeholder">Lift each other up in prayer</p>
        </div>
        <button
          type="button"
          className="shrink-0 mt-1 px-4 py-2 rounded-full bg-navy text-white text-[12px] font-semibold border-none cursor-pointer transition-all hover:bg-navy-hover active:scale-95 active:bg-navy-active shadow-btn"
        >
          + Request
        </button>
      </div>

      {/* Prayer cards */}
      <div className="flex flex-col gap-3">
        {MOCK_PRAYERS.map((p) => (
          <PrayerCard key={p.id} {...p} />
        ))}
      </div>

      {/* Load more placeholder */}
      <button
        type="button"
        className="w-full min-h-[48px] rounded-2xl border-[1.5px] border-gray-border/80 bg-white text-[14px] font-medium text-gray-placeholder cursor-pointer transition-all hover:border-navy hover:text-navy active:scale-95"
      >
        Load more prayers
      </button>
    </div>
  );
};

export default PrayerWallTab;
