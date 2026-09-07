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
export type ChapterSortOrder = 'asc' | 'desc';

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
  churchName: string;
  previewSnippet: string | null;
  relatedSeries: ContentSeriesSummary[];
  sortOrder: ChapterSortOrder;
  sortedParts: ContentSeriesDetail['parts'];
  handleToggleSortOrder: () => void;
  handleTabChange: (tab: ContentDetailTab) => void;
  handleToggleBookmark: () => void;
  handleSelectPart: (partId: string) => void;
  handlePrimaryReadAction: () => void;
}

export const useContentDetailViewModel = (
  seriesId?: string
): ContentDetailViewModelReturn => {
  const [detail, setDetail] = useState<ContentSeriesDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ContentDetailTab>('chapters');
  const [sortOrder, setSortOrder] = useState<ChapterSortOrder>('asc');
  const [churchName, setChurchName] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [relatedSeries, setRelatedSeries] = useState<ContentSeriesSummary[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

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

        setDetail({
          ...series,
          is_bookmarked: bookmarked,
          completed_parts: progress?.completed_parts ?? series.parts.filter((p) => p.is_completed).length,
          total_parts: progress?.total_parts ?? series.parts.length,
          percent_complete: progress?.percent_complete ?? 0,
        });
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
    return Boolean(
      detail?.percent_complete !== undefined && detail.percent_complete > 0
    );
  }, [detail]);

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

  const previewSnippet = useMemo(() => {
    if (!detail) return null;
    const firstPart = detail.parts?.[0];
    return firstPart?.reading_text || detail.summary || null;
  }, [detail]);

  const sortedParts = useMemo(() => {
    if (!detail?.parts) return [];
    const partsCopy = [...detail.parts];
    if (sortOrder === 'desc') {
      return partsCopy.sort((a, b) => b.part_order - a.part_order);
    }
    return partsCopy.sort((a, b) => a.part_order - b.part_order);
  }, [detail, sortOrder]);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

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

  const handlePrimaryReadAction = useCallback(() => {
    if (!detail || !detail.parts || detail.parts.length === 0) return;
    const nextIncompletePart =
      detail.parts.find((part) => !part.is_completed) || detail.parts[0];
    if (nextIncompletePart) {
      handleSelectPart(nextIncompletePart.part_id);
    }
  }, [detail, handleSelectPart]);

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
    churchName,
    previewSnippet,
    relatedSeries,
    sortOrder,
    sortedParts,
    handleToggleSortOrder,
    handleTabChange,
    handleToggleBookmark,
    handleSelectPart,
    handlePrimaryReadAction,
  };
};
