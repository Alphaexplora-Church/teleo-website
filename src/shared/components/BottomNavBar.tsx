// shared/components/BottomNavBar.tsx
// View: Sticky 5-tab bottom navigation bar
// Receives activeTab + setActiveTab from parent — zero business logic inside.

import React from 'react';
import type { DashboardTab } from '../models/navigationTypes';
import { NAV_TABS } from '../models/navigationTypes';

// ── SVG icon set ──────────────────────────────────────────────
const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const ServicesIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const PrayerWallIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ContentIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
);

const ProfileIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GivingIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    stroke={active ? '#1B3252' : '#9ca3af'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

const ICON_MAP: Record<DashboardTab, React.FC<{ active: boolean }>> = {
  'home': HomeIcon,
  'services': ServicesIcon,
  'prayer-wall': PrayerWallIcon,
  'content': ContentIcon,
  'profile': ProfileIcon,
  'giving': GivingIcon,
};

// ── Props ─────────────────────────────────────────────────────
interface BottomNavBarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

// ── Component ─────────────────────────────────────────────────
const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      aria-label="Main navigation"
      className="w-full bg-white border-t border-gray-border/60 shadow-[0_-2px_12px_rgba(27,50,82,0.07)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-[60px]">
        {NAV_TABS.map(({ id, label }) => {
          const isActive = activeTab === id;
          const Icon = ICON_MAP[id];

          return (
            <button
              key={id}
              id={`nav-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => onTabChange(id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-[3px]
                min-h-[48px] border-none cursor-pointer select-none
                transition-all duration-150
                active:scale-95 active:bg-navy/5
                ${isActive ? 'bg-transparent' : 'bg-transparent hover:bg-gray-50'}
              `}
            >
              <div className="relative flex items-center justify-center">
                <Icon active={isActive} />
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-navy" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide leading-none transition-colors ${isActive ? 'text-navy' : 'text-gray-placeholder'
                  }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
