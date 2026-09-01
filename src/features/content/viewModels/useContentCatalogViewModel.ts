import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ContentCategory, ContentSeriesSummary } from '../models/contentTypes';

export const useContentCatalogViewModel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [allSeries, setAllSeries] = useState<ContentSeriesSummary[]>([]);

  useEffect(() => {
    // Mock Categories
    const mockCategories: ContentCategory[] = [
      { category_id: 'sunday_service', name: 'Sunday Service', sort_order: 1 },
      { category_id: 'devotional', name: 'Devotional', sort_order: 2 },
      { category_id: 'bible_study', name: 'Bible Study', sort_order: 3 },
      { category_id: 'general', name: 'General', sort_order: 4 },
    ];

    // Mock Comprehensive Series List
    const mockSeriesList: ContentSeriesSummary[] = [
      {
        series_id: 's-1',
        church_id: 101,
        title: 'Sunday Morning Fellowship',
        summary: 'Live worship and pastoral messages from our weekly church service.',
        description: 'Join our weekly Sunday service filled with prayer, praise, and the Word.',
        content_type: 'sunday_service',
        thumbnail_url: null,
        status: 'published',
        categories: ['Sunday Service', 'Worship'],
        total_parts: 12,
        completed_parts: 3,
        percent_complete: 25,
        is_bookmarked: false,
      },
      {
        series_id: 's-2',
        church_id: 101,
        title: 'Grace & Truth in Action',
        summary: 'Exploring God’s grace through practical everyday walk.',
        description: 'An inspiring series uncovering the transformative power of grace.',
        content_type: 'sunday_service',
        thumbnail_url: null,
        status: 'published',
        categories: ['Sunday Service'],
        total_parts: 6,
        is_bookmarked: true,
      },
      {
        series_id: 's-3',
        church_id: 101,
        title: '7 Days of Morning Devotion',
        summary: 'Start your day centered on God’s Word with daily short devotionals.',
        description: 'Daily quiet time reflections and Scripture readings.',
        content_type: 'devotional',
        thumbnail_url: null,
        status: 'published',
        categories: ['Devotional', 'Prayer'],
        total_parts: 7,
        completed_parts: 4,
        percent_complete: 57,
        is_bookmarked: true,
      },
      {
        series_id: 's-4',
        church_id: 101,
        title: 'Renewing Your Mind',
        summary: 'Transformative daily habits grounded in Biblical principles.',
        description: 'Guided daily thoughts and prayers to cultivate spiritual renewal.',
        content_type: 'devotional',
        thumbnail_url: null,
        status: 'published',
        categories: ['Devotional'],
        total_parts: 5,
        is_bookmarked: false,
      },
      {
        series_id: 's-5',
        church_id: 101,
        title: 'The Book of Romans Deep Dive',
        summary: 'Verse-by-verse exposition of the Gospel of God in Romans.',
        description: 'Exhaustive chapter-by-chapter study on Paul’s Epistle to the Romans.',
        content_type: 'bible_study',
        thumbnail_url: null,
        status: 'published',
        categories: ['Bible Study', 'Theology'],
        total_parts: 16,
        completed_parts: 8,
        percent_complete: 50,
        is_bookmarked: false,
      },
      {
        series_id: 's-6',
        church_id: 101,
        title: 'Walking in the Spirit',
        summary: 'Understanding the gifts and fruits of the Holy Spirit.',
        description: 'Biblical guide to growing spiritually and walking faithfully in the Spirit.',
        content_type: 'bible_study',
        thumbnail_url: null,
        status: 'published',
        categories: ['Bible Study'],
        total_parts: 8,
        is_bookmarked: true,
      },
      {
        series_id: 's-7',
        church_id: 101,
        title: 'Kingdom Stewardship & Finance',
        summary: 'Biblical wisdom on financial management and generous giving.',
        description: 'Learn how Scripture guides personal stewardship and church support.',
        content_type: 'general',
        thumbnail_url: null,
        status: 'published',
        categories: ['General', 'Finance'],
        total_parts: 4,
        is_bookmarked: false,
      },
      {
        series_id: 's-8',
        church_id: 101,
        title: 'Covenant Marriage & Family',
        summary: 'Building Christ-centered foundations in modern relationships.',
        description: 'Pastoral teachings on love, marriage, and raising godly children.',
        content_type: 'general',
        thumbnail_url: null,
        status: 'published',
        categories: ['General', 'Marriage'],
        total_parts: 6,
        is_bookmarked: false,
      },
    ];

    setCategories(mockCategories);
    setAllSeries(mockSeriesList);
  }, []);

  // Filtered series based on search query and category filter
  const filteredSeries = useMemo(() => {
    return allSeries.filter((series) => {
      const isPublished = series.status === 'published';
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === '' ||
        series.title.toLowerCase().includes(query) ||
        (series.summary && series.summary.toLowerCase().includes(query)) ||
        (series.description && series.description.toLowerCase().includes(query)) ||
        series.content_type.toLowerCase().includes(query) ||
        series.categories.some((c) => c.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'all' ||
        series.content_type.toLowerCase() === selectedCategory.toLowerCase() ||
        series.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

      return isPublished && matchesSearch && matchesCategory;
    });
  }, [allSeries, searchQuery, selectedCategory]);

  // Specific Rails
  const mostWatchedRail = useMemo(() => {
    return filteredSeries.slice(0, 5);
  }, [filteredSeries]);

  const continueRail = useMemo(() => {
    return filteredSeries.filter(
      (item) => item.percent_complete !== undefined && item.percent_complete > 0 && item.percent_complete < 100
    );
  }, [filteredSeries]);

  const becauseYouWatchedRail = useMemo(() => {
    return filteredSeries.slice(2, 7);
  }, [filteredSeries]);

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

  const handleBookmarkToggle = useCallback((seriesId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllSeries((prev) =>
      prev.map((item) =>
        item.series_id === seriesId ? { ...item, is_bookmarked: !item.is_bookmarked } : item
      )
    );
  }, []);

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
