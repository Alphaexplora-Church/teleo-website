// ViewModel Layer: Owns all state, effects, debounced persistence, and media/scroll restoration

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReaderChapterDetail } from '../models/contentReaderTypes';

export const useContentReaderViewModel = (seriesId?: string, partId?: string) => {
  const [chapter, setChapter] = useState<ReaderChapterDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLIFrameElement | HTMLVideoElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Fetch & Initialize Chapter Payload
  useEffect(() => {
    if (!seriesId || !partId) return;

    setLoading(true);
    // TODO: Wire API fetch from teleo_content.content_part JOIN user_part_progress
    const mockChapter: ReaderChapterDetail = {
      part_id: partId,
      series_id: seriesId,
      part_order: 1,
      title: 'The Foundation of Prayer & Community',
      series_title: '7 Days of Discipleship Foundation',
      church_name: 'Grace Community Church',
      total_parts: 7,
      media_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      media_type: 'youtube',
      media_duration_seconds: 720,
      reading_text: `### The Sacred Rhythm of Daily Devotion\n\nIn the noise of modern life, cultivating an unbroken communion with God is not an accident—it is an intentional rhythm. When Jesus taught His disciples how to pray, He did not hand them a legalistic checklist; He invited them into an ongoing, intimate conversation with the Father.\n\n> *"Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed."* — Mark 1:35\n\n#### Why Solitude Precedes Strength\n\nTrue spiritual fortitude is forged behind closed doors. Before public ministry, Christ prioritized private prayer. Reflect upon your daily margin: what distractions compete for your first thoughts in the morning?\n\nTake five minutes now to silence notifications, breathe deeply, and center your focus on God's abiding presence.`,
      estimated_read_time_minutes: 4,
      is_completed: false,
      last_scroll_percentage: 35,
      last_media_timestamp_seconds: 120,
      previous_part_id: null,
      next_part_id: 'p-2',
    };

    setChapter(mockChapter);
    setIsCompleted(mockChapter.is_completed);
    setReadProgress(mockChapter.last_scroll_percentage || 0);
    setLoading(false);
  }, [seriesId, partId]);

  // 2. Restore Text Scroll Position (Wattpad-style Resume)
  useEffect(() => {
    if (!loading && chapter?.last_scroll_percentage && contentContainerRef.current) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const targetScroll = (chapter.last_scroll_percentage / 100) * scrollHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, [loading, chapter]);

  // 3. Debounced Progress Syncer
  const persistProgress = useCallback((_scrollPct: number, _completedState: boolean) => {
    if (!seriesId || !partId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      // TODO: Call API mutation (teleo_content.user_part_progress UPSERT)
      // payload: { series_id, part_id, scroll_percentage: _scrollPct, is_completed: _completedState }
      setTimeout(() => setIsSaving(false), 500);
    }, 1000);
  }, [seriesId, partId]);

  // 4. Scroll Event Tracking
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const currentScroll = window.scrollY;
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));

    setReadProgress(progressPercent);

    // Auto-mark completed when member reaches bottom (95%+)
    const markAsFinished = isCompleted || progressPercent >= 95;
    if (markAsFinished && !isCompleted) {
      setIsCompleted(true);
    }

    persistProgress(progressPercent, markAsFinished);
  }, [isCompleted, persistProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [handleScroll]);

  // 5. Explicit Completion Handler
  const handleToggleCompleted = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    persistProgress(readProgress, nextState);
  };

  return {
    chapter,
    loading,
    readProgress,
    isCompleted,
    isSaving,
    contentContainerRef,
    videoPlayerRef,
    handleToggleCompleted,
  };
};
