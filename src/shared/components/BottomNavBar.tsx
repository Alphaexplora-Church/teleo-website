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
  <nav
    aria-label="Main navigation"
    className="w-full border-t border-gray-border/60 bg-white shadow-[0_-2px_12px_rgba(0,23,57,0.07)]"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="flex h-[64px] items-stretch">
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
            className="flex min-h-12 flex-1 cursor-pointer select-none flex-col items-center justify-center gap-[2px] border-none bg-transparent transition-all duration-150 hover:bg-[#DBE0E4]/40 active:scale-95"
          >
            <img
              src={isActive ? FILLED_ICON_MAP[id] : ICON_MAP[id]}
              alt=""
              className={`h-[28px] ${id === 'content' ? 'w-[23px]' : 'w-[30px]'} object-contain transition-all duration-150 ${isActive ? 'scale-105 opacity-100' : 'opacity-55'}`}
            />
            <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-navy' : 'text-[#757575]'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNavBar;
