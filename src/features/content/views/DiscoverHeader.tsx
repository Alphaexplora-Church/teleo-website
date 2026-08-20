// features/content/views/DiscoverHeader.tsx
import React from 'react';
import { DISCOVER_TABS } from '../models/discoverTypes';
import type { DiscoverTabId, DiscoverUser } from '../models/discoverTypes';
import searchIcon from '../../../assets/Discover__Screen_icons/Search.svg';
import openBookIcon from '../../../assets/Discover__Screen_icons/open_book.svg';
import bookmarkBookIcon from '../../../assets/Discover__Screen_icons/BookMark_blue.svg';
import downloadIcon from '../../../assets/Discover__Screen_icons/Download.svg';
import {
  DISCOVER_GRADIENT_IMAGE,
  DISCOVER_GRADIENT_SIZE,
  TOP_NAV_HEIGHT,
} from '../../../shared/constants/discoverTheme';

const TAB_ICONS: Record<DiscoverTabId, string> = {
  library: openBookIcon,
  bookshelf: bookmarkBookIcon,
  downloads: downloadIcon,
};

interface DiscoverHeaderProps {
  user: DiscoverUser;
  activeTab: DiscoverTabId;
  onTabChange: (tab: DiscoverTabId) => void;
  isSearchOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

// Note: this header renders directly below the shared app-shell top bar.
// Both share the exact same background gradient image (see
// shared/constants/discoverTheme), offset so the pattern flows seamlessly
// across the seam between them — no visible line where one ends and the
// other begins. The search *button* lives only in the top bar (it only
// appears on Discover); this component just renders the resulting search
// field, greeting, and tab pills.
const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  user,
  activeTab,
  onTabChange,
  isSearchOpen,
  searchQuery,
  onSearchQueryChange,
}) => (
  <div className="relative">
    <header className="relative overflow-hidden bg-[#001739] px-5 pb-11 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: DISCOVER_GRADIENT_IMAGE,
          backgroundSize: DISCOVER_GRADIENT_SIZE,
          backgroundPosition: `0 -${TOP_NAV_HEIGHT}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="relative min-w-0">
        <p className="text-[13px] font-medium text-white/65">Hello, {user.firstName}!</p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight text-white">Ready to Explore?</h1>
      </div>

      {isSearchOpen && (
        <div className="relative mt-4 flex items-center gap-2 rounded-full bg-white/12 px-4 py-2.5">
          <img src={searchIcon} alt="" className="h-4 w-4 opacity-80" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search titles..."
            aria-label="Search titles"
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/50"
          />
        </div>
      )}
    </header>

    <div className="absolute -bottom-[22px] left-0 right-0 z-10 flex justify-center gap-2.5 px-5">
      {DISCOVER_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[12.5px] font-semibold shadow-[0_4px_14px_rgba(27,50,82,0.14)] transition-all active:scale-95 ${
              isActive
                ? 'border-[#001739] bg-[#001739] text-white'
                : 'border-[#E1E4E8] bg-white text-[#001739] hover:bg-[#F4F6F8]'
            }`}
          >
            <img
              src={TAB_ICONS[tab.id]}
              alt=""
              className={`h-[15px] w-[15px] ${
                tab.id === 'library' && !isActive ? 'brightness-0' : ''
              }`}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default DiscoverHeader;
