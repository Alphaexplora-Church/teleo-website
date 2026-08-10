// features/profile/churchprofile/views/ChurchProfileView.tsx
// View layer: dumb UI only. NO API calls. Business state comes from the ViewModel.

import React, { useState, useMemo } from 'react';
import { useChurchProfileViewModel } from '../viewModels/useChurchProfileViewModel';
import type { ChurchProfileTab } from '../models/churchProfileTypes';
import FeedPost from '../../../home/views/FeedPost';

// ── Icons ────────────────────────────────────────────────────────────────────

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

const LocationIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-blue-600">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-pink-600">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YouTubeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-red-600">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-gray-600">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Component Props ──────────────────────────────────────────────────────────

interface ChurchProfileViewProps {
  churchId?: number;
  userHomeChurchId?: number | null;
  initialTab?: ChurchProfileTab;
  onBack?: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

const ChurchProfileView: React.FC<ChurchProfileViewProps> = ({
  churchId,
  userHomeChurchId,
  initialTab = 'overview',
  onBack,
}) => {
  const {
    church,
    isLoading,
    error,
    isFollowing,
    toggleFollow,
    isHomeChurch,
    toggleHomeChurch,
    isTogglingHome,
    tabs,
    activeTab,
    setActiveTab,
  } = useChurchProfileViewModel(churchId, userHomeChurchId, initialTab);

  const [bannerError, setBannerError] = useState(false);

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  // Dynamically filter active social links
  const socialLinks = useMemo(() => {
    if (!church) return [];
    return [
      { name: 'Facebook', url: church.facebookUrl, icon: <FacebookIcon /> },
      { name: 'Instagram', url: church.instagramUrl, icon: <InstagramIcon /> },
      { name: 'YouTube', url: church.youtubeUrl, icon: <YouTubeIcon /> },
      { name: 'Website', url: church.websiteUrl, icon: <GlobeIcon /> },
    ].filter((link) => !!link.url);
  }, [church]);

  // ── Loading state ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50 animate-pulse">
        <div className="w-full h-80 bg-gray-300" />
        <div className="w-full h-14 bg-gray-200 mt-2" />
        <div className="px-5 mt-6 space-y-4">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-5/6 h-4 bg-gray-200 rounded" />
          <div className="w-4/6 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error || !church) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium text-center">
          {error || 'Church not found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 relative">
      {/* ═══════════════════════════════════════════════════════════
          1. Hero Banner Section
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-65 shrink-0 flex flex-col justify-start gap-2 bg-navy overflow-hidden">
        {/* Banner Image */}
        {church.bannerUrl && !bannerError && (
          <img
            src={church.bannerUrl}
            alt={`${church.name} banner`}
            onError={() => setBannerError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-navy/30 via-navy/60 to-navy/95" />

        {/* Top Back Button inside Hero Header */}
        <div className="relative z-10 px-4 pt-4 flex items-center justify-start">
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBackPress}
            className="size-8 bg-neutral-50/20 hover:bg-neutral-50/30 active:scale-95 transition-all flex items-center justify-center border-none cursor-pointer text-white rounded-input"
          >
            <BackChevronIcon />
          </button>
        </div>

        {/* Hero Content (Centered) */}
        <div className="relative z-10 px-5 pt-1 pb-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            {/* Category / Type Badge (Main Church vs Sister Church) */}
            {church.churchCategory && (
              <div className="flex items-center justify-center mb-0.5">
                <span className="px-2 py-0.5 bg-white/20 outline-1 outline-white/30 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wide">
                  {church.churchCategory}
                </span>
              </div>
            )}

            {/* Church Name (Centered) */}
            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-center">
              {church.name}
            </h1>

            {/* Location Line (Centered) */}
            {church.location && (
              <div className="flex items-center justify-center gap-1.5 text-white/80 text-center">
                <LocationIcon />
                <span className="text-xs font-medium tracking-wide">
                  {church.location}
                </span>
              </div>
            )}

            {/* Joined Date (Centered) */}
            {church.joinedDate && (
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider text-center mt-0.5">
                Joined {church.joinedDate}
              </p>
            )}
          </div>

          {/* Action Buttons Row (Centered) */}
          <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto mt-1">
            <button
              type="button"
              onClick={toggleHomeChurch}
              disabled={isTogglingHome}
              className="flex-1 min-w-32.5 h-11 bg-white text-navy rounded-full shadow-lg flex items-center justify-center gap-2 text-sm font-bold tracking-wide active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isTogglingHome ? (
                <SpinnerIcon />
              ) : isHomeChurch ? (
                'Leave Home'
              ) : (
                'Set as Home'
              )}
            </button>

            <button
              type="button"
              onClick={toggleFollow}
              className="flex-1 min-w-32.5 h-11 bg-white/10 outline-1 outline-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center text-sm font-bold tracking-wide hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            >
              {isFollowing ? 'Following' : 'Follow Church'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. Tab Navigation (Overview, Announcements, Events, Services)
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className="w-full bg-gray-50/95 border-b border-gray-200 backdrop-blur-md sticky top-0 z-30"
        aria-label="Church profile tabs"
      >
        <div
          className={[
            'w-full max-w-4xl mx-auto flex items-center px-5 overflow-x-auto scrollbar-none',
            tabs.length < 5 ? 'justify-between gap-4 sm:justify-start sm:gap-8' : 'justify-start gap-6',
          ].join(' ')}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as ChurchProfileTab)}
                className={[
                  'shrink-0 py-3.5 text-xs sm:text-sm font-bold tracking-wide border-b-2 cursor-pointer whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-500 border-transparent hover:text-gray-700',
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
          3. Content Area
          ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-4xl mx-auto px-5 py-6">
        {/* ── Overview Tab ──────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* Description */}
            {church.overview && (
              <p className="text-gray-700 text-base font-normal leading-relaxed text-justify">
                {church.overview}
              </p>
            )}

            {/* Connect & Community */}
            {socialLinks.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 text-lg font-bold leading-tight">
                  Connect & Community
                </h3>
                <div className="flex flex-col gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-12 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <div className="flex items-center justify-center shrink-0">
                        {link.icon}
                      </div>
                      <span className="text-gray-900 text-sm font-semibold tracking-wide">
                        {link.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Visit Us & Google Maps */}
            {church.location && (
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 text-lg font-bold leading-tight">
                  Visit Us
                </h3>

                <div className="flex items-start gap-2 mb-2">
                  <div className="mt-1 text-blue-600">
                    <LocationIcon />
                  </div>
                  <p className="text-blue-600 text-base font-medium leading-relaxed">
                    {church.location}
                  </p>
                </div>

                <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 h-50">
                  <iframe
                    title={`${church.name} Location`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(church.location)}&output=embed`}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Announcements Tab ───────────────────────────────── */}
        {activeTab === 'announcements' && (
          <div className="flex flex-col gap-4">
            {church.announcements?.map((post, i) => (
              <FeedPost key={post.id} post={post} first={i === 0} onOpen={() => { }} />
            ))}
            {(!church.announcements || church.announcements.length === 0) && (
              <p className="text-center text-gray-500 py-8">No announcements at this time.</p>
            )}
          </div>
        )}

        {/* ── Events Tab ──────────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="flex flex-col gap-4">
            {church.events?.map((post, i) => (
              <FeedPost key={post.id} post={post} first={i === 0} onOpen={() => { }} />
            ))}
            {(!church.events || church.events.length === 0) && (
              <p className="text-center text-gray-500 py-8">No upcoming events.</p>
            )}
          </div>
        )}

        {/* ── Services Tab ────────────────────────────────────── */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900 px-0.5">
              Available Services
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {church.services?.map((svc) => (
                <div
                  key={svc.id}
                  className="relative rounded-2xl overflow-hidden shadow-sm h-48 flex flex-col justify-end bg-navy group cursor-pointer"
                >
                  {/* Background Image */}
                  {svc.image && (
                    <img
                      src={svc.image}
                      alt={svc.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/30 to-transparent" />

                  {/* Service Info Content */}
                  <div className="relative p-3.5 flex flex-col justify-end gap-0.5 z-10">
                    <h3 className="text-white text-sm font-bold leading-tight">
                      {svc.name}
                    </h3>
                    {svc.subtitle && (
                      <p className="text-white/80 text-xs font-medium">
                        {svc.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {(!church.services || church.services.length === 0) && (
                <p className="col-span-2 text-center text-gray-500 py-8">No services available.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChurchProfileView;