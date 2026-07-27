import { useEffect, useMemo, useState } from 'react';
import { fetchTodaysGospel } from '../models/gospelApi';
import {
  buildHeroSlides,
  fetchHomeFeed,
  isEventWithinFifteenDays,
} from '../models/homeApi';
import type { DailyGospel } from '../models/gospelTypes';
import type { FeedPostModel } from '../models/homeTypes';

export const useHomeViewModel = () => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [feedPosts, setFeedPosts] = useState<FeedPostModel[]>([]);
  const [selectedPost, setSelectedPost] = useState<FeedPostModel | null>(null);
  const [dailyGospel, setDailyGospel] = useState<DailyGospel | null>(null);
  const [isGospelLoading, setIsGospelLoading] = useState(true);
  const [gospelError, setGospelError] = useState<string | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadFeed = async () => {
      setIsFeedLoading(true);
      setFeedError(null);

      try {
        const posts = await fetchHomeFeed();
        if (isCurrent) setFeedPosts(posts);
      } catch (error) {
        if (isCurrent) {
          setFeedError(
            error instanceof Error ? error.message : 'Unable to load the home feed.',
          );
        }
      } finally {
        if (isCurrent) setIsFeedLoading(false);
      }
    };

    void loadFeed();
    return () => {
      isCurrent = false;
    };
  }, []);

  const heroSlides = useMemo(() => buildHeroSlides(feedPosts), [feedPosts]);
  const posts = useMemo(
    () => feedPosts.filter((post) => !isEventWithinFifteenDays(post)),
    [feedPosts],
  );

  useEffect(() => {
    setActiveHeroIndex((current) =>
      current < heroSlides.length ? current : 0,
    );

    if (heroSlides.length < 2) return;

    const timer = window.setInterval(
      () =>
        setActiveHeroIndex((current) => (current + 1) % heroSlides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    let isActive = true;

    const loadGospel = async () => {
      try {
        const gospel = await fetchTodaysGospel();
        if (!isActive) return;
        setDailyGospel(gospel);
        setGospelError(null);
      } catch (error) {
        if (!isActive) return;
        setDailyGospel(null);
        setGospelError(
          error instanceof Error
            ? error.message
            : 'Unable to load Gospel of the day.',
        );
      } finally {
        if (isActive) setIsGospelLoading(false);
      }
    };

    void loadGospel();

    return () => {
      isActive = false;
    };
  }, []);

  return {
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
    openPost: (post: FeedPostModel) => setSelectedPost(post),
    openEventPost: (postId: string) =>
      setSelectedPost(feedPosts.find((post) => post.id === postId) ?? null),
    closePost: () => setSelectedPost(null),
  };
};
