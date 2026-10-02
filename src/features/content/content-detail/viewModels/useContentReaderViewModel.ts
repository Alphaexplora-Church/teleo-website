// ViewModel Layer: Owns all state, effects, and media/scroll restoration

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReaderChapterDetail } from '../models/contentReaderTypes';
import { fetchSeriesDetail, startPart, completePart, savePartReadingProgress } from '../../models/contentApi';

export const useContentReaderViewModel = (seriesId?: string, partId?: string) => {
  const [chapter, setChapter] = useState<ReaderChapterDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLIFrameElement | HTMLVideoElement | null>(null);
  const furthestReadProgressRef = useRef(0);
  const saveProgressTimerRef = useRef<number | null>(null);

  // Opening a Part records the resume target. Completion is intentionally
  // deferred until the member chooses Next Chapter.
  useEffect(() => {
    if (!seriesId || !partId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const series = await fetchSeriesDetail(seriesId);
        if (cancelled) return;

        const index = series.parts.findIndex((part) => part.part_id === partId);
        if (index === -1) {
          setError('This part is no longer available.');
          setLoading(false);
          return;
        }

        const part = series.parts[index];

        setChapter({
          part_id: part.part_id,
          series_id: seriesId,
          part_order: part.part_order,
          title: part.title,
          series_title: series.title,
          total_parts: series.parts.length,
          media_url: part.media_url,
          media_type: part.media_type,
          media_duration_seconds: part.media_duration_seconds,
          reading_text: part.reading_text,
          estimated_read_time_minutes: part.estimated_read_time_minutes,
          is_completed: part.is_completed === true,
          last_scroll_percentage: part.last_scroll_percentage ?? 0,
          previous_part_id: index > 0 ? series.parts[index - 1].part_id : null,
          next_part_id: index < series.parts.length - 1 ? series.parts[index + 1].part_id : null,
        });
        const savedReadProgress = Math.min(100, Math.max(0, Number(part.last_scroll_percentage) || 0));
        furthestReadProgressRef.current = savedReadProgress;
        setReadProgress(savedReadProgress);
        setIsCompleted(part.is_completed === true);
        setLoading(false);

        try {
          await startPart(seriesId, partId);
        } catch {
          // Reading may continue, but do not claim the resume target saved.
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this part.');
        setLoading(false);
      }
    };

    void load();

    return () => { cancelled = true; };
  }, [seriesId, partId]);

  const applyCompleted = useCallback(async (next: boolean): Promise<boolean> => {
    if (!seriesId || !partId) return false;

    setIsCompleted(next);
    setIsSaving(true);

    try {
      await completePart(seriesId, partId, next);
      if (next) {
        furthestReadProgressRef.current = 100;
        setReadProgress(100);
      }
      return true;
    } catch {
      setIsCompleted(!next);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [seriesId, partId]);

  const persistReadProgress = useCallback((percentage: number, keepalive = false) => {
    if (!seriesId || !partId || percentage <= 0) return;
    void savePartReadingProgress(seriesId, partId, percentage, keepalive).catch(() => undefined);
  }, [seriesId, partId]);

  const scheduleReadProgressSave = useCallback((percentage: number) => {
    if (saveProgressTimerRef.current !== null) {
      window.clearTimeout(saveProgressTimerRef.current);
    }
    saveProgressTimerRef.current = window.setTimeout(() => {
      saveProgressTimerRef.current = null;
      persistReadProgress(percentage);
    }, 600);
  }, [persistReadProgress]);

  // Restore the member's saved location after the reading content has rendered.
  useEffect(() => {
    if (!chapter || !chapter.last_scroll_percentage) return;

    const savedPercentage = Math.min(100, Math.max(0, chapter.last_scroll_percentage));
    const frame = window.requestAnimationFrame(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        window.scrollTo(0, Math.round((savedPercentage / 100) * totalHeight));
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [chapter]);

  // Flush the latest reading point when the reader closes or the app navigates
  // away, including browser page-hide transitions.
  useEffect(() => {
    const flushReadProgress = () => {
      if (saveProgressTimerRef.current !== null) {
        window.clearTimeout(saveProgressTimerRef.current);
        saveProgressTimerRef.current = null;
      }
      persistReadProgress(furthestReadProgressRef.current, true);
    };

    window.addEventListener('pagehide', flushReadProgress);
    return () => {
      window.removeEventListener('pagehide', flushReadProgress);
      flushReadProgress();
    };
  }, [persistReadProgress]);

  // Keep the furthest position read in this Part and persist it after scrolling
  // settles. Journey-level progress combines this with completed Parts.
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const progressPercent = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
    const furthestReadProgress = Math.max(furthestReadProgressRef.current, progressPercent);
    if (furthestReadProgress > furthestReadProgressRef.current) {
      furthestReadProgressRef.current = furthestReadProgress;
      setReadProgress(furthestReadProgress);
      scheduleReadProgressSave(furthestReadProgress);
    }

  }, [scheduleReadProgressSave]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleToggleCompleted = () => {
    void applyCompleted(!isCompleted);
  };

  const handleAdvanceChapter = useCallback(async (): Promise<boolean> => {
    return applyCompleted(true);
  }, [applyCompleted]);

  return {
    chapter,
    loading,
    error,
    readProgress,
    isCompleted,
    isSaving,
    contentContainerRef,
    videoPlayerRef,
    handleToggleCompleted,
    handleAdvanceChapter,
  };
};
