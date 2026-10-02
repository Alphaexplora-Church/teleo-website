// features/content/content-detail/viewModels/useContentDetailViewModel.ts
// ViewModel layer: manages series details, tabs, reading progress, and bookmark toggling.
// NO JSX. Returns only what the View needs.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContentSeriesDetail, ContentSeriesSummary } from '../../models/contentTypes';
import {
  fetchSeriesDetail,
  fetchJourneyProgress,
  fetchSimilarJourneys,
  recordJourneyView,
} from '../../models/contentApi';
import { addBookmarkApi, removeBookmarkApi, fetchMyListSeries } from '../../models/myListApi';
import { fetchChurchById } from '../../../profile/churchprofile/models/churchProfileApi';

export type ContentDetailTab = 'chapters' | 'preview' | 'more';

export interface ContentDetailViewModelReturn {
  detail: ContentSeriesDetail | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  activeTab: ContentDetailTab;
  hasProgress: boolean;
  completedCount: number;
  totalCount: number;
  nextIncompletePartOrder: number | null;
  resumePartOrder: number | null;
  churchName: string;
  previewSnippet: string | null;
  relatedSeries: ContentSeriesSummary[];
  sortedParts: ContentSeriesDetail['parts'];
  handleTabChange: (tab: ContentDetailTab) => void;
  handleToggleBookmark: () => void;
  handleSelectPart: (partId: string) => void;
  handlePrimaryReadAction: () => void;
}

function progressFromParts(parts: ContentSeriesDetail['parts']): number {
  if (parts.length === 0) return 0;

  const total = parts.reduce((sum, part) => {
    if (part.is_completed) return sum + 100;
    return sum + Math.min(100, Math.max(0, Number(part.last_scroll_percentage ?? 0)));
  }, 0);

  return Math.round(total / parts.length);
}

export const useContentDetailViewModel = (
  seriesId?: string
): ContentDetailViewModelReturn => {
  const [detail, setDetail] = useState<ContentSeriesDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ContentDetailTab>('chapters');
  const [churchName, setChurchName] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [relatedSeries, setRelatedSeries] = useState<ContentSeriesSummary[]>([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [resumePartId, setResumePartId] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const series = await fetchSeriesDetail(seriesId);
        if (cancelled) return;

        // Progress and bookmark state live on their own endpoints. Neither is
        // worth failing the screen over, so the journey renders regardless.
        const [progress, bookmarked] = await Promise.all([
          fetchJourneyProgress(seriesId).catch(() => null),
          fetchMyListSeries(null, 200)
            .then((list) => list.data.some((item) => item.series_id === seriesId))
            .catch(() => false),
        ]);
        if (cancelled) return;

        const savedPartProgress = progressFromParts(series.parts);

        setDetail({
          ...series,
          is_bookmarked: bookmarked,
          completed_parts: progress?.completed_parts ?? series.parts.filter((p) => p.is_completed).length,
          total_parts: progress?.total_parts ?? series.parts.length,
          // The detail response contains each Part's saved percentage. Keep
          // the visible bar truthful even when the separate summary request
          // is temporarily unavailable.
          percent_complete: progress?.percent_complete ?? savedPartProgress,
        });
        setResumePartId(progress?.resume_part_id ?? null);
        setLoading(false);

        void recordJourneyView(seriesId);

        fetchSimilarJourneys(seriesId)
          .then((rows) => {
            if (!cancelled) setRelatedSeries(rows.filter((row) => row.series_id !== seriesId));
          })
          .catch(() => undefined);

        fetchChurchById(series.church_id)
          .then((church) => { if (!cancelled) setChurchName(church.church_name); })
          .catch(() => undefined);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this journey.');
        setLoading(false);
      }
    };

    void load();

    return () => { cancelled = true; };
  }, [seriesId, reloadToken]);

  const hasProgress = useMemo(() => {
    return Boolean(resumePartId || (detail && (
      (detail.percent_complete ?? 0) > 0 ||
      detail.parts.some((part) => part.is_completed || (part.last_scroll_percentage ?? 0) > 0)
    )));
  }, [detail, resumePartId]);

  const completedCount = useMemo(() => {
    if (!detail) return 0;
    if (detail.completed_parts !== undefined) return detail.completed_parts;
    return detail.parts.filter((p) => p.is_completed).length;
  }, [detail]);

  const totalCount = useMemo(() => {
    return detail?.total_parts ?? detail?.parts.length ?? 0;
  }, [detail]);

  const nextIncompletePartOrder = useMemo(() => {
    if (!detail?.parts) return null;
    const next = detail.parts.find((p) => !p.is_completed);
    return next ? next.part_order : null;
  }, [detail]);

  const resumePartOrder = useMemo(() => {
    if (!detail?.parts || !resumePartId) return null;
    return detail.parts.find((part) => part.part_id === resumePartId)?.part_order ?? null;
  }, [detail, resumePartId]);

  const previewSnippet = useMemo(() => {
    if (!detail) return null;
    const firstPart = detail.parts?.[0];
    return firstPart?.reading_text || detail.summary || null;
  }, [detail]);

  const sortedParts = useMemo(() => {
    if (!detail?.parts) return [];
    return [...detail.parts].sort((a, b) => a.part_order - b.part_order);
  }, [detail]);

  const handleTabChange = useCallback((tab: ContentDetailTab) => {
    setActiveTab(tab);
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (!detail) return;

    const next = !detail.is_bookmarked;
    setDetail((prev) => (prev ? { ...prev, is_bookmarked: next } : null));

    const call = next ? addBookmarkApi(detail.series_id) : removeBookmarkApi(detail.series_id);
    void call.catch(() => {
      setDetail((prev) => (prev ? { ...prev, is_bookmarked: !next } : null));
    });
  }, [detail]);

  const navigate = useNavigate();

  const handleSelectPart = useCallback((partId: string) => {
    if (!detail) return;
    navigate(`/content/${detail.series_id}/part/${partId}`);
  }, [detail, navigate]);

  // resumePartId is the server's most recently opened published Part. Prefer
  // it over local guesses so Continue Reading always returns to that chapter.
  const handlePrimaryReadAction = useCallback(() => {
    if (!detail || !detail.parts || detail.parts.length === 0) return;

    const target =
      (resumePartId && detail.parts.find((part) => part.part_id === resumePartId))
      || detail.parts.find((part) => !part.is_completed)
      || detail.parts[0];

    if (target) {
      handleSelectPart(target.part_id);
    }
  }, [detail, resumePartId, handleSelectPart]);

  return {
    detail,
    loading,
    error,
    retry: () => setReloadToken((token) => token + 1),
    activeTab,
    hasProgress,
    completedCount,
    totalCount,
    nextIncompletePartOrder,
    resumePartOrder,
    churchName,
    previewSnippet,
    relatedSeries,
    sortedParts,
    handleTabChange,
    handleToggleBookmark,
    handleSelectPart,
    handlePrimaryReadAction,
  };
};
