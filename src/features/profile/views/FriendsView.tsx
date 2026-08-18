// features/profile/views/FriendsView.tsx
// View layer: Dumb UI. Only JSX. Consumes useFriendsViewModel hook.
// NO useState, NO useEffect, NO useMemo, NO API calls inside View.

import React, { useState } from 'react';
import { useFriendsViewModel } from '../viewModels/useFriendsViewModel';
import PublicProfileView from './PublicProfileView';

// ── Icons ─────────────────────────────────────────────────────────────────────

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ── Component Props ───────────────────────────────────────────────────────────

export interface FriendsViewProps {
  initialTab?: string;
  onBack?: () => void;
  onUserClick?: (userId: string | number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const FriendsView: React.FC<FriendsViewProps> = ({ initialTab = 'Suggestions', onBack, onUserClick }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);

  const {
    activeTab,
    setActiveTab,
    tabs,
    requests,
    suggestions,
    groupedFriends,
    followedChurches,
    suggestedChurches,
    friendsCount,
    churchesCount,
    handleAcceptRequest,
    handleDeclineRequest,
    handleAddFriend,
    handleToggleFollowChurch,
    handleBackPress,
  } = useFriendsViewModel({ initialTab, onBack });

  const handleUserClick = (userId: string | number) => {
    if (onUserClick) {
      onUserClick(userId);
    } else {
      setSelectedUserId(userId);
    }
  };

  if (selectedUserId !== null) {
    return (
      <PublicProfileView
        userId={String(selectedUserId)}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col relative pb-20 font-sans text-black">
      {/* ── Header ── */}
      <header className="px-4 pt-4 pb-2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleBackPress}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Go back"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className="p-1 -mr-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Search friends"
          >
            <SearchIcon />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold leading-tight">Your Network</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-gray-900">{friendsCount}</span> Friends
            </p>
            <span className="text-neutral-300 text-xs">•</span>
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-gray-900">{churchesCount}</span> Churches
            </p>
          </div>
        </div>
      </header>

      {/* ── Sticky Tabs ── */}
      <nav className="sticky top-0 bg-white z-10 w-full border-b border-gray-200 mt-2 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
        <div
          className={[
            'w-full flex items-center px-4 overflow-x-auto no-scrollbar',
            tabs.length < 5 ? 'justify-between gap-4' : 'justify-start gap-6',
          ].join(' ')}
        >
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab || (tab === 'Friends' && activeTab === 'Teleo Friends');
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap px-1 py-3 text-sm font-medium transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${isActive ? 'text-black font-semibold' : 'text-neutral-500 hover:text-black'
                  }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.75 bg-amber-500 rounded-t-md" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <main className="flex-1 px-4 py-4 space-y-6">
        {/* ==================== SUGGESTIONS TAB ==================== */}
        {activeTab === 'Suggestions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {requests.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Friend Requests</h2>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                    {requests.length}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {requests.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <div
                        onClick={() => handleUserClick(friend.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold truncate group-hover:text-amber-600 transition-colors">{friend.name}</h3>
                          <p className="text-xs text-neutral-500 truncate">{friend.church}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(friend.id)}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                          aria-label="Accept"
                        >
                          <CheckIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(friend.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          aria-label="Decline"
                        >
                          <XIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {requests.length > 0 && <hr className="border-gray-100" />}

            <section>
              <h2 className="text-lg font-bold mb-4">People you may know</h2>
              <div className="flex flex-col gap-4">
                {suggestions.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <div
                      onClick={() => handleUserClick(friend.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                    >
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold truncate group-hover:text-amber-600 transition-colors">{friend.name}</h3>
                        <p className="text-xs text-neutral-500 truncate">{friend.church}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddFriend(friend.id)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Add Friend"
                    >
                      <UserPlusIcon />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== FRIENDS TAB ==================== */}
        {(activeTab === 'Friends' || activeTab === 'Teleo Friends') && (
          <div className="animate-in fade-in duration-300">
            {Object.keys(groupedFriends).map((letter) => (
              <div key={letter} className="mb-6 space-y-3">
                {/* Alphabetical Section Header Badge */}
                <div className="w-fit text-xs font-bold text-neutral-500 bg-gray-100 px-3 py-1 rounded-md">
                  {letter}
                </div>
                <div className="flex flex-col gap-4 px-1">
                  {groupedFriends[letter].map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3">
                      <div
                        onClick={() => handleUserClick(friend.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0 group-hover:opacity-90 transition-opacity"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold truncate group-hover:text-amber-600 transition-colors">{friend.name}</h3>
                          <p className="text-xs text-neutral-500 truncate">{friend.church}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label="Message"
                      >
                        <MessageIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== CHURCH FOLLOWING TAB ==================== */}
        {activeTab === 'Church Following' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Followed Churches Section */}
            <section>
              <h2 className="text-lg font-bold mb-4">Followed Churches</h2>
              <div className="flex flex-col gap-4">
                {followedChurches.map((church) => (
                  <div key={church.id} className="flex items-center gap-3">
                    <img
                      src={church.avatar}
                      alt={church.name}
                      className="w-13.75 h-13.75 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">{church.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPinIcon />
                        <span className="truncate">{church.location}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFollowChurch(church.id)}
                      className="px-4 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    >
                      Following
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Churches Near You Section */}
            <section>
              <h2 className="text-lg font-bold mb-4">Churches Near You</h2>
              <div className="flex flex-col gap-4">
                {suggestedChurches.map((church) => (
                  <div key={church.id} className="flex items-center gap-3">
                    <img
                      src={church.avatar}
                      alt={church.name}
                      className="w-13.75 h-13.75 rounded-full object-cover border border-gray-100 shadow-sm opacity-90 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">{church.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPinIcon />
                        <span className="truncate">
                          {church.location} • {church.distance}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFollowChurch(church.id)}
                      className="px-4 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default FriendsView;
