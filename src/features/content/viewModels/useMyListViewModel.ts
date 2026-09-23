// features/content/my-list/viewModels/useMyListViewModel.ts
// ViewModel layer: all state, search filtering logic, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { MyListSeriesItem } from '../models/myListTypes';
import { toMyListSeriesItem } from '../models/myListTypes';
import { fetchMyListSeries, removeBookmarkApi } from '../models/myListApi';

// ── Helper: chunk a flat array into rows of N ──────────────────
function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

// ── ViewModel return type ──────────────────────────────────────
export interface MyListViewModelReturn {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
  filteredSeries: MyListSeriesItem[];
  seriesRows: MyListSeriesItem[][];
  handleSeriesSelect: (series: MyListSeriesItem) => void;
  handleRemoveBookmark: (seriesId: string, e: React.MouseEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
}

// ── Hook ──────────────────────────────────────────────────────
export const useMyListViewModel = (
  onSeriesSelect?: (series: MyListSeriesItem) => void
): MyListViewModelReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allSeries, setAllSeries] = useState<MyListSeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ── Fetch bookmarked series on mount ────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchMyListSeries(null, 20);
        setAllSeries(result.data.map(toMyListSeriesItem));
        setNextCursor(result.meta.next_cursor);
        setHasMore(result.meta.has_more);
      } catch (err) {
        console.error('Failed to fetch bookmarked series:', err);
        setError('Could not load your list. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // ── Load more (pagination) ────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const result = await fetchMyListSeries(nextCursor, 20);
      setAllSeries((prev) => [...prev, ...result.data.map(toMyListSeriesItem)]);
      setNextCursor(result.meta.next_cursor);
      setHasMore(result.meta.has_more);
    } catch (err) {
      console.error('Failed to load more bookmarked series:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Filter bookmarked series by title, description, summary, or categories
  const filteredSeries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSeries;
    return allSeries.filter(
      (series) =>
        series.title.toLowerCase().includes(q) ||
        series.summary?.toLowerCase().includes(q) ||
        series.description?.toLowerCase().includes(q) ||
        series.contentType.toLowerCase().includes(q) ||
        series.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery, allSeries]);

  // Split into rows of 3 for the grid layout matching FindMyChurch
  const seriesRows = useMemo(() => chunkArray(filteredSeries, 3), [filteredSeries]);

  // Stable callback wrapping the injected onSeriesSelect
  const handleSeriesSelect = useCallback(
    (series: MyListSeriesItem) => {
      onSeriesSelect?.(series);
    },
    [onSeriesSelect]
  );

  // Remove bookmark handler
  const handleRemoveBookmark = useCallback(
    async (seriesId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await removeBookmarkApi(seriesId);
        setAllSeries((prev) => prev.filter((item) => item.id !== seriesId));
      } catch (err) {
        console.error('Failed to remove bookmark:', err);
      }
    },
    []
  );

  return {
    searchQuery,
    handleSearchChange,
    filteredSeries,
    seriesRows,
    handleSeriesSelect,
    handleRemoveBookmark,
    isLoading,
    error,
    hasMore,
    loadMore,
    isLoadingMore,
  };
};
