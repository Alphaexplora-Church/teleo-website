// features/profile/churchprofile/views/ChurchProfileView.tsx
// View layer: dumb UI only. NO API calls. Business state comes from the ViewModel.
// UI-only state (image error fallbacks) stays local.

import React from 'react';
import { useChurchProfileViewModel } from '../viewModels/useChurchProfileViewModel';
import type { ChurchProfileTab } from '../models/churchProfileTypes';
import FeedPost from '../../../home/views/FeedPost';


// ── Clock icon for services ──────────────────────────────────────────────────
const ClockIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);


// ── Component props ──────────────────────────────────────────────────────────
interface ChurchProfileViewProps {}

// ── Component ────────────────────────────────────────────────────────────────
const ChurchProfileView: React.FC<ChurchProfileViewProps> = () => {
  const {
    church,
    isFollowing,
    toggleFollow,
    isHomeChurch,
    toggleHomeChurch,
    tabs,
    activeTab,
    setActiveTab,
  } = useChurchProfileViewModel();

  // UI-only state: image error fallback
  const [bannerError, setBannerError] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">

      {/* ═══════════════════════════════════════════════════════════
          1. Hero Banner
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[200px] shrink-0 overflow-hidden">
        {/* Banner image */}
        {church.bannerUrl && !bannerError ? (
          <img
            src={church.bannerUrl}
            alt={`${church.name} banner`}
            onError={() => setBannerError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800" />
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


        {/* Top-right: "Joined" badge */}
        <span className="absolute top-4 right-4 z-10 inline-flex items-center px-3 py-1 rounded-full bg-[#F59E0B] text-white text-[11px] font-semibold tracking-wide shadow-md">
          Joined {church.joinedDate}
        </span>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. Profile Info Card (overlapping the hero banner)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 mx-4 z-20">
        <div className="bg-[#23234F] rounded-[20px] shadow-xl pt-16 pb-6 px-5 flex flex-col items-center">

          {/* Profile picture — overflows upward */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-[4px] border-white shadow-lg overflow-hidden bg-white">
              {church.logoUrl && !logoError ? (
                <img
                  src={church.logoUrl}
                  alt={`${church.name} logo`}
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {church.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Church name */}
          <h1 className="text-white text-[22px] font-bold text-center leading-tight mt-1">
            {church.name}
          </h1>

          {/* Action buttons row */}
          <div className="mt-4 flex w-full max-w-[300px] gap-2.5">
            {/* Follow / Unfollow button */}
            <button
              type="button"
              onClick={toggleFollow}
              className={[
                'flex-1 py-2.5 rounded-full text-white text-[13px] font-semibold',
                'cursor-pointer border-none shadow-md',
                'active:scale-[0.97] transition-all duration-300 ease-in-out',
                isFollowing
                  ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                  : 'bg-[#F59E0B] hover:bg-[#D97706]',
              ].join(' ')}
            >
              {isFollowing ? 'Unfollow' : 'Follow Church'}
            </button>

            {/* Set as Home Church button */}
            <button
              type="button"
              onClick={toggleHomeChurch}
              className={[
                'flex-1 py-2.5 rounded-full text-[13px] font-semibold',
                'cursor-pointer shadow-md',
                'active:scale-[0.97] transition-all duration-300 ease-in-out',
                isHomeChurch
                  ? 'bg-white text-[#23234F] border-2 border-white hover:bg-gray-100'
                  : 'bg-transparent text-white border-2 border-white/40 hover:border-white/70',
              ].join(' ')}
            >
              {isHomeChurch ? '✓ Home Church' : 'Set as Home'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. Scrollable Tab Navigation
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className="mt-5 bg-white border-b border-gray-200 sticky top-0 z-30"
        aria-label="Church profile tabs"
      >
        <div className="flex overflow-x-auto scrollbar-hide whitespace-nowrap px-4 gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as ChurchProfileTab)}
                className={[
                  'pb-3 pt-3 text-sm border-b-[3px] cursor-pointer bg-transparent whitespace-nowrap',
                  'transition-colors duration-200 shrink-0',
                  isActive
                    ? 'text-black font-bold border-[#F59E0B]'
                    : 'text-gray-400 font-medium border-transparent hover:text-gray-600',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          4. Content Area
          ═══════════════════════════════════════════════════════════ */}
      <section className="flex-1 bg-white px-5 py-6">

        {/* ── Overview ────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <p className="text-gray-800 text-[14px] leading-relaxed text-justify">
            {church.overview}
          </p>
        )}

        {/* ── Announcements ───────────────────────────────────── */}
        {activeTab === 'announcements' && (
          <div className="flex flex-col">
            {church.announcements.map((post, i) => (
              <FeedPost key={post.id} post={post} first={i === 0} onOpen={() => { }} />
            ))}
          </div>
        )}

        {/* ── Events ──────────────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="flex flex-col">
            {church.events.map((post, i) => (
              <FeedPost key={post.id} post={post} first={i === 0} onOpen={() => { }} />
            ))}
          </div>
        )}

        {/* ── Services ────────────────────────────────────────── */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-3">
            {church.services.map((svc) => (
              <article
                key={svc.id}
                className="flex items-center gap-4 bg-[#23234F]/5 border border-[#23234F]/15 rounded-2xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#23234F] text-white shrink-0">
                  <ClockIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">
                    {svc.name}
                  </h3>
                  <p className="text-[12px] text-gray-500">
                    {svc.day} &middot; {svc.time}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChurchProfileView;
