// features/profile/views/ProfileView.tsx
// View layer: dumb UI only. NO useState (except img-error), NO useEffect, NO API calls.

import React from 'react';
import { useProfileViewModel } from '../viewModels/useProfileViewModel';
import type { SettingsItem } from '../models/profileTypes';

// ── Chevron right ─────────────────────────────────────────────
const ChevronRight: React.FC = () => (
  <svg width="6" height="11" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline points="1 1 7 6.5 1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── User placeholder icon ─────────────────────────────────────
const UserIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Inline setting icons ──────────────────────────────────────
const PersonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

// ── Activity type icons ───────────────────────────────────────
const ServiceIcon = () => (
  <svg width="33" height="29" viewBox="0 0 33 29" fill="none" aria-hidden="true">
    <path d="M16.5 2L2 10v17h29V10L16.5 2z" stroke="#1f2156" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16.5 2v5M14 4.5h5" stroke="#1f2156" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="12" y="17" width="9" height="10" rx="1" stroke="#1f2156" strokeWidth="1.8" />
  </svg>
);
const PrayerIcon = () => (
  <svg width="17" height="27" viewBox="0 0 17 27" fill="none" aria-hidden="true">
    <path d="M8.5 1C5.5 1 3 3.5 3 6.5v10l5.5 9 5.5-9v-10C14 3.5 11.5 1 8.5 1z" stroke="#336ef9" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.5 6v6" stroke="#336ef9" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Icon resolver for SettingsItem.iconType ───────────────────
const SETTINGS_ICON_MAP: Record<SettingsItem['iconType'], React.ReactNode> = {
  account: <PersonIcon />,
  security: <LockIcon />,
  notifications: <BellIcon />,
  help: <HelpIcon />,
  logout: <LogOutIcon />,
};

// ── Profile avatar ────────────────────────────────────────────
interface ProfileAvatarProps {
  url: string | null;
}
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ url }) => {
  const [imgError, setImgError] = React.useState(false);

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt="Profile picture"
        onError={() => setImgError(true)}
        className="w-[81px] h-[81px] rounded-full object-cover bg-[#d9d9d9]"
      />
    );
  }
  return (
    <div className="w-[81px] h-[81px] rounded-full bg-[#d9d9d9] flex items-center justify-center text-gray-border">
      <UserIcon />
    </div>
  );
};

// ── Component props ───────────────────────────────────────────
interface ProfileViewProps {
  /** Called when the user taps the "Find My Church" CTA. Provided by AppShell. */
  onFindMyChurch?: () => void;
  /** The church selected via FindMyChurchView. Null until the user picks one. */
  selectedChurch?: { id: number; name: string; location: string; imageUrl?: string | null } | null;
  /** Called when the user taps "Change" inside the My Church section. */
  onChangeChurch?: () => void;
  /** Called when the user taps "Account Information" in General Settings. */
  onAccountInformation?: () => void;
  /** Called when the user taps "Security & Privacy" in General Settings. */
  onSecurity?: () => void;
}

// ── Component ─────────────────────────────────────────────────
const ProfileView: React.FC<ProfileViewProps> = ({ onFindMyChurch, selectedChurch, onChangeChurch, onAccountInformation, onSecurity }) => {
  const {
    profileView,
    isLoadingProfile,
    profileError,
    email,
    isGuest,
    recentActivities,
    generalSettings,
    preferences,
    isLoggingOut,
    handleSettingsItemPress,
    handleFindMyChurchGuestPress,
  } = useProfileViewModel({ onAccountInformation, onSecurity });

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-screen pt-6 px-4 pb-10">

      {/* ── Profile hero ─────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-5 w-full" aria-labelledby="profile-heading">

        {/* Avatar with blue ring */}
        <div className="relative w-[100px] h-[100px] rounded-full border-[5px] border-solid border-[#336ef9] flex items-center justify-center shrink-0">
          {isGuest ? (
            /* Guest: neutral grey placeholder, no picture */
            <ProfileAvatar url={null} />
          ) : isLoadingProfile ? (
            <div className="w-[81px] h-[81px] rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <ProfileAvatar url={profileView?.profile_picture_url ?? null} />
          )}
        </div>

        {/* Name + email block */}
        <div className="flex flex-col items-center gap-1 w-full max-w-[280px]">
          {isGuest ? (
            /* Guest: always show "Guest" with no email */
            <h2
              id="profile-heading"
              className="font-bold text-black text-[26px] text-center leading-tight"
            >
              Guest
            </h2>
          ) : isLoadingProfile ? (
            <>
              <div className="w-36 h-7 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-28 h-5 rounded-full bg-gray-200 animate-pulse" />
            </>
          ) : profileError ? (
            <p className="text-[12px] text-error text-center">{profileError}</p>
          ) : (
            <>
              <h2
                id="profile-heading"
                className="font-bold text-black text-[26px] text-center leading-tight truncate w-full"
              >
                {profileView?.username ?? 'Teleo Member'}
              </h2>
              <p className="font-bold text-black/60 text-base text-center tracking-[0] leading-6 truncate w-full max-w-[200px]">
                {email}
              </p>
            </>
          )}
        </div>

        {/* Find My Church CTA  ──or──  My Church section */}
        {isGuest ? (
          /* ── Guest: CTA navigates to login ── */
          <button
            type="button"
            onClick={handleFindMyChurchGuestPress}
            className="flex flex-col w-[310px] h-[51px] items-center justify-center gap-0.5 bg-[#1f2156] rounded-[10px] cursor-pointer hover:bg-[#2c2f6d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            <span className="font-medium text-white text-xl text-center leading-6 whitespace-nowrap tracking-[0]">
              Find My Church
            </span>
          </button>
        ) : selectedChurch ? (
          /* ── My Church card (church was chosen) ── */
          <div className="w-full max-w-[371px] inline-flex flex-col justify-start items-center gap-2.5">
            {/* Header row */}
            <div className="self-stretch inline-flex justify-between items-center">
              <span className="text-neutral-500 text-xl font-bold leading-6">
                My Church
              </span>
              <button
                type="button"
                onClick={onChangeChurch}
                className="font-medium text-[#336ef9] text-[13px] text-right leading-6 whitespace-nowrap tracking-[0] cursor-pointer bg-transparent border-none hover:opacity-75 transition-opacity duration-150"
              >
                Change
              </button>
            </div>

            {/* Church info card */}
            <div className="self-stretch h-14 pl-4 pr-3 pt-2 pb-2.5 bg-blue-500/5 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-blue-950 flex flex-col justify-center items-center gap-2.5">
              <div className="w-full inline-flex justify-start items-center gap-2">
                {/* Church avatar: image or grey circle fallback */}
                {selectedChurch.imageUrl ? (
                  <img
                    src={selectedChurch.imageUrl}
                    alt={selectedChurch.name}
                    className="size-7 rounded-full object-cover bg-zinc-300 shrink-0"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-zinc-300 shrink-0" aria-hidden="true" />
                )}
                <span className="flex-1 text-black text-xs font-normal leading-4 truncate">
                  {selectedChurch.name}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── No church selected — show CTA button ── */
          <button
            type="button"
            onClick={onFindMyChurch}
            className="flex w-[310px] h-[51px] items-center justify-center gap-2.5 bg-[#1f2156] rounded-[10px] cursor-pointer hover:bg-[#2c2f6d] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            <span className="flex items-center justify-center font-medium text-white text-xl text-center leading-6 whitespace-nowrap relative tracking-[0]">
              Find My Church
            </span>
          </button>
        )}
      </section>

      {/* ── Recent Activity — hidden for guests ─────────────────── */}
      {!isGuest && (
        <section
          className="flex flex-col w-full max-w-[371px] items-center gap-2.5 relative flex-[0_0_auto]"
          aria-labelledby="recent-activity-heading"
        >
          <div className="flex items-center justify-between relative self-stretch w-full">
            <h3
              id="recent-activity-heading"
              className="font-bold text-[#757575] text-xl leading-6 whitespace-nowrap tracking-[0]"
            >
              Recent Activity
            </h3>
            <button
              type="button"
              className="font-medium text-[#336ef9] text-[13px] text-right leading-6 whitespace-nowrap tracking-[0] cursor-pointer bg-transparent border-none hover:opacity-75 transition-opacity duration-150"
            >
              View All
            </button>
          </div>

          {recentActivities.map((item) => (
            <article
              key={item.id}
              className="flex flex-col h-14 items-center justify-center gap-2.5 pl-[18px] pr-[13px] pt-[9px] pb-2.5 relative self-stretch w-full bg-[#336ef90d] rounded-[20px] border border-solid border-[#1f2156] shadow-[0px_4px_4px_#00000040]"
            >
              {item.type === 'service' ? (
                <div className="gap-[9px] flex w-full items-center relative">
                  <ServiceIcon />
                  <p className="flex-1 font-normal text-black text-xs leading-[14px] tracking-[0] truncate">
                    <span className="font-normal text-black text-xs tracking-[0] leading-[14px] block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-placeholder">{item.date}</span>
                  </p>
                </div>
              ) : (
                <div className="flex w-full items-center gap-4 pl-2 relative">
                  <PrayerIcon />
                  <p className="flex-1 font-normal text-black text-xs leading-[14px] tracking-[0] truncate">
                    <span className="font-normal text-black text-xs tracking-[0] leading-[14px] block truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-placeholder">{item.date}</span>
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ── General Settings ──────────────────────────────────── */}
      <section
        className="flex flex-col items-start gap-3 relative w-full max-w-[371px]"
        aria-labelledby="general-settings-heading"
      >
        <h3
          id="general-settings-heading"
          className="self-stretch font-bold text-[#757575] text-xl leading-6 whitespace-nowrap tracking-[0]"
        >
          General Settings
        </h3>
        <div className="flex flex-col items-start gap-[13px] px-[15px] py-3 relative bg-[#336ef90d] rounded-[20px] border border-solid border-[#1f2156] shadow-[0px_4px_4px_#00000040] w-full">
          {generalSettings.map((item) => (
            <button
              key={item.id}
              type="button"
              className="gap-2 flex w-full items-center relative text-left cursor-pointer bg-transparent border-none px-2 py-1 -mx-2 rounded-[8px] hover:bg-black/5 hover:translate-x-1 active:scale-[0.99] transition-all duration-200"
              aria-label={item.label}
              onClick={() => handleSettingsItemPress(item)}
            >
              <div className="flex w-[34px] h-[34px] items-center justify-center relative rounded-[10px] shrink-0">
                {SETTINGS_ICON_MAP[item.iconType]}
              </div>
              <span className="flex-1 font-normal text-black text-xs leading-6 tracking-[0]">
                {item.label}
              </span>
              {item.hasArrow && <ChevronRight />}
            </button>
          ))}
        </div>
      </section>

      {/* ── Preferences ───────────────────────────────────────── */}
      <section
        className="flex flex-col items-start gap-3 relative w-full max-w-[371px]"
        aria-labelledby="preferences-heading"
      >
        <h3
          id="preferences-heading"
          className="self-stretch font-bold text-[#757575] text-xl leading-6 whitespace-nowrap tracking-[0]"
        >
          Preferences
        </h3>
        <div className="flex flex-col items-start gap-[13px] px-[15px] py-3 relative bg-[#336ef90d] rounded-[20px] border border-solid border-[#1f2156] shadow-[0px_4px_4px_#00000040] w-full">
          {preferences.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={isLoggingOut && item.iconType === 'logout'}
              className={`gap-2 flex w-full items-center relative text-left bg-transparent border-none px-2 py-1 -mx-2 rounded-[8px] hover:bg-black/5 hover:translate-x-1 active:scale-[0.99] transition-all duration-200 ${isLoggingOut && item.iconType === 'logout' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={item.label}
              onClick={() => handleSettingsItemPress(item)}
            >
              <div className={`flex w-[34px] h-[34px] items-center justify-center relative rounded-[10px] shrink-0 ${item.destructive ? 'text-[#ff0000]' : ''}`}>
                {SETTINGS_ICON_MAP[item.iconType]}
              </div>
              <span className={`flex-1 font-normal text-xs leading-6 relative tracking-[0] ${item.destructive ? 'text-[#ff0000]' : 'text-black'}`}>
                {item.iconType === 'logout' && isLoggingOut ? 'Signing out…' : item.label}
              </span>
              {item.hasArrow && <ChevronRight />}
            </button>
          ))}
        </div>
      </section>

      {/* ── App version ───────────────────────────────────────── */}
      <p className="text-center text-[11px] text-gray-placeholder pt-2 pb-4 w-full">Teleo v0.1.0 — Beta</p>

    </main>
  );
};

export default ProfileView;
