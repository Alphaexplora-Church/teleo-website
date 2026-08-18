// features/profile/views/PublicProfileView.tsx
// View layer: Dumb UI. Only JSX. Consumes usePublicProfileViewModel hook.
// NO useState, NO useEffect, NO useMemo, NO API calls inside View.

import React, { useState } from 'react';
import { usePublicProfileViewModel } from '../viewModels/usePublicProfileViewModel';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackChevronIcon: React.FC = () => (
  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline
      points="7 1 1 6.5 7 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const UserCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const ChurchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 22V10l-6-5-6 5v12" />
    <path d="M12 2v3" />
    <path d="M10 3.5h4" />
    <path d="M10 22v-5a2 2 0 0 1 4 0v5" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

// ── Component Props ───────────────────────────────────────────────────────────

export interface PublicProfileViewProps {
  userId?: string;
  onBack?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ userId, onBack }) => {
  const { profile, handleToggleAddFriend, handleBackPress } = usePublicProfileViewModel({
    userId,
    onBack,
  });

  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 relative">
      {/* ═══════════════════════════════════════════════════════════
          1. Hero Banner Section
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-60 shrink-0 flex flex-col justify-start gap-2 bg-navy overflow-hidden">
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-navy/30 via-navy/60 to-navy/95" />

        {/* Top Header Row: Back Button (Left) */}
        <div className="relative z-10 px-4 pt-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBackPress}
            className="size-8 bg-neutral-50/20 hover:bg-neutral-50/30 active:scale-95 transition-all flex items-center justify-center border-none cursor-pointer text-white rounded-input shrink-0"
          >
            <BackChevronIcon />
          </button>
        </div>

        {/* Hero Content (Centered) */}
        <div className="relative z-10 px-5 pt-1 pb-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            {/* Main Avatar */}
            <div className="size-20 rounded-full overflow-hidden border-2 border-white/40 shadow-md bg-white/10 backdrop-blur-xs shrink-0 mb-1">
              {profile.avatar && !avatarError ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold uppercase">
                  {profile.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* Username Badge */}
            {profile.username && (
              <div className="flex items-center justify-center mb-0.5">
                <span className="px-2.5 py-0.5 bg-white/20 outline-1 outline-white/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-wide">
                  {profile.username}
                </span>
              </div>
            )}

            {/* Name */}
            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-center">
              {profile.name}
            </h1>

            {/* Stats Line */}
            <div className="flex items-center justify-center gap-4 text-white/90 text-xs font-medium mt-0.5">
              <div>
                <span className="font-bold text-white">{profile.friendsCount}</span> Friends
              </div>
              <span className="text-white/40">•</span>
              <div>
                <span className="font-bold text-white">{profile.followingCount}</span> Churches Followed
              </div>
            </div>
          </div>

          {/* Action Buttons Row (Centered) */}
          <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto mt-1">
            <button
              type="button"
              onClick={handleToggleAddFriend}
              className="flex-1 min-w-32.5 h-11 bg-white text-navy rounded-full shadow-lg flex items-center justify-center gap-2 text-sm font-bold tracking-wide active:scale-95 transition-all cursor-pointer"
            >
              {profile.isFriend ? <UserCheckIcon /> : <UserPlusIcon />}
              <span>{profile.isFriend ? 'Friends' : 'Add Friend'}</span>
            </button>

            <button
              type="button"
              className="flex-1 min-w-32.5 h-11 bg-white/10 outline-1 outline-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center gap-2 text-sm font-bold tracking-wide hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            >
              <MessageIcon />
              <span>Message</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. Content Area 
          ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-4xl mx-auto px-5 pt-6 pb-12 flex flex-col gap-8">
        {/* Profile Details Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-gray-900 text-lg font-bold leading-tight">
            About {profile.name}
          </h2>
          <div className="flex flex-col gap-3">
            {profile.about.church && (
              <div className="w-full min-h-12 px-4 py-3 bg-gray-100 rounded-xl flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0 text-navy">
                  <ChurchIcon />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Church</span>
                  <span className="text-gray-900 text-sm font-semibold tracking-wide truncate">
                    {profile.about.church}
                  </span>
                </div>
              </div>
            )}

            {profile.about.birthday && (
              <div className="w-full min-h-12 px-4 py-3 bg-gray-100 rounded-xl flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0 text-navy">
                  <CalendarIcon />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Birthday</span>
                  <span className="text-gray-900 text-sm font-semibold tracking-wide truncate">
                    {profile.about.birthday}
                  </span>
                </div>
              </div>
            )}

            {profile.about.gender && (
              <div className="w-full min-h-12 px-4 py-3 bg-gray-100 rounded-xl flex items-center gap-3">
                <div className="flex items-center justify-center shrink-0 text-navy">
                  <UserIcon />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Gender</span>
                  <span className="text-gray-900 text-sm font-semibold tracking-wide truncate">
                    {profile.about.gender}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prayer Requests Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 text-lg font-bold leading-tight">
              Recent Prayer Requests
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {profile.recentPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col gap-2.5"
              >

                <p className="text-sm text-gray-800 leading-relaxed font-normal">
                  "{prayer.content}"
                </p>

                <div className="flex items-center gap-1.5 text-gray-500 text-xs pt-1 border-t border-gray-100 mt-1">
                  <span className="font-semibold text-gray-700">{prayer.likesCount}</span>
                  <span>prayers received</span>
                </div>
              </div>
            ))}
            {profile.recentPrayers.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent prayer requests.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicProfileView;
