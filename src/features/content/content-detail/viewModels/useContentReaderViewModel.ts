// ViewModel Layer: Owns all state, effects, and media/scroll restoration

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReaderChapterDetail } from '../models/contentReaderTypes';
import { fetchSeriesDetail, startPart, completePart } from '../../models/contentApi';

export const useContentReaderViewModel = (seriesId?: string, partId?: string) => {
  const [chapter, setChapter] = useState<ReaderChapterDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLIFrameElement | HTMLVideoElement | null>(null);

  // Opening a Part is what enrolls the member, and the completion endpoint
  // rejects a Part that was never started, so the start call has to land
  // before anything here can be marked complete.
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
          previous_part_id: index > 0 ? series.parts[index - 1].part_id : null,
          next_part_id: index < series.parts.length - 1 ? series.parts[index + 1].part_id : null,
        });
        setIsCompleted(part.is_completed === true);
        setLoading(false);

        await startPart(seriesId, partId).catch(() => undefined);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this part.');
        setLoading(false);
      }
    };

    void load();

    return () => { cancelled = true; };
  }, [seriesId, partId]);

  const applyCompleted = useCallback(async (next: boolean) => {
    if (!seriesId || !partId) return;

    setIsCompleted(next);
    setIsSaving(true);

    try {
      await completePart(seriesId, partId, next);
    } catch {
      setIsCompleted(!next);
    } finally {
      setIsSaving(false);
    }
  }, [seriesId, partId]);

  // Scroll position drives the reading bar only. The progress API tracks
  // completion per Part and nothing finer, so there is no endpoint to
  // persist a scroll offset or a media timestamp against.
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const progressPercent = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
    setReadProgress(progressPercent);

    if (progressPercent >= 95 && !isCompleted && !isSaving) {
      void applyCompleted(true);
    }
  }, [isCompleted, isSaving, applyCompleted]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleToggleCompleted = () => {
    void applyCompleted(!isCompleted);
  };

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
  };
};
