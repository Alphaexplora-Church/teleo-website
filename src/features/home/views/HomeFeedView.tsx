import React from 'react';
import { useHomeViewModel } from '../viewModels/useHomeViewModel';
import GospelCard from './GospelCard';
import QuickActions from './QuickActions';
import FeedPost from './FeedPost';
import PostDetailView from './PostDetailView';

interface HomeFeedViewProps {
  onFindMyChurch?: () => void;
}

const HomeFeedView: React.FC<HomeFeedViewProps> = ({ onFindMyChurch }) => {
  // The view consumes a single state/action surface from the ViewModel.
  const {
    activeHeroIndex,
    setActiveHeroIndex,
    heroSlides,
    dailyGospel,
    isGospelLoading,
    gospelError,
    posts,
    isFeedLoading,
    feedError,
    needsChurchMembership,
    selectedPost,
    openPost,
    openEventPost,
    closePost,
  } = useHomeViewModel();

  return (
    <div className="bg-white pb-3 text-[#111]">
      <div className="relative rounded-b-[36px] bg-[#001739] px-1 pb-10 shadow-[0_8px_18px_rgba(0,23,57,0.14)]">
        <GospelCard
          slides={heroSlides}
          activeIndex={activeHeroIndex}
          dailyGospel={dailyGospel}
          isGospelLoading={isGospelLoading}
          gospelError={gospelError}
          onSlideChange={setActiveHeroIndex}
          onEventOpen={openEventPost}
        />
        {/* Quick actions overlap the hero boundary to visually connect the
            featured content with the light feed surface below. */}
        <div className="absolute -bottom-10 left-0 right-0 z-10"><QuickActions /></div>
      </div>

      {/* Announcement */}
      <AnnouncementStrip />

      {/* Quick access */}
      <div>
        <SectionHeader title="Quick Access" action="See all" />
        <div className="flex flex-col gap-3">
          <PlaceholderCard
            title="Today's Devotional"
            subtitle="Start your day with a short reflection from the Word."
          />
          <PlaceholderCard
            title="Prayer Requests"
            subtitle="Submit or view prayer needs from your community."
          />
          <PlaceholderCard
            title="Upcoming Events"
            subtitle="Browse and register for church events near you."
          />
        </div>
      </div>
      {/* Detail content is mounted on demand while the shared shell remains visible. */}
      {selectedPost && <PostDetailView post={selectedPost} onClose={closePost} />}
    </div>
  );
};

export default HomeFeedView;
