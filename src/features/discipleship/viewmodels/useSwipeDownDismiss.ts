import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";

export interface UseSwipeDownDismissOptions {
  isOpen?: boolean;
  onClose?: () => void;
  threshold?: number;
}

export interface UseSwipeDownDismissReturn {
  dragOffsetY: number;
  isDragging: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  sheetStyle: CSSProperties;
}

/**
 * Reusable hook for mobile bottom-sheet modals with touch drag-to-dismiss gesture,
 * background body scroll locking, and Escape key dismissal.
 */
export function useSwipeDownDismiss({
  isOpen = false,
  onClose,
  threshold = 70,
}: UseSwipeDownDismissOptions = {}): UseSwipeDownDismissReturn {
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef(0);

  // Lock background body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset drag state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDragOffsetY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Keyboard accessibility: dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Touch handlers for swipe-down to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (dragOffsetY > threshold) {
      onClose?.();
    } else {
      setDragOffsetY(0);
    }
  }, [dragOffsetY, onClose, threshold]);

  const sheetStyle: CSSProperties = {
    transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
    transition: isDragging
      ? "none"
      : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return {
    dragOffsetY,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
  };
}

export default useSwipeDownDismiss;
