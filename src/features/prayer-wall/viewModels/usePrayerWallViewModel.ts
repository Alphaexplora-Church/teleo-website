import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  Dispatch,
  KeyboardEvent,
  PointerEvent,
  SetStateAction,
} from 'react';
import { createPrayerComment } from '../models/commentApi';
import {
  getPrayerCardsPage,
  sortPrayerCardsByRecent,
  togglePrayerReaction,
} from '../models/prayerApi';
import type { PrayerCard } from '../models/prayerTypes';

const PRAYER_GESTURE = {
  swipeDistance: 90,
  clickTolerance: 7,
  flickDistance: 36,
  flickVelocity: 0.65,
  dragLimit: 190,
} as const;

// Temporary switch: taps still flip the card, while horizontal swipes are no-ops.
const HORIZONTAL_SWIPE_ENABLED = true; // set to false to disable horizontal swipes and only allow taps to flip the card

const PRAYER_RESPONSES = [
  'I have prayed for you 🙏',
  'Wishing you the best 🤞',
  'Sending you positive thoughts ✨',
  "I'm holding you in my prayers today 💛🤲",
  'Sending you strength and support! 💪',
] as const;

const COMMENT_SENT_INDICATOR_MS = 2000;

type PrayerCommentStatus = 'sending' | 'sent';

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
  isLiked: boolean;
  isPrayed: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isOutOfPosts: boolean;
  isPrayerMenuOpen: boolean;
  prayerResponses: readonly string[];
  selectedPrayerResponse: string | null;
  selectedPrayerCommentStatus: PrayerCommentStatus | null;
  errorMessage: string | null;
  handleActionPointerDown: (event: PointerEvent<HTMLElement>) => void;
  handleCardKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  toggleFlip: () => void;
  toggleLike: () => Promise<void>;
  togglePrayerMenu: () => void;
  selectPrayerResponse: (response: string) => Promise<void>;
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

export const usePrayerWallViewModel = (): PrayerWallViewModel => {
  const [cards, setCards] = useState<PrayerCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [likedCardIds, setLikedCardIds] = useState<Record<string, boolean>>({});
  const [prayedCardIds, setPrayedCardIds] = useState<Record<string, boolean>>({});
  const [prayerResponsesByCard, setPrayerResponsesByCard] = useState<
    Record<string, string>
  >({});
  const [prayerCommentStatusByCard, setPrayerCommentStatusByCard] = useState<
    Record<string, PrayerCommentStatus>
  >({});
  const [isPrayerMenuOpen, setIsPrayerMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dragRef = useRef<PointerDragState | null>(null);
  const sentIndicatorTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const topCard = cards[currentIndex] ?? null;
  const isOutOfPosts = cards.length > 0 && currentIndex >= cards.length;
  const cardsBehind = useMemo(
    () => cards.slice(currentIndex + 1, currentIndex + 4),
    [cards, currentIndex],
  );

  useEffect(() => {
    void (async () => {
      await refreshPrayers();
    })();

    return () => {
      Object.values(sentIndicatorTimersRef.current).forEach(clearTimeout);
    };
  }, []);

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
  const toggleLike = async () => {
    if (!topCard) {
      return;
    }

    const nextLikedState = !likedCardIds[topCard.id];

    setLikedCardIds((current) => ({
      ...current,
      [topCard.id]: nextLikedState,
    }));

    try {
      await togglePrayerReaction(topCard.id, 'HEART');
      setErrorMessage(null);
    } catch (error) {
      setLikedCardIds((current) => ({
        ...current,
        [topCard.id]: !nextLikedState,
      }));
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to react to this prayer.',
      );
    }
  };
  const togglePrayerMenu = () => {
    if (!topCard) {
      return;
    }

    setIsPrayerMenuOpen((current) => !current);
  };

  const selectPrayerResponse = async (response: string) => {
    if (!topCard) {
      return;
    }

    const wasPrayed = Boolean(prayedCardIds[topCard.id]);
    const previousResponse = prayerResponsesByCard[topCard.id] ?? null;

    setPrayedCardIds((current) => ({
      ...current,
      [topCard.id]: true,
    }));
    setPrayerResponsesByCard((current) => ({
      ...current,
      [topCard.id]: response,
    }));
    setPrayerCommentStatusByCard((current) => ({
      ...current,
      [topCard.id]: 'sending',
    }));
    clearTimeout(sentIndicatorTimersRef.current[topCard.id]);
    delete sentIndicatorTimersRef.current[topCard.id];
    setIsPrayerMenuOpen(false);

    if (wasPrayed) {
      setPrayerCommentStatusByCard((current) => ({
        ...current,
        [topCard.id]: 'sent',
      }));
      sentIndicatorTimersRef.current[topCard.id] = setTimeout(() => {
        setPrayedCardIds((current) => ({
          ...current,
          [topCard.id]: false,
        }));
        setPrayerResponsesByCard((current) => {
          const { [topCard.id]: _removedResponse, ...rest } = current;
          return rest;
        });
        setPrayerCommentStatusByCard((current) => {
          const { [topCard.id]: _removedStatus, ...rest } = current;
          return rest;
        });
        delete sentIndicatorTimersRef.current[topCard.id];
      }, COMMENT_SENT_INDICATOR_MS);
      return;
    }

    try {
      const newComment = await createPrayerComment(topCard.id, response);

      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === topCard.id
            ? {
                ...card,
                comments: card.comments.some((comment) => comment.id === newComment.id)
                  ? card.comments
                  : [...card.comments, newComment],
              }
            : card,
        ),
      );
      await togglePrayerReaction(topCard.id, 'PRAYING');
      setPrayerCommentStatusByCard((current) => ({
        ...current,
        [topCard.id]: 'sent',
      }));
      sentIndicatorTimersRef.current[topCard.id] = setTimeout(() => {
        setPrayedCardIds((current) => ({
          ...current,
          [topCard.id]: false,
        }));
        setPrayerResponsesByCard((current) => {
          const { [topCard.id]: _removedResponse, ...rest } = current;
          return rest;
        });
        setPrayerCommentStatusByCard((current) => {
          const { [topCard.id]: _removedStatus, ...rest } = current;
          return rest;
        });
        delete sentIndicatorTimersRef.current[topCard.id];
      }, COMMENT_SENT_INDICATOR_MS);
      setErrorMessage(null);
    } catch (error) {
      setPrayedCardIds((current) => ({
        ...current,
        [topCard.id]: false,
      }));
      setPrayerResponsesByCard((current) => {
        if (previousResponse) {
          return {
            ...current,
            [topCard.id]: previousResponse,
          };
        }

        const { [topCard.id]: _removedResponse, ...rest } = current;
        return rest;
      });
      setPrayerCommentStatusByCard((current) => {
        const { [topCard.id]: _removedStatus, ...rest } = current;
        return rest;
      });
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to send your prayer reaction.',
      );
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
    setIsPrayerMenuOpen(false);

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

    // Movement inside the click tolerance is still treated as a tap.
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
    setLikedCardIds({});
    setPrayedCardIds({});
    setPrayerResponsesByCard({});
    setPrayerCommentStatusByCard({});
    Object.values(sentIndicatorTimersRef.current).forEach(clearTimeout);
    sentIndicatorTimersRef.current = {};
    setIsPrayerMenuOpen(false);
    setCurrentIndex(0);
    setDragOffsetX(0);
    setIsDragging(false);
  };

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
    isLiked: topCard ? Boolean(likedCardIds[topCard.id]) : false,
    isPrayed: topCard ? Boolean(prayedCardIds[topCard.id]) : false,
    isLoading,
    isLoadingMore,
    isOutOfPosts,
    isPrayerMenuOpen,
    prayerResponses: PRAYER_RESPONSES,
    selectedPrayerResponse: topCard
      ? prayerResponsesByCard[topCard.id] ?? null
      : null,
    selectedPrayerCommentStatus: topCard
      ? prayerCommentStatusByCard[topCard.id] ?? null
      : null,
    errorMessage,
    handleActionPointerDown,
    handleCardKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    toggleFlip,
    toggleLike,
    togglePrayerMenu,
    selectPrayerResponse,
    refreshPrayers,
  };
};
