import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUserId,
  getPrayerCardsPage,
  sortPrayerCardsByRecent,
  type PrayerCard,
} from '../models/Prayer';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

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
  const [historyFilter, setHistoryFilter] = useState<'others' | 'mine'>('others');
  const [allPrayers, setAllPrayers] = useState<PrayerCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const page = await getPrayerCardsPage();
        setAllPrayers(page.prayers);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
      } catch (error) {
        setAllPrayers([]);
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load prayer history.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadMorePrayers = async () => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const page = await getPrayerCardsPage(nextCursor);
      setAllPrayers((current) => mergeUniquePrayers(current, page.prayers));
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load more prayer history.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const currentUserId = getCurrentUserId();
  const prayers =
    historyFilter === 'others'
      ? allPrayers.filter((prayer) => prayer.ownerId !== currentUserId)
      : allPrayers.filter((prayer) => prayer.ownerId === currentUserId);

  return {
    historyFilter,
    prayers,
    isLoading,
    isLoadingMore,
    hasMore,
    errorMessage,
    setHistoryFilter,
    loadMorePrayers,
    goBack: () => navigate(-1),
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
