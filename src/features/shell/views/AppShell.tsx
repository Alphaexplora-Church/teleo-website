// features/dashboard/views/GuestDashboard.tsx
// View: Post-authentication App Shell
// Renders: Sticky Top Header + Scrollable Content Area + Sticky Bottom Nav
// Tab switching is entirely state-driven — no URL changes, no shell re-mounts.

import React from 'react';
import TeleoLogo from '../../../shared/components/TeleoLogo';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { useShellViewModel } from '../viewModels/useShellViewModel';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

// ── Tab page views ────────────────────────────────────────────
import HomeFeedView from '../../home/views/HomeFeedView';
import ServicesView from '../../services/views/ServicesView';
import PrayerWallView from '../../prayer-wall/views/PrayerWallView';
import ContentView from '../../content/views/ContentView';
import ProfileView from '../../profile/views/ProfileView';
import GivingView from '../../giving/views/GivingView';

// ── Tab page registry ─────────────────────────────────────────
const TAB_PAGES: Record<DashboardTab, React.FC> = {
  'home': HomeFeedView,
  'services': ServicesView,
  'prayer-wall': PrayerWallView,
  'content': ContentView,
  'profile': ProfileView,
  'giving': GivingView,
};

// ── Notification bell icon ────────────────────────────────────
const BellIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ── GuestDashboard (App Shell) ────────────────────────────────
const AppShell: React.FC = () => {
  const { activeTab, setActiveTab } = useShellViewModel();

  // Resolve the active page component
  const ActivePage = TAB_PAGES[activeTab];

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-off-white flex flex-col relative ring-1 ring-black/4 shadow-card">

      {/* ── Sticky Top Header ─────────────────────────────── */}
      <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-border/50 shadow-[0_1px_8px_rgba(27,50,82,0.06)]">
        <div
          className="flex items-center justify-between px-5 h-[60px]"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          {/* Left: Teleo branding */}
          <div className="flex items-center gap-2.5">
            <TeleoLogo size={32} />
            <span className="text-[18px] font-black tracking-[4px] text-navy leading-none select-none font-sans">
              TELEO
            </span>
          </div>

          {/* Right: Notification bell */}
          <button
            id="btn-header-notifications"
            type="button"
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-navy border-none bg-transparent cursor-pointer transition-colors hover:bg-navy/8 active:bg-navy/15"
          >
            <BellIcon />
            {/* Unread indicator dot */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFAF00] border-2 border-white" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Scrollable Content Area ───────────────────────── */}
      <main
        className="flex-1 overflow-y-auto"
        id="dashboard-content-area"
        aria-live="polite"
        aria-label={`${activeTab} page`}
      >
        <ActivePage />
      </main>

      {/* ── Sticky Bottom Navigation Bar ─────────────────── */}
      <div className="sticky bottom-0 z-20 w-full">
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default AppShell;
