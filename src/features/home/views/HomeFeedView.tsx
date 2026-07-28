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
    <div className="min-h-full lg:bg-[#f3f4f6]">
      <div className="bg-white pb-3 text-[#111] lg:bg-transparent lg:flex lg:justify-center lg:gap-8 lg:p-8 lg:max-w-[1024px] lg:mx-auto">
        
        {/* Main Feed Column */}
        <div className="lg:w-full lg:max-w-[600px] lg:shrink-0 lg:bg-white lg:rounded-2xl lg:shadow-[0_4px_24px_rgba(27,50,82,0.06)] lg:overflow-hidden lg:pb-6">
          {/* Mobile Top Area — navy blue bg with overlapping quick action cards */}
          <div className="relative lg:hidden mx-2 mt-2 rounded-[24px] bg-[#001739] px-2 pt-2 pb-16 shadow-[0_8px_24px_rgba(0,23,57,0.22)]">
            <GospelCard
              slides={heroSlides}
              activeIndex={activeHeroIndex}
              dailyGospel={dailyGospel}
              isGospelLoading={isGospelLoading}
              gospelError={gospelError}
              onSlideChange={setActiveHeroIndex}
              onEventOpen={openEventPost}
            />
            {/* QuickActions overlap the bottom edge of the navy section */}
            <div className="absolute -bottom-10 left-0 right-0 z-10"><QuickActions /></div>
          </div>

          <div className="bg-white pt-14 lg:pt-0">
            {posts.map((post, index) => <FeedPost key={post.id} post={post} first={index === 0} onOpen={() => openPost(post)} />)}
          </div>
        </div>

        {/* Right Sidebar (Desktop only) */}
        <div className="hidden lg:flex lg:w-[350px] lg:shrink-0 lg:flex-col lg:gap-8">
          <div className="rounded-[20px] bg-[#001739] p-2 shadow-[0_8px_24px_rgba(0,23,57,0.15)]">
            <GospelCard
              slides={heroSlides}
              activeIndex={activeHeroIndex}
              dailyGospel={dailyGospel}
              isGospelLoading={isGospelLoading}
              gospelError={gospelError}
              onSlideChange={setActiveHeroIndex}
              onEventOpen={openEventPost}
            />
          </div>
          <div className="-mx-3">
            <QuickActions />
          </div>
        </div>

        {selectedPost && <PostDetailView post={selectedPost} onClose={closePost} />}
      </div>
      <div className="bg-white pt-14">
        {isFeedLoading && <p className="px-5 py-8 text-center text-sm text-[#757575]">Loading church updates…</p>}
        {!isFeedLoading && needsChurchMembership && (
          <section
            className="mx-auto flex w-full max-w-[371px] flex-col items-center px-5 py-8 text-center"
            aria-labelledby="find-church-heading"
          >
            <h2 id="find-church-heading" className="text-xl font-bold text-[#1f2156]">
              Let&apos;s find your church
            </h2>
            <p className="mt-2 max-w-[310px] text-sm leading-5 text-[#757575]">
              Connect with your church to see its latest announcements, events, and community updates.
            </p>
            <button
              type="button"
              onClick={onFindMyChurch}
              className="mt-5 flex h-[51px] w-[310px] shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-[#1f2156] transition-all duration-200 hover:scale-[1.02] hover:bg-[#2c2f6d] hover:shadow-lg active:scale-[0.98]"
            >
              <span className="flex items-center justify-center whitespace-nowrap text-center text-xl font-medium leading-6 tracking-[0] text-white">
                Find My Church
              </span>
            </button>
          </section>
        )}
        {!isFeedLoading && feedError && <p role="alert" className="mx-5 my-5 rounded-xl bg-[#FFF1F1] px-4 py-3 text-sm text-[#A11]">{feedError}</p>}
        {!isFeedLoading && !feedError && !needsChurchMembership && posts.length === 0 && <p className="px-5 py-8 text-center text-sm text-[#757575]">No announcements or later events yet.</p>}
        {posts.map((post, index) => <FeedPost key={post.id} post={post} first={index === 0} onOpen={() => openPost(post)} />)}
      </div>
      {/* Detail content is mounted on demand while the shared shell remains visible. */}
      {selectedPost && <PostDetailView post={selectedPost} onClose={closePost} />}
    </div>
  );
};

export default HomeFeedView;
