import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ContentCategory, ContentSeriesSummary } from '../models/contentTypes';
import type { MemberJourneyProgress } from '../models/contentApi';
import { addBookmarkApi, removeBookmarkApi, fetchMyListSeries } from '../models/myListApi';
import {
  searchJourneys,
  fetchDiscoverJourneys,
  fetchCategories,
  fetchRecommendedJourneys,
  fetchMemberJourneys,
} from '../models/contentApi';

export const useContentCatalogViewModel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [allSeries, setAllSeries] = useState<ContentSeriesSummary[]>([]);
  const [searchResults, setSearchResults] = useState<ContentSeriesSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mostWatched, setMostWatched] = useState<ContentSeriesSummary[]>([]);
  const [becauseYouWatched, setBecauseYouWatched] = useState<ContentSeriesSummary[]>([]);
  const [inProgress, setInProgress] = useState<MemberJourneyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [series, cats] = await Promise.all([fetchDiscoverJourneys(), fetchCategories()]);

      // Bookmarks are a separate list, so the heart on each card only knows
      // its state once the two are merged.
      let bookmarked = new Set<string>();
      try {
        const myList = await fetchMyListSeries(null, 200);
        bookmarked = new Set(myList.data.map((item) => item.series_id));
      } catch {
        // Non-fatal: the catalog still renders, hearts just start empty.
      }

      setAllSeries(series.map((item) => ({ ...item, is_bookmarked: bookmarked.has(item.series_id) })));
      setCategories(cats);
    } catch {
      setLoadError('Could not load journeys.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadCatalog(); }, [loadCatalog]);

  // The personalized rows and the member's own progress are independent of
  // the catalog: any of them failing must not blank the screen.
  useEffect(() => {
    let cancelled = false;

    fetchRecommendedJourneys('most_watched')
      .then((rows) => { if (!cancelled) setMostWatched(rows); })
      .catch(() => undefined);

    fetchRecommendedJourneys('because_you_watched')
      .then((rows) => { if (!cancelled) setBecauseYouWatched(rows); })
      .catch(() => undefined);

    fetchMemberJourneys('in_progress')
      .then((rows) => { if (!cancelled) setInProgress(rows); })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery === '') {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);

    searchJourneys(debouncedQuery)
      .then((results) => { if (!cancelled) setSearchResults(results); })
      .catch(() => { if (!cancelled) setSearchError('Search failed. Please try again.'); })
      .finally(() => { if (!cancelled) setIsSearching(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Filtered series based on search query and category filter
  const filteredSeries = useMemo(() => {
    const source = debouncedQuery !== '' ? searchResults : allSeries;

    return source.filter((series) => {
      const isPublished = series.status === 'published';

      const matchesCategory =
        selectedCategory === 'all' ||
        series.content_type.toLowerCase() === selectedCategory.toLowerCase() ||
        series.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

      return isPublished && matchesCategory;
    });
  }, [allSeries, searchResults, debouncedQuery, selectedCategory]);

  // Specific Rails. The two personalized rows come straight from the API
  // rather than being sliced out of the catalog, and the rails only render
  // while nothing is filtered, so they are deliberately unfiltered here.
  const mostWatchedRail = mostWatched;

  const becauseYouWatchedRail = becauseYouWatched;

  // The member journeys endpoint returns progress only, with no artwork or
  // content type, so each row is hydrated from the catalog entry it refers to.
  const continueRail = useMemo(() => {
    const byId = new Map(allSeries.map((item) => [item.series_id, item]));

    return inProgress
      .map((row): ContentSeriesSummary | null => {
        const series = byId.get(row.series_id);
        if (!series) return null;

        return {
          ...series,
          total_parts: row.total_parts || series.total_parts,
          completed_parts: row.completed_parts,
          percent_complete: row.percent_complete,
          last_activity_at: row.last_activity_at,
        };
      })
      .filter((item): item is ContentSeriesSummary => item !== null);
  }, [inProgress, allSeries]);

  const sundayServiceRail = useMemo(() => {
    return filteredSeries.filter((item) => item.content_type === 'sunday_service');
  }, [filteredSeries]);

  const devotionalRail = useMemo(() => {
    return filteredSeries.filter((item) => item.content_type === 'devotional');
  }, [filteredSeries]);

  const bibleStudyRail = useMemo(() => {
    return filteredSeries.filter((item) => item.content_type === 'bible_study');
  }, [filteredSeries]);

  const generalRail = useMemo(() => {
    return filteredSeries.filter((item) => item.content_type === 'general');
  }, [filteredSeries]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleBookmarkToggle = useCallback(async (seriesId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const current = allSeries.find((item) => item.series_id === seriesId);
    if (!current) return;

    const next = !current.is_bookmarked;

    setAllSeries((prev) =>
      prev.map((item) => (item.series_id === seriesId ? { ...item, is_bookmarked: next } : item))
    );

    try {
      if (next) {
        await addBookmarkApi(seriesId);
      } else {
        await removeBookmarkApi(seriesId);
      }
    } catch {
      setAllSeries((prev) =>
        prev.map((item) => (item.series_id === seriesId ? { ...item, is_bookmarked: !next } : item))
      );
    }
  }, [allSeries]);

  const onViewAllMostWatched = useCallback(() => {
    setSelectedCategory('all');
  }, []);

  const onViewAllBecauseYouWatched = useCallback(() => {
    setSelectedCategory('all');
  }, []);

  const onViewAllSundayService = useCallback(() => {
    setSelectedCategory('sunday_service');
  }, []);

  const onViewAllDevotional = useCallback(() => {
    setSelectedCategory('devotional');
  }, []);

  const onViewAllBibleStudy = useCallback(() => {
    setSelectedCategory('bible_study');
  }, []);

  const onViewAllGeneral = useCallback(() => {
    setSelectedCategory('general');
  }, []);

  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== 'all';

  return {
    selectedCategory,
    searchQuery,
    setSearchQuery,
    handleSearchChange,
    handleClearSearch,
    handleResetFilters,
    isFiltering,
    isSearching,
    searchError,
    isLoading,
    loadError,
    retry: loadCatalog,
    filteredSeries,
    categories,
    mostWatchedRail,
    continueRail,
    becauseYouWatchedRail,
    sundayServiceRail,
    devotionalRail,
    bibleStudyRail,
    generalRail,
    handleCategorySelect,
    handleBookmarkToggle,
    onViewAllMostWatched,
    onViewAllBecauseYouWatched,
    onViewAllSundayService,
    onViewAllDevotional,
    onViewAllBibleStudy,
    onViewAllGeneral,
  };
};

export const useContentViewModel = useContentCatalogViewModel;
