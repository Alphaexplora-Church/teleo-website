import { useEffect, useState } from 'react';
import { HERO_SLIDES, HOME_POSTS } from '../models/homeTypes';
import type { FeedPostModel } from '../models/homeTypes';

export const useHomeViewModel = () => {
  // Business-facing screen state is coordinated here so HomeFeedView remains
  // a declarative composition of presentational components.
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<FeedPostModel | null>(null);

  useEffect(() => {
    // Functional state updates avoid stale carousel indices between intervals.
    const timer = window.setInterval(
      () => setActiveHeroIndex((current) => (current + 1) % HERO_SLIDES.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);

  return {
    activeHeroIndex,
    setActiveHeroIndex,
    heroSlides: HERO_SLIDES,
    posts: HOME_POSTS,
    selectedPost,
    openPost: (post: FeedPostModel) => setSelectedPost(post),
    // The hero points to the same event model used by the feed, keeping both
    // entry points synchronized without duplicating detail-page content.
    openEventPost: () => setSelectedPost(HOME_POSTS.find((post) => post.id === 'event') ?? null),
    closePost: () => setSelectedPost(null),
  };
};
