import React from 'react';
import { useHomeViewModel } from '../viewModels/useHomeViewModel';
import GospelCard from './GospelCard';
import QuickActions from './QuickActions';
import FeedPost from './FeedPost';
import PostDetailView from './PostDetailView';

const HomeFeedView: React.FC = () => {
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
      <div className="bg-white pt-14">
        {isFeedLoading && <p className="px-5 py-8 text-center text-sm text-[#757575]">Loading church updates…</p>}
        {!isFeedLoading && feedError && <p role="alert" className="mx-5 my-5 rounded-xl bg-[#FFF1F1] px-4 py-3 text-sm text-[#A11]">{feedError}</p>}
        {!isFeedLoading && !feedError && posts.length === 0 && <p className="px-5 py-8 text-center text-sm text-[#757575]">No announcements or later events yet.</p>}
        {posts.map((post, index) => <FeedPost key={post.id} post={post} first={index === 0} onOpen={() => openPost(post)} />)}
      </div>
      {/* Detail content is mounted on demand while the shared shell remains visible. */}
      {selectedPost && <PostDetailView post={selectedPost} onClose={closePost} />}
    </div>
  );
};

export default HomeFeedView;
