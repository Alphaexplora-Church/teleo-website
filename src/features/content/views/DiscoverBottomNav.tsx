// features/content/views/DiscoverBottomNav.tsx
import React from 'react';
import homeIcon from '../../../assets/Discover__Screen_icons/home.svg';
import heartIcon from '../../../assets/Discover__Screen_icons/Heart.svg';
import megaphoneIcon from '../../../assets/Discover__Screen_icons/Megaphone.svg';
import profileIcon from '../../../assets/Discover__Screen_icons/Userprofile.svg';
import openBookIcon from '../../../assets/Discover__Screen_icons/open_book.svg';

type NavItemId = 'home' | 'prayer' | 'announcements' | 'library' | 'profile';

const NAV_ITEMS: { id: NavItemId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: homeIcon },
  { id: 'prayer', label: 'Prayer', icon: heartIcon },
  { id: 'announcements', label: 'News', icon: megaphoneIcon },
  { id: 'library', label: 'Library', icon: openBookIcon },
  { id: 'profile', label: 'Profile', icon: profileIcon },
];

interface DiscoverBottomNavProps {
  activeItem: NavItemId;
  onChange: (item: NavItemId) => void;
}

const DiscoverBottomNav: React.FC<DiscoverBottomNavProps> = ({ activeItem, onChange }) => (
  <nav
    aria-label="Main navigation"
    className="w-full border-t border-[#ECEEF1] bg-white"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="flex h-[64px] items-center justify-between px-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeItem;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            onClick={() => onChange(item.id)}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                isActive ? 'bg-[#336EF9] shadow-[0_4px_12px_rgba(51,110,249,0.35)]' : ''
              }`}
            >
              <img
                src={item.icon}
                alt=""
                className={`${item.id === 'library' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} ${
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

export default DiscoverBottomNav;
export type { NavItemId };
