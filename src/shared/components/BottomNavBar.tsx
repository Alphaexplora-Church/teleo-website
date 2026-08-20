import React from 'react';
import type { DashboardTab } from '../models/navigationTypes';
import { NAV_TABS } from '../models/navigationTypes';
import type { ShellDestination } from '../../features/shell/viewModels/useShellViewModel';
import homeIcon from '../../assets/Discover__Screen_icons/home.svg';
import servicesIcon from '../../assets/icons/service-filled.svg';
import announcementsIcon from '../../assets/Discover__Screen_icons/Megaphone.svg';
import contentIcon from '../../assets/Discover__Screen_icons/open_book.svg';
import profileIcon from '../../assets/Discover__Screen_icons/Userprofile.svg';

const ICON_MAP: Record<DashboardTab, string> = {
  home: homeIcon,
  services: servicesIcon,
  announcements: announcementsIcon,
  content: contentIcon,
  profile: profileIcon,
};

interface BottomNavBarProps {
  activeTab: ShellDestination;
  onTabChange: (tab: DashboardTab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => (
  <nav
    aria-label="Main navigation"
    className="w-full border-t border-[#ECEEF1] bg-white"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="flex h-[64px] items-center justify-between px-3">
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
            className="flex flex-1 cursor-pointer select-none flex-col items-center justify-center gap-1 border-none bg-transparent py-1"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                isActive ? 'bg-[#336EF9] shadow-[0_4px_12px_rgba(51,110,249,0.35)]' : ''
              }`}
            >
              <img
                src={ICON_MAP[id]}
                alt=""
                className={`${id === 'content' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} object-contain ${
                  isActive ? '' : 'brightness-0 opacity-45'
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNavBar;
