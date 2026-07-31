// features/profile/views/ProfileView.tsx
// View layer: dumb UI only. NO useState (except img-error), NO useEffect, NO API calls.

import React from 'react';
import { useProfileViewModel } from '../viewModels/useProfileViewModel';
import type { SettingsItem, QuickActionItem } from '../models/profileTypes';
import type { Church } from '../findmychurch/models/findMyChurchTypes';

import prayIcon from '../../../assets/icons/pray-black.svg';
import givingIcon from '../../../assets/icons/giving-black.svg';
import historyIcon from '../../../assets/icons/history.svg';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackChevronIcon: React.FC = () => (
  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline
      points="7 1 1 6.5 7 12"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="7" height="12" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline
      points="1 1 7 6.5 1 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SecurityIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HelpIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogOutIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const PersonIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Icon Maps
const SETTINGS_ICON_MAP: Record<SettingsItem['iconType'], React.ReactNode> = {
  account: <PersonIcon />,
  security: <SecurityIcon />,
  notifications: <BellIcon />,
  help: <HelpIcon />,
  logout: <LogOutIcon />,
};

const QUICK_ACTION_ICON_MAP: Record<QuickActionItem['iconType'], React.ReactNode> = {
  giving: <img src={givingIcon} alt="Giving" className="size-6" />,
  prayers: <img src={prayIcon} alt="Prayers" className="size-7" />,
  history: <img src={historyIcon} alt="History" className="size-6" />,
};

// ── Pure Avatar Component ─────────────────────────────────────────────────────
const ProfileAvatar: React.FC<{ url?: string | null }> = ({ url }) => {
  if (url) {
    return (
      <img
        src={url}
        alt="Profile avatar"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).onerror = null;
          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/88x88?text=User';
        }}
        className="size-20 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="size-20 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
      <UserIcon />
    </div>
  );
};

// ── Component Props ───────────────────────────────────────────────────────────
export interface ProfileViewProps {
  /** Called when the user taps "Find My Church" CTA. */
  onFindMyChurch?: () => void;
  /** The church selected by the user. */
  selectedChurch?: Church | null;
  /** Called when the user taps "Change" inside My Church section. */
  onChangeChurch?: () => void;
  /** Navigation callbacks for settings */
  onAccountInformation?: () => void;
  onSecurity?: () => void;
  onNotifications?: () => void;
  onHelp?: () => void;
  onChurchProfile?: () => void;
  /** Quick action callbacks */
  onGiving?: () => void;
  onPrayers?: () => void;
  onHistory?: () => void;
  onServices?: () => void;
  /** Header back action */
  onBack?: () => void;
}

// ── View Component ────────────────────────────────────────────────────────────
const ProfileView: React.FC<ProfileViewProps> = ({
  onFindMyChurch,
  selectedChurch,
  onChangeChurch,
  onAccountInformation,
  onSecurity,
  onNotifications,
  onHelp,
  onChurchProfile,
  onGiving,
  onPrayers,
  onHistory,
  onServices,
  onBack,
}) => {
  const {
    profileView,
    isLoadingProfile,
    profileError,
    displayName,
    email,
    friendsCount,
    churchFollowingCount,
    isGuest,
    quickActions,
    generalSettings,
    isLoggingOut,
    handleSettingsItemPress,
    handleQuickActionPress,
    handleFindMyChurchGuestPress,
    handleBackPress,
  } = useProfileViewModel({
    onAccountInformation,
    onSecurity,
    onNotifications,
    onHelp,
    onGiving,
    onPrayers,
    onHistory,
    onServices,
    onBack,
  });

  if (isLoadingProfile) {
    return (
      <main className="w-full bg-[#1f2156] text-black flex flex-col items-center font-roboto relative min-h-screen">
        <header className="w-full px-4 pt-5 pb-14 flex justify-between items-center">
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBackPress}
            className="size-8 bg-neutral-50/20 hover:bg-neutral-50/30 active:scale-95 transition-all flex items-center justify-center border-none cursor-pointer text-white rounded-input"
          >
            <BackChevronIcon />
          </button>
        </header>

        <section className="w-full flex-1 bg-[#ffffff] rounded-tl-[20px] rounded-tr-[20px] rounded-b-none pt-0 px-4 pb-10 flex flex-col items-center gap-4 relative animate-pulse min-h-125">
          <div className="w-full max-w-105 flex justify-between items-end -mt-10">
            <div className="size-20 rounded-full bg-neutral-200 shrink-0 border-4 border-white" />
            <div className="w-24 h-9 bg-neutral-200 rounded-full" />
          </div>
          <div className="w-full max-w-105 flex flex-col gap-2 mt-2">
            <div className="w-48 h-6 bg-neutral-200 rounded" />
            <div className="w-36 h-4 bg-neutral-200 rounded" />
          </div>
          <div className="w-full max-w-105 grid grid-cols-3 gap-3 my-4">
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
          </div>
          <div className="w-full max-w-105 flex flex-col gap-3">
            <div className="h-12 bg-neutral-100 rounded-xl" />
            <div className="h-12 bg-neutral-100 rounded-xl" />
            <div className="h-12 bg-neutral-100 rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#1f2156] text-black flex flex-col items-center font-roboto relative">
      {/* ── 1. Main Background in #1f2156 with Top Header Back Button ── */}
      <header className="w-full px-4 pt-5 pb-14 flex justify-between items-center">
        <button
          type="button"
          aria-label="Go back"
          onClick={handleBackPress}
          className="size-8 bg-neutral-50/20 hover:bg-neutral-50/30 active:scale-95 transition-all flex items-center justify-center border-none cursor-pointer text-white rounded-input"
        >
          <BackChevronIcon />
        </button>
      </header>

      <section className="w-full flex-1 bg-white rounded-tl-[20px] rounded-tr-[20px] rounded-b-none pt-0 px-4 pb-4 flex flex-col items-center gap-4 relative">

        {/* Profile*/}
        <div className="w-full max-w-105 flex justify-between items-end -mt-10">
          {/* Top Left Picture*/}
          {isGuest ? (
            <ProfileAvatar url={null} />
          ) : isLoadingProfile ? (
            <div className="size-20 rounded-full bg-neutral-200 animate-pulse shrink-0" />
          ) : (
            <ProfileAvatar url={profileView?.profile_picture_url ?? null} />
          )}

          {/* Profile Button */}
          <button
            type="button"
            onClick={onAccountInformation}
            className="w-24 h-8 py-1 bg-transparent rounded-[20px] outline -outline-offset-1 outline-amber-500 flex justify-center items-center cursor-pointer border-none hover:bg-amber-500/10 active:scale-95 transition-all"
          >
            <span className="text-center text-amber-500 text-sm font-medium font-roboto leading-6">
              Profile
            </span>
          </button>
        </div>

        {/*  Display Name & Email aligned with Friends & Church Following  */}
        <div className="w-full max-w-105 flex justify-between items-start gap-4">
          {/* Left Column: Display Name & Email */}
          <div className="flex-1 flex flex-col justify-start min-w-0">
            {isGuest ? (
              <h2 id="profile-heading" className="text-black text-xl font-bold font-roboto leading-5 truncate">
                Guest
              </h2>
            ) : isLoadingProfile ? (
              <div className="flex flex-col gap-1">
                <div className="w-32 h-6 bg-neutral-200 rounded animate-pulse" />
                <div className="w-28 h-4 bg-neutral-200 rounded animate-pulse" />
              </div>
            ) : profileError ? (
              <p className="text-xs text-red-600">{profileError}</p>
            ) : (
              <>
                <h2 id="profile-heading" className="text-black text-xl font-bold font-roboto leading-5 truncate">
                  {displayName}
                </h2>
                <p className="text-black/60 text-sm font-normal font-roboto leading-5 truncate">
                  {email}
                </p>
              </>
            )}
          </div>

          {/* Right Column: Friends & Church Following Stats */}
          <div className="flex justify-end items-start gap-1 shrink-0">
            <div className="w-20 flex flex-col items-center text-center">
              <span className="text-black text-xl font-bold font-roboto leading-6">
                {friendsCount}
              </span>
              <span className="text-black text-xs font-normal font-roboto leading-4">
                Friends
              </span>
            </div>
            <div className="w-20 flex flex-col items-center text-center">
              <span className="text-black text-xl font-bold font-roboto leading-6">
                {churchFollowingCount}
              </span>
              <span className="text-black text-xs font-normal font-roboto leading-4">
                Church Following
              </span>
            </div>
          </div>
        </div>

        {/* ── Find My Church CTA ── */}
        <div className="w-full max-w-105">
          {isGuest ? (
            <button
              type="button"
              onClick={handleFindMyChurchGuestPress}
              className="w-full h-11 rounded-[20px] border border-solid border-gray-400 bg-transparent text-zinc-600 text-sm font-medium font-roboto flex items-center justify-center hover:bg-gray-100/50 active:scale-95 transition-all cursor-pointer"
            >
              Find My Church
            </button>
          ) : selectedChurch ? (
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-neutral-500 text-base font-bold font-['Poppins']">
                  My Church
                </span>
                <button
                  type="button"
                  onClick={onChangeChurch}
                  className="text-[#336ef9] text-xs font-medium bg-transparent border-none cursor-pointer hover:opacity-75"
                >
                  Change
                </button>
              </div>
              <button
                type="button"
                onClick={onChurchProfile}
                className="w-full h-14 px-4 bg-transparent rounded-[20px] border border-solid border-gray-400 flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 active:scale-[0.98] transition-all text-left"
              >
                {selectedChurch.imageUrl ? (
                  <img
                    src={selectedChurch.imageUrl}
                    alt={selectedChurch.name}
                    className="size-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-neutral-300 shrink-0" />
                )}
                <span className="text-black text-xs font-medium font-roboto truncate flex-1">
                  {selectedChurch.name}
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onFindMyChurch}
              className="w-full h-11 rounded-[20px] border border-solid border-gray-400 bg-transparent text-zinc-600 text-sm font-medium font-roboto flex items-center justify-center hover:bg-gray-100/50 active:scale-95 transition-all cursor-pointer"
            >
              Find My Church
            </button>
          )}
        </div>

        {/* Quick Action Buttons Row (Giving, Prayers, History) */}
        <div className="w-full max-w-105 flex justify-between items-center gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleQuickActionPress(action)}
              className="size-24 rounded-[20px] border border-solid border-gray-400 bg-transparent flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all duration-200 text-black"
            >
              <div className="size-8 rounded-input flex items-center justify-center">
                {QUICK_ACTION_ICON_MAP[action.iconType]}
              </div>
              <span className="text-black text-sm font-normal font-roboto leading-4 text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── General Settings Section ── */}
        <div className="w-full max-w-105 flex flex-col gap-3" aria-labelledby="general-settings-heading">
          <h3
            id="general-settings-heading"
            className="text-neutral-500 font-bold text-base font-['Poppins'] font-poppins leading-6"
          >
            General Settings
          </h3>

          <div className="w-full px-3.5 py-3 rounded-[20px] border border-solid border-gray-400 bg-transparent flex flex-col gap-2.5">
            {generalSettings.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isLoggingOut && item.iconType === 'logout'}
                onClick={() => handleSettingsItemPress(item)}
                className={`w-full flex items-center gap-2.5 py-1.5 px-2 rounded-lg border-none bg-transparent text-left cursor-pointer hover:bg-black/5 active:scale-[0.99] transition-all duration-150 ${isLoggingOut && item.iconType === 'logout' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <div
                  className={`size-8 rounded-input flex items-center justify-center shrink-0 ${item.destructive ? 'text-red-600' : 'text-black'
                    }`}
                >
                  {SETTINGS_ICON_MAP[item.iconType]}
                </div>

                <span
                  className={`flex-1 text-xs font-normal font-roboto leading-6 ${item.destructive ? 'text-red-600' : 'text-black'
                    }`}
                >
                  {item.iconType === 'logout' && isLoggingOut ? 'Signing out…' : item.label}
                </span>

                {item.hasArrow && (
                  <div className="text-black/70 shrink-0">
                    <ChevronRightIcon />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileView;
