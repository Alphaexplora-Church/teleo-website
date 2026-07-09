import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  Dispatch,
  KeyboardEvent,
  PointerEvent,
  SetStateAction,
} from 'react';
import {
  PRAYERS,
  PRAYER_GESTURE,
  PRAYER_RESPONSES,
  type Prayer,
} from '../models/Prayer';

interface PointerDragState {
  pointerId: number;
  startX: number;
  currentX: number;
  startTime: number;
  moved: boolean;
}

export interface PrayerWallViewModel {
  topCard: Prayer | null;
  cardsBehind: Prayer[];
  dragOffsetX: number;
  isDragging: boolean;
  isLeaving: boolean;
  isFlipped: boolean;
  isLiked: boolean;
  isPrayed: boolean;
  isPrayerMenuOpen: boolean;
  prayerResponses: readonly string[];
  selectedPrayerResponse: string | null;
  handleActionPointerDown: (event: PointerEvent<HTMLElement>) => void;
  handleCardKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
  toggleFlip: () => void;
  toggleLike: () => void;
  togglePray: () => void;
  selectPrayerResponse: (response: string) => void;
  refreshPrayers: () => void;
}

export const usePrayerWallViewModel = (): PrayerWallViewModel => {
  const [cards, setCards] = useState(PRAYERS);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [likedCardIds, setLikedCardIds] = useState<Record<string, boolean>>({});
  const [prayedCardIds, setPrayedCardIds] = useState<Record<string, boolean>>({});
  const [prayerResponsesByCard, setPrayerResponsesByCard] = useState<
    Record<string, string>
  >({});
  const [isPrayerMenuOpen, setIsPrayerMenuOpen] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const dragRef = useRef<PointerDragState | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const topCard = cards[0] ?? null;
  const cardsBehind = useMemo(() => cards.slice(1, 4), [cards]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

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
  const toggleLike = () => toggleRecord(setLikedCardIds);
  const togglePray = () => setIsPrayerMenuOpen((current) => !current);

  const selectPrayerResponse = (response: string) => {
    if (!topCard) {
      return;
    }

    setPrayedCardIds((current) => ({
      ...current,
      [topCard.id]: true,
    }));
    setPrayerResponsesByCard((current) => ({
      ...current,
      [topCard.id]: response,
    }));
    setIsPrayerMenuOpen(false);
  };

  const completeSwipe = (direction: 'left' | 'right') => {
    setIsDragging(false);
    setIsLeaving(true);
    setIsPrayerMenuOpen(false);
    setDragOffsetX(
      direction === 'right'
        ? PRAYER_GESTURE.exitDistance
        : -PRAYER_GESTURE.exitDistance,
    );

    exitTimerRef.current = window.setTimeout(() => {
      setCards(([, ...rest]) => rest);
      setDragOffsetX(0);
      setIsLeaving(false);
      exitTimerRef.current = null;
    }, PRAYER_GESTURE.exitDuration);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isLeaving || !topCard) {
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
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || isLeaving) {
      return;
    }

    const nextOffset = event.clientX - drag.startX;
    drag.currentX = event.clientX;
    drag.moved ||= Math.abs(nextOffset) > PRAYER_GESTURE.clickTolerance;
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

    const distance = drag.currentX - drag.startX;
    const elapsed = Math.max(performance.now() - drag.startTime, 1);
    const velocity = distance / elapsed;
    dragRef.current = null;

    // Movement inside the click tolerance flips; deliberate travel swipes.
    if (!drag.moved) {
      setIsDragging(false);
      setDragOffsetX(0);
      toggleFlip();
      return;
    }

    const passedDistance = Math.abs(distance) >= PRAYER_GESTURE.swipeDistance;
    const passedFlick =
      Math.abs(distance) >= PRAYER_GESTURE.flickDistance &&
      Math.abs(velocity) >= PRAYER_GESTURE.flickVelocity;

    if (passedDistance || passedFlick) {
      completeSwipe(distance > 0 ? 'right' : 'left');
      return;
    }

    setIsDragging(false);
    setDragOffsetX(0);
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

  const refreshPrayers = () => {
    setCards(PRAYERS);
    setFlippedCardIds({});
    setLikedCardIds({});
    setPrayedCardIds({});
    setPrayerResponsesByCard({});
    setIsPrayerMenuOpen(false);
    setDragOffsetX(0);
    setIsDragging(false);
    setIsLeaving(false);
  };

  return {
    topCard,
    cardsBehind,
    dragOffsetX,
    isDragging,
    isLeaving,
    isFlipped: topCard ? Boolean(flippedCardIds[topCard.id]) : false,
    isLiked: topCard ? Boolean(likedCardIds[topCard.id]) : false,
    isPrayed: topCard ? Boolean(prayedCardIds[topCard.id]) : false,
    isPrayerMenuOpen,
    prayerResponses: PRAYER_RESPONSES,
    selectedPrayerResponse: topCard
      ? prayerResponsesByCard[topCard.id] ?? null
      : null,
    handleActionPointerDown,
    handleCardKeyDown,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    toggleFlip,
    toggleLike,
    togglePray,
    selectPrayerResponse,
    refreshPrayers,
  };
};
