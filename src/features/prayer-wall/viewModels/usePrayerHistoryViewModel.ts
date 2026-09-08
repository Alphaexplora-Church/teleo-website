import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUserId,
  getPrayerCardsPage,
  getBookmarkedPrayersPage,
  removePrayerBookmark,
  sortPrayerCardsByRecent,
} from '../models/prayerApi';
import type { PrayerCard } from '../models/prayerTypes';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

export type PrayerHistoryFilter = 'others' | 'mine' | 'bookmarks';

const mergeUniquePrayers = (
  currentPrayers: PrayerCard[],
  nextPrayers: PrayerCard[],
) => {
  const currentIds = new Set(currentPrayers.map((prayer) => prayer.id));
  const uniqueNextPrayers = nextPrayers.filter((prayer) => !currentIds.has(prayer.id));

  return sortPrayerCardsByRecent([...currentPrayers, ...uniqueNextPrayers]);
};

export const usePrayerHistoryViewModel = () => {
  const navigate = useNavigate();
  const [historyFilter, setHistoryFilter] = useState<PrayerHistoryFilter>('others');
  
  // Feed prayers state
  const [allPrayers, setAllPrayers] = useState<PrayerCard[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreFeed, setHasMoreFeed] = useState(false);

  // Bookmarked prayers state
  const [bookmarkedPrayers, setBookmarkedPrayers] = useState<PrayerCard[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [isLoadingMoreBookmarks, setIsLoadingMoreBookmarks] = useState(false);
  const [bookmarkCursor, setBookmarkCursor] = useState<string | null>(null);
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState(false);
  const [hasLoadedBookmarksOnce, setHasLoadedBookmarksOnce] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial load for feed prayers
  useEffect(() => {
    void (async () => {
      setIsLoadingFeed(true);
      setErrorMessage(null);

      try {
        const page = await getPrayerCardsPage();
        setAllPrayers(page.prayers);
        setNextCursor(page.nextCursor);
        setHasMoreFeed(page.hasMore);
      } catch (error) {
        setAllPrayers([]);
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load prayer history.',
        );
      } finally {
        setIsLoadingFeed(false);
      }
    })();
  }, []);

  // Fetch bookmarks when switching to bookmarks tab
  const fetchBookmarks = useCallback(async () => {
    setIsLoadingBookmarks(true);
    setErrorMessage(null);

    try {
      const page = await getBookmarkedPrayersPage();
      setBookmarkedPrayers(page.prayers);
      setBookmarkCursor(page.nextCursor);
      setHasMoreBookmarks(page.hasMore);
      setHasLoadedBookmarksOnce(true);
    } catch (error) {
      setBookmarkedPrayers([]);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load bookmarks.',
      );
    } finally {
      setIsLoadingBookmarks(false);
    }
  }, []);

  useEffect(() => {
    if (historyFilter === 'bookmarks' && !hasLoadedBookmarksOnce) {
      void fetchBookmarks();
    }
  }, [historyFilter, hasLoadedBookmarksOnce, fetchBookmarks]);

  const loadMorePrayers = async () => {
    if (historyFilter === 'bookmarks') {
      if (!hasMoreBookmarks || isLoadingBookmarks || isLoadingMoreBookmarks) {
        return;
      }
      setIsLoadingMoreBookmarks(true);
      setErrorMessage(null);
      try {
        const page = await getBookmarkedPrayersPage(bookmarkCursor);
        setBookmarkedPrayers((current) => mergeUniquePrayers(current, page.prayers));
        setBookmarkCursor(page.nextCursor);
        setHasMoreBookmarks(page.hasMore);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load more bookmarks.',
        );
      } finally {
        setIsLoadingMoreBookmarks(false);
      }
    } else {
      if (!hasMoreFeed || isLoadingFeed || isLoadingMoreFeed) {
        return;
      }
      setIsLoadingMoreFeed(true);
      setErrorMessage(null);
      try {
        const page = await getPrayerCardsPage(nextCursor);
        setAllPrayers((current) => mergeUniquePrayers(current, page.prayers));
        setNextCursor(page.nextCursor);
        setHasMoreFeed(page.hasMore);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load more prayer history.',
        );
      } finally {
        setIsLoadingMoreFeed(false);
      }
    }
  };

  const removeBookmarkItem = async (prayerId: string) => {
    setBookmarkedPrayers((current) => current.filter((p) => p.id !== prayerId));
    try {
      await removePrayerBookmark(prayerId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to remove bookmark.',
      );
      void fetchBookmarks();
    }
  };

  const currentUserId = getCurrentUserId();
  const prayers =
    historyFilter === 'bookmarks'
      ? bookmarkedPrayers
      : historyFilter === 'others'
      ? allPrayers.filter((prayer) => prayer.ownerId !== currentUserId)
      : allPrayers.filter((prayer) => prayer.ownerId === currentUserId);

  const isLoading = historyFilter === 'bookmarks' ? isLoadingBookmarks : isLoadingFeed;
  const isLoadingMore =
    historyFilter === 'bookmarks' ? isLoadingMoreBookmarks : isLoadingMoreFeed;
  const hasMore = historyFilter === 'bookmarks' ? hasMoreBookmarks : hasMoreFeed;

  return {
    historyFilter,
    prayers,
    isLoading,
    isLoadingMore,
    hasMore,
    errorMessage,
    setHistoryFilter,
    loadMorePrayers,
    removeBookmarkItem,
    refreshBookmarks: fetchBookmarks,
    goBack: () => navigate(-1),
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};

