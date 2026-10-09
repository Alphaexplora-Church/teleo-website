import React from 'react';

// "↻ Every Thursday" pill for recurring events and announcements (SCRUM-228).

export const RepeatIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

interface RecurrenceBadgeProps { label: string; className?: string; }

const RecurrenceBadge: React.FC<RecurrenceBadgeProps> = ({ label, className = '' }) => (
  <span className={`inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#3730A3] ring-1 ring-inset ring-[#C7D2FE] ${className}`}>
    <RepeatIcon size={11} />
    {label}
  </span>
);

export default RecurrenceBadge;
