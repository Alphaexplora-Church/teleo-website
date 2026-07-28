import React from 'react';
import type { DashboardTab } from '../models/navigationTypes';
import { NAV_TABS } from '../models/navigationTypes';
import type { ShellDestination } from '../../features/shell/viewModels/useShellViewModel';
import homeIcon from '../../assets/icons/Home icon.svg';
import servicesIcon from '../../assets/icons/ri_service-fill.svg';
import prayerIcon from '../../assets/icons/pray.svg';
import contentIcon from '../../assets/icons/content.svg';
import givingIcon from '../../assets/icons/giving.svg';
import chatIcon from '../../assets/icons/Chat Icon.svg';
import homeFilledIcon from '../../assets/icons/home-filled.svg';
import servicesFilledIcon from '../../assets/icons/service-filled.svg';
import prayerFilledIcon from '../../assets/icons/pray-filled.svg';
import contentFilledIcon from '../../assets/icons/content-filled.svg';
import givingFilledIcon from '../../assets/icons/gift-filled.svg';
import chatFilledIcon from '../../assets/icons/chat-filled.svg';

const ICON_MAP: Record<DashboardTab, string> = {
  home: homeIcon,
  services: servicesIcon,
  'prayer-wall': prayerIcon,
  content: contentIcon,
  giving: givingIcon,
  chat: chatIcon,
};

const FILLED_ICON_MAP: Record<DashboardTab, string> = {
  home: homeFilledIcon,
  services: servicesFilledIcon,
  'prayer-wall': prayerFilledIcon,
  content: contentFilledIcon,
  giving: givingFilledIcon,
  chat: chatFilledIcon,
};

interface BottomNavBarProps {
  activeTab: ShellDestination;
  onTabChange: (tab: DashboardTab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => (
  <>
    {/* ── Mobile Floating Pill Nav ─────────────────────────── */}
    <nav
      aria-label="Main navigation"
      className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex h-[64px] w-[calc(100%-40px)] max-w-[400px] items-center justify-between rounded-[32px] bg-white px-2 border border-gray-200/80 shadow-[0_8px_32px_rgba(0,23,57,0.12),0_2px_8px_rgba(0,23,57,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#001739]/20 to-transparent rounded-full" />

      {NAV_TABS.map(({ id, label }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            id={`nav-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => onTabChange(id)}
            className={[
              'relative flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-2xl border-none transition-all duration-200 active:scale-90',
              isActive
                ? 'bg-[#001739]/8 shadow-[0_0_0_1px_rgba(0,23,57,0.12)]'
                : 'bg-transparent hover:bg-[#001739]/5',
            ].join(' ')}
          >
            {/* Active indicator ring */}
            {isActive && (
              <span className="absolute inset-0 rounded-2xl ring-1 ring-[#001739]/20" />
            )}
            <img
              src={isActive ? FILLED_ICON_MAP[id] : ICON_MAP[id]}
              alt=""
              className={[
                'object-contain transition-all duration-200',
                id === 'content' ? 'h-[22px] w-[18px]' : 'h-[24px] w-[24px]',
                isActive
                  ? 'opacity-100 scale-110'
                  : 'opacity-40',
              ].join(' ')}
            />
          </button>
        );
      })}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#001739]/20 to-transparent rounded-full" />
    </nav>

    {/* ── Desktop Floating Pill Sidebar ─────────────── */}
    <nav
      aria-label="Main navigation"
      className="hidden lg:flex flex-col items-center justify-center py-4 gap-1
        fixed left-5 top-1/2 -translate-y-1/2 z-[60]
        w-[64px] rounded-[32px]
        bg-white
        border border-gray-200/80
        shadow-[0_8px_32px_rgba(0,23,57,0.12),0_2px_8px_rgba(0,23,57,0.06)]"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#001739]/20 to-transparent rounded-full" />

      {NAV_TABS.map(({ id, label }) => {
        const isActive = activeTab === id;
        return (
          <div key={id} className="relative group flex items-center">
            <button
              id={`nav-tab-desktop-${id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => onTabChange(id)}
              className={[
                'relative flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-2xl border-none transition-all duration-200 active:scale-90',
                isActive
                  ? 'bg-[#001739]/8 shadow-[0_0_0_1px_rgba(0,23,57,0.12)]'
                  : 'bg-transparent hover:bg-[#001739]/5',
              ].join(' ')}
            >
              {/* Active indicator ring */}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl ring-1 ring-[#001739]/20" />
              )}
              <img
                src={isActive ? FILLED_ICON_MAP[id] : ICON_MAP[id]}
                alt=""
                className={[
                  'object-contain transition-all duration-200',
                  id === 'content' ? 'h-[22px] w-[18px]' : 'h-[24px] w-[24px]',
                  isActive
                    ? 'opacity-100 scale-110'
                    : 'opacity-40 group-hover:opacity-65',
                ].join(' ')}
              />
            </button>

            {/* Tooltip label — appears to the right on hover */}
            <div
              className="pointer-events-none absolute left-[calc(100%+14px)] flex items-center
                opacity-0 group-hover:opacity-100
                translate-x-[-6px] group-hover:translate-x-0
                transition-all duration-200 ease-out"
            >
              <div
                className="relative whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#001739]
                  bg-white
                  border border-gray-200
                  shadow-[0_4px_16px_rgba(0,23,57,0.12)]"
              >
                {/* Tooltip arrow */}
                <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 h-[10px] w-[10px] rotate-45 rounded-sm bg-white border-l border-b border-gray-200" />
                {label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#001739]/20 to-transparent rounded-full" />
    </nav>
  </>
);

export default BottomNavBar;
