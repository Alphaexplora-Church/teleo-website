import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  Dispatch,
  KeyboardEvent,
  PointerEvent,
  SetStateAction,
} from 'react';
import {
  addPrayerBookmark,
  checkPrayerBookmark,
  getCurrentUserId,
  getPrayerCardsPage,
  isUserMinistryOrAdmin,
  removePrayerBookmark,
  sortPrayerCardsByRecent,
  togglePrayerReaction,
} from '../models/prayerApi';
import type { PrayerCard, PrayerReactionType } from '../models/prayerTypes';

const PRAYER_GESTURE = {
  swipeDistance: 90,
  clickTolerance: 7,
  flickDistance: 36,
  flickVelocity: 0.65,
  dragLimit: 190,
} as const;

const HORIZONTAL_SWIPE_ENABLED = true;

interface PointerDragState {
  pointerId: number;
  startX: number;
  currentX: number;
  startTime: number;
  moved: boolean;
}

export interface PrayerWallViewModel {
  topCard: PrayerCard | null;
  cardsBehind: PrayerCard[];
  dragOffsetX: number;
  isDragging: boolean;
  isFlipped: boolean;
  isPrayed: boolean;
  isBookmarked: boolean;
  isTogglingBookmark: boolean;
  isAdminOrMinistry: boolean;
  isOwnPrayerRequest: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isOutOfPosts: boolean;
  errorMessage: string | null;
  handleActionPointerDown: (event: PointerEvent<HTMLElement>) => void;
  handleCardKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  toggleFlip: () => void;
  togglePray: () => Promise<void>;
  toggleBookmark: () => Promise<void>;
  refreshPrayers: () => Promise<void>;
}

const mergeUniquePrayers = (
  currentPrayers: PrayerCard[],
  nextPrayers: PrayerCard[],
) => {
  const currentIds = new Set(currentPrayers.map((prayer) => prayer.id));
  const uniqueNextPrayers = nextPrayers.filter((prayer) => !currentIds.has(prayer.id));

  return sortPrayerCardsByRecent([...currentPrayers, ...uniqueNextPrayers]);
};

const getStoredPrayedCardIds = (userId: string | null): Record<string, boolean> => {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`teleo_prayed_cards_${userId}`);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

const saveStoredPrayedCardIds = (
  userId: string | null,
  ids: Record<string, boolean>,
) => {
  if (!userId) return;
  try {
    localStorage.setItem(`teleo_prayed_cards_${userId}`, JSON.stringify(ids));
  } catch {}
};

export const usePrayerWallViewModel = (): PrayerWallViewModel => {
  const currentUserId = getCurrentUserId();
  const [cards, setCards] = useState<PrayerCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [prayedCardIds, setPrayedCardIds] = useState<Record<string, boolean>>(() =>
    getStoredPrayedCardIds(getCurrentUserId()),
  );
  const [bookmarkedCardIds, setBookmarkedCardIds] = useState<Record<string, boolean>>({});
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(!cachedState);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(cachedState?.nextCursor ?? null);
  const [hasMore, setHasMore] = useState(cachedState?.hasMore ?? false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dragRef = useRef<PointerDragState | null>(null);

  const topCard = cards[currentIndex] ?? null;
  const isOutOfPosts = cards.length > 0 && currentIndex >= cards.length;
  const isAdminOrMinistry = useMemo(() => isUserMinistryOrAdmin(), []);

  const cardsBehind = useMemo(
    () => cards.slice(currentIndex + 1, currentIndex + 4),
    [cards, currentIndex],
  );

  useEffect(() => {
    void (async () => {
      await refreshPrayers();
    })();
  }, []);

  // Preload bookmark status for current top card
  useEffect(() => {
    if (!topCard) {
      return;
    }

    if (bookmarkedCardIds[topCard.id] === undefined) {
      void (async () => {
        try {
          const isSaved = await checkPrayerBookmark(topCard.id);
          setBookmarkedCardIds((current) => ({
            ...current,
            [topCard.id]: isSaved,
          }));
        } catch {
          // ignore background check failure
        }
      })();
    }
  }, [bookmarkedCardIds, topCard]);

  useEffect(() => {
    const remainingCards = cards.length - currentIndex - 1;

    if (!isLoading && remainingCards <= 3 && hasMore && !isLoadingMore) {
      void loadMorePrayers();
    }
  }, [cards.length, currentIndex, hasMore, isLoading, isLoadingMore, nextCursor]);

  const toggleRecord = (
    setter: Dispatch<SetStateAction<Record<string, boolean>>>,
  ) => {
    if (!topCard) {
      return;
    }

    setter((current) => ({
      ...current,
      [topCard.id]: !current[topCard.id],
    }));
  };

  const toggleFlip = () => toggleRecord(setFlippedCardIds);

  const togglePray = async () => {
    if (!topCard || topCard.isAnswered) {
      return;
    }

    if (topCard.ownerId === getCurrentUserId()) {
      return;
    }

    const reactionType: PrayerReactionType = isAdminOrMinistry ? 'PRAYED' : 'AMEN';
    const nextPrayedState = !prayedCardIds[topCard.id];
    const nextPrayedMap = {
      ...prayedCardIds,
      [topCard.id]: nextPrayedState,
    };

    setPrayedCardIds(nextPrayedMap);
    saveStoredPrayedCardIds(currentUserId, nextPrayedMap);

    if (isAdminOrMinistry) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === topCard.id
            ? { ...card, isPrayedByChurch: nextPrayedState }
            : card,
        ),
      );
    }

    try {
      await togglePrayerReaction(topCard.id, reactionType);
      setErrorMessage(null);
    } catch (error) {
      const revertedPrayedMap = {
        ...prayedCardIds,
        [topCard.id]: !nextPrayedState,
      };
      setPrayedCardIds(revertedPrayedMap);
      saveStoredPrayedCardIds(currentUserId, revertedPrayedMap);
      if (isAdminOrMinistry) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.id === topCard.id
              ? { ...card, isPrayedByChurch: !nextPrayedState }
              : card,
          ),
        );
      }
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to react to this prayer.',
      );
    }
  };

  const toggleBookmark = async () => {
    if (!topCard || isTogglingBookmark) {
      return;
    }

    const currentBookmarked = Boolean(bookmarkedCardIds[topCard.id]);
    const nextBookmarked = !currentBookmarked;

    setIsTogglingBookmark(true);
    setBookmarkedCardIds((current) => ({
      ...current,
      [topCard.id]: nextBookmarked,
    }));

    try {
      if (nextBookmarked) {
        await addPrayerBookmark(topCard.id);
      } else {
        await removePrayerBookmark(topCard.id);
      }
      setErrorMessage(null);
    } catch (error) {
      setBookmarkedCardIds((current) => ({
        ...current,
        [topCard.id]: currentBookmarked,
      }));
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update bookmark.',
      );
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  const resetDragState = () => {
    setIsDragging(false);
    setDragOffsetX(0);
  };

  const advanceBySwipe = () => {
    if (!topCard) {
      return;
    }

    resetDragState();

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((index) => Math.min(index + 1, cards.length - 1));
      return;
    }

    if (hasMore) {
      void loadMorePrayers(true);
      return;
    }

    setCurrentIndex(cards.length);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!topCard) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
      startTime: performance.now(),
      moved: false,
    };
    setIsDragging(HORIZONTAL_SWIPE_ENABLED);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const nextOffset = event.clientX - drag.startX;
    drag.currentX = event.clientX;
    drag.moved ||= Math.abs(nextOffset) > PRAYER_GESTURE.clickTolerance;

    if (!HORIZONTAL_SWIPE_ENABLED) {
      return;
    }

    setDragOffsetX(
      Math.max(
        -PRAYER_GESTURE.dragLimit,
        Math.min(PRAYER_GESTURE.dragLimit, nextOffset),
      ),
    );
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;

    if (!drag.moved) {
      resetDragState();
      toggleFlip();
      return;
    }

    if (!HORIZONTAL_SWIPE_ENABLED) {
      resetDragState();
      return;
    }

    const distance = drag.currentX - drag.startX;
    const elapsed = Math.max(performance.now() - drag.startTime, 1);
    const velocity = distance / elapsed;
    const passedDistance = Math.abs(distance) >= PRAYER_GESTURE.swipeDistance;
    const passedFlick =
      Math.abs(distance) >= PRAYER_GESTURE.flickDistance &&
      Math.abs(velocity) >= PRAYER_GESTURE.flickVelocity;

    if (passedDistance || passedFlick) {
      advanceBySwipe();
      return;
    }

    resetDragState();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    setIsDragging(false);
    setDragOffsetX(0);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (topCard && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleFlip();
    }
  };

  const handleActionPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  async function refreshPrayers() {
    setIsLoading(true);
    setErrorMessage(null);
    setNextCursor(null);
    setHasMore(false);

    try {
      const page = await getPrayerCardsPage();
      setCards(page.prayers);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (error) {
      setCards([]);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load the Prayer Wall.',
      );
    } finally {
      setIsLoading(false);
    }

    setFlippedCardIds({});
    setPrayedCardIds(getStoredPrayedCardIds(currentUserId));
    setBookmarkedCardIds({});
    setCurrentIndex(0);
    setDragOffsetX(0);
    setIsDragging(false);
  }

  async function loadMorePrayers(advanceAfterLoad = false) {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page = await getPrayerCardsPage(nextCursor);
      setCards((current) => {
        const merged = mergeUniquePrayers(current, page.prayers);

        if (advanceAfterLoad && merged.length > current.length) {
          setCurrentIndex((index) => Math.min(index + 1, merged.length - 1));
        }

        if (advanceAfterLoad && merged.length === current.length && !page.hasMore) {
          setCurrentIndex(current.length);
        }

        return merged;
      });
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load more prayers.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    topCard,
    cardsBehind,
    dragOffsetX,
    isDragging,
    isFlipped: topCard ? Boolean(flippedCardIds[topCard.id]) : false,
    isPrayed: topCard ? Boolean(prayedCardIds[topCard.id]) : false,
    isBookmarked: topCard ? Boolean(bookmarkedCardIds[topCard.id]) : false,
    isTogglingBookmark,
    isAdminOrMinistry,
    isOwnPrayerRequest: topCard ? topCard.ownerId === getCurrentUserId() : false,
    isLoading,
    isLoadingMore,
    isOutOfPosts,
    errorMessage,
    handleActionPointerDown,
    handleCardKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    toggleFlip,
    togglePray,
    toggleBookmark,
    refreshPrayers,
  };
};
