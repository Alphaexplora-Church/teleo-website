// features/content/content-detail/viewModels/useContentDetailViewModel.ts
// ViewModel layer: manages series details, tabs, reading progress, and bookmark toggling.
// NO JSX. Returns only what the View needs.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  ContentSeriesDetail,
  ContentSeriesSummary,
  ContentType,
} from '../../models/contentTypes';

export type ContentDetailTab = 'chapters' | 'preview' | 'more';
export type ChapterSortOrder = 'asc' | 'desc';

export interface ContentDetailViewModelReturn {
  detail: ContentSeriesDetail | null;
  loading: boolean;
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

// ── Mock Series Database ──────────────────────────────────────────────────────
const MOCK_SERIES_CATALOG: Record<string, Partial<ContentSeriesDetail>> = {
  's-1': {
    title: 'Sunday Morning Fellowship',
    content_type: 'sunday_service',
    summary: 'Live worship and pastoral messages from our weekly church service.',
    description: 'Join our weekly Sunday service filled with prayer, praise, and the Word. Experience transformative preaching centered on Christ.',
    categories: ['Sunday Service', 'Worship', 'Preaching'],
    church_id: 101,
    total_parts: 12,
    completed_parts: 3,
    percent_complete: 25,
    is_bookmarked: false,
  },
  's-2': {
    title: 'Grace & Truth in Action',
    content_type: 'sunday_service',
    summary: 'Exploring God’s grace through practical everyday walk.',
    description: 'An inspiring series uncovering the transformative power of grace in everyday challenges, relationships, and workplace integrity.',
    categories: ['Sunday Service', 'Grace', 'Discipleship'],
    church_id: 101,
    total_parts: 6,
    completed_parts: 2,
    percent_complete: 33,
    is_bookmarked: true,
  },
  's-3': {
    title: '7 Days of Morning Devotion',
    content_type: 'devotional',
    summary: 'Start your day centered on God’s Word with daily short devotionals.',
    description: 'Daily quiet time reflections, Scripture readings, and personal guided prayer to ground your heart in peace and clarity every morning.',
    categories: ['Devotional', 'Prayer', 'Spiritual Growth'],
    church_id: 101,
    total_parts: 7,
    completed_parts: 4,
    percent_complete: 57,
    is_bookmarked: true,
  },
  's-4': {
    title: 'Renewing Your Mind',
    content_type: 'devotional',
    summary: 'Transformative daily habits grounded in Biblical principles.',
    description: 'Guided daily thoughts and prayers to cultivate spiritual renewal, overcome anxiety, and align your thoughts with God’s truth.',
    categories: ['Devotional', 'Mindfulness', 'Faith'],
    church_id: 101,
    total_parts: 5,
    completed_parts: 0,
    percent_complete: 0,
    is_bookmarked: false,
  },
  's-5': {
    title: 'The Book of Romans Deep Dive',
    content_type: 'bible_study',
    summary: 'Verse-by-verse exposition of the Gospel of God in Romans.',
    description: 'Exhaustive chapter-by-chapter study on Paul’s Epistle to the Romans, exploring justification, sanctification, and eternal hope.',
    categories: ['Bible Study', 'Theology', 'Scripture'],
    church_id: 101,
    total_parts: 16,
    completed_parts: 8,
    percent_complete: 50,
    is_bookmarked: false,
  },
  's-6': {
    title: 'Walking in the Spirit',
    content_type: 'bible_study',
    summary: 'Understanding the gifts and fruits of the Holy Spirit.',
    description: 'Biblical guide to growing spiritually and walking faithfully in the Spirit each day with love, joy, peace, and patience.',
    categories: ['Bible Study', 'Spiritual Growth', 'Holy Spirit'],
    church_id: 101,
    total_parts: 8,
    completed_parts: 1,
    percent_complete: 12,
    is_bookmarked: true,
  },
  's-7': {
    title: 'Kingdom Stewardship & Finance',
    content_type: 'general',
    summary: 'Biblical wisdom on financial management and generous giving.',
    description: 'Learn how Scripture guides personal stewardship, budgeting, overcoming debt, and experiencing the blessings of generous giving.',
    categories: ['General', 'Finance', 'Stewardship'],
    church_id: 101,
    total_parts: 4,
    completed_parts: 0,
    percent_complete: 0,
    is_bookmarked: false,
  },
  's-8': {
    title: 'Covenant Marriage & Family',
    content_type: 'general',
    summary: 'Building Christ-centered foundations in modern relationships.',
    description: 'Pastoral teachings on love, communication, covenant commitment, and raising godly children in today’s complex culture.',
    categories: ['General', 'Marriage', 'Family'],
    church_id: 101,
    total_parts: 6,
    completed_parts: 0,
    percent_complete: 0,
    is_bookmarked: false,
  },
};

const RELATED_SERIES_LIST: ContentSeriesSummary[] = [
  {
    series_id: 's-2',
    church_id: 101,
    title: 'Grace & Truth in Action',
    content_type: 'sunday_service',
    summary: 'Exploring God’s grace through practical everyday walk.',
    thumbnail_url: null,
    status: 'published',
    categories: ['Sunday Service', 'Grace'],
    total_parts: 6,
  },
  {
    series_id: 's-3',
    church_id: 101,
    title: '7 Days of Morning Devotion',
    content_type: 'devotional',
    summary: 'Start your day centered on God’s Word with daily short devotionals.',
    thumbnail_url: null,
    status: 'published',
    categories: ['Devotional', 'Prayer'],
    total_parts: 7,
  },
  {
    series_id: 's-6',
    church_id: 101,
    title: 'Walking in the Spirit',
    content_type: 'bible_study',
    summary: 'Understanding the gifts and fruits of the Holy Spirit.',
    thumbnail_url: null,
    status: 'published',
    categories: ['Bible Study', 'Spiritual Growth'],
    total_parts: 8,
  },
  {
    series_id: 's-4',
    church_id: 101,
    title: 'Renewing Your Mind',
    content_type: 'devotional',
    summary: 'Transformative daily habits grounded in Biblical principles.',
    thumbnail_url: null,
    status: 'published',
    categories: ['Devotional'],
    total_parts: 5,
  },
];

export const useContentDetailViewModel = (
  seriesId?: string
): ContentDetailViewModelReturn => {
  const [detail, setDetail] = useState<ContentSeriesDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ContentDetailTab>('chapters');
  const [sortOrder, setSortOrder] = useState<ChapterSortOrder>('asc');
  const [churchName, setChurchName] = useState<string>('Grace Community Church');

  useEffect(() => {
    // TO DO: Connect to backend endpoint GET /api/v1/content/series/:seriesId
    if (!seriesId) return;

    setLoading(true);

    const catalogEntry = MOCK_SERIES_CATALOG[seriesId] || {
      title: 'Discipleship Journey & Faith Foundation',
      content_type: 'devotional' as ContentType,
      summary: 'Build a rock-solid spiritual foundation through guided Scripture, daily devotionals, and pastoral teachings.',
      description: 'This journey walks you through fundamental aspects of faith: prayer, scripture meditation, communion, and community building.',
      categories: ['Discipleship', 'Spiritual Growth'],
      church_id: 101,
      total_parts: 4,
      completed_parts: 0,
      percent_complete: 0,
      is_bookmarked: false,
    };

    const mockDetail: ContentSeriesDetail = {
      series_id: seriesId,
      church_id: catalogEntry.church_id ?? 101,
      title: catalogEntry.title ?? 'Series Details',
      summary: catalogEntry.summary ?? 'Guided spiritual study and reflections.',
      description: catalogEntry.description ?? catalogEntry.summary ?? '',
      content_type: (catalogEntry.content_type as ContentType) ?? 'devotional',
      thumbnail_url: catalogEntry.thumbnail_url ?? null,
      status: 'published',
      categories: catalogEntry.categories ?? ['Faith'],
      total_parts: catalogEntry.total_parts ?? 4,
      completed_parts: catalogEntry.completed_parts ?? 0,
      percent_complete: catalogEntry.percent_complete ?? 0,
      is_bookmarked: catalogEntry.is_bookmarked ?? false,
      parts: [
        {
          part_id: 'p-1',
          series_id: seriesId,
          part_order: 1,
          title: 'The Foundation of Faith & Grace',
          media_type: 'youtube',
          media_url: 'https://youtube.com/watch?v=mock',
          media_duration_seconds: 720,
          reading_text: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God. In this opening chapter, we explore how God’s unmerited favor anchors our identity and provides lasting peace.',
          estimated_read_time_minutes: 5,
          status: 'published',
          is_completed: (catalogEntry.completed_parts ?? 0) >= 1,
          published_at: 'Aug 10, 2026',
        },
        {
          part_id: 'p-2',
          series_id: seriesId,
          part_order: 2,
          title: 'Hearing the Voice of God in Daily Life',
          media_type: null,
          media_url: null,
          media_duration_seconds: null,
          reading_text: 'Quiet reflection is essential for discerning God’s guidance. Take time to meditate on Psalm 23 and let His still small voice reassure your soul.',
          estimated_read_time_minutes: 8,
          status: 'published',
          is_completed: (catalogEntry.completed_parts ?? 0) >= 2,
          published_at: 'Aug 14, 2026',
        },
        {
          part_id: 'p-3',
          series_id: seriesId,
          part_order: 3,
          title: 'Living in Fellowship & Faithful Service',
          media_type: 'podcast',
          media_url: 'https://audio.mock/sample.mp3',
          media_duration_seconds: 900,
          reading_text: 'Christianity was never meant to be lived in isolation. We are designed for fellowship, bearing one another’s burdens, and serving in love.',
          estimated_read_time_minutes: 6,
          status: 'published',
          is_completed: (catalogEntry.completed_parts ?? 0) >= 3,
          published_at: 'Aug 18, 2026',
        },
        {
          part_id: 'p-4',
          series_id: seriesId,
          part_order: 4,
          title: 'Persevering with Eternal Hope',
          media_type: 'youtube',
          media_url: 'https://youtube.com/watch?v=mock4',
          media_duration_seconds: 640,
          reading_text: 'Let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.',
          estimated_read_time_minutes: 4,
          status: 'published',
          is_completed: (catalogEntry.completed_parts ?? 0) >= 4,
          published_at: 'Aug 22, 2026',
        },
      ],
    };

    setDetail(mockDetail);
    setChurchName('Grace Community Church');
    setLoading(false);
  }, [seriesId]);

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

  const relatedSeries = useMemo(() => {
    if (!detail) return RELATED_SERIES_LIST;
    return RELATED_SERIES_LIST.filter((item) => item.series_id !== detail.series_id);
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
    // TO DO: Connect to backend endpoint POST/DELETE /api/v1/content/bookmarks/:series_id
    setDetail((prev) => (prev ? { ...prev, is_bookmarked: !prev.is_bookmarked } : null));
  }, []);

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
