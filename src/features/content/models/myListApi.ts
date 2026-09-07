// features/content/my-list/models/myListApi.ts
// Model layer: API contract specifications and data fetching services.
// Pure TypeScript only — NO functions with component logic, NO React hooks, NO JSX.

import type { BookmarkedSeriesApiRecord, MyListPaginationMeta } from './myListTypes';

export interface FetchMyListResponse {
  data: BookmarkedSeriesApiRecord[];
  meta: MyListPaginationMeta;
}

export interface RemoveBookmarkRequest {
  series_id: string;
  user_id: string;
}

export interface RemoveBookmarkResponse {
  success: boolean;
  series_id: string;
}

// ── Static Mock Data ──────────────────────────────────────────────────────────
const STATIC_BOOKMARKED_SERIES: BookmarkedSeriesApiRecord[] = [
  {
    series_id: 's-2',
    church_id: 101,
    title: 'Grace & Truth in Action',
    summary: 'Exploring God’s grace through practical everyday walk.',
    description: 'An inspiring series uncovering the transformative power of grace in everyday challenges.',
    content_type: 'sunday_service',
    thumbnail_url: null,
    status: 'published',
    categories: ['Sunday Service', 'Grace'],
    total_parts: 6,
    completed_parts: 2,
    percent_complete: 33,
    is_bookmarked: true,
    bookmarked_at: '2026-08-20T10:00:00Z',
  },
  {
    series_id: 's-3',
    church_id: 101,
    title: '7 Days of Morning Devotion',
    summary: 'Start your day centered on God’s Word with daily short devotionals.',
    description: 'Daily quiet time reflections, Scripture readings, and personal guided prayer.',
    content_type: 'devotional',
    thumbnail_url: null,
    status: 'published',
    categories: ['Devotional', 'Prayer'],
    total_parts: 7,
    completed_parts: 4,
    percent_complete: 57,
    is_bookmarked: true,
    bookmarked_at: '2026-08-21T07:30:00Z',
  },
  {
    series_id: 's-6',
    church_id: 101,
    title: 'Walking in the Spirit',
    summary: 'Understanding the gifts and fruits of the Holy Spirit.',
    description: 'Biblical guide to growing spiritually and walking faithfully in the Spirit each day.',
    content_type: 'bible_study',
    thumbnail_url: null,
    status: 'published',
    categories: ['Bible Study', 'Spiritual Growth'],
    total_parts: 8,
    completed_parts: 1,
    percent_complete: 12,
    is_bookmarked: true,
    bookmarked_at: '2026-08-22T14:15:00Z',
  },
  {
    series_id: 's-1',
    church_id: 101,
    title: 'Sunday Morning Fellowship',
    summary: 'Live worship and pastoral messages from our weekly church service.',
    description: 'Join our weekly Sunday service filled with prayer, praise, and sound biblical teachings.',
    content_type: 'sunday_service',
    thumbnail_url: null,
    status: 'published',
    categories: ['Sunday Service', 'Worship'],
    total_parts: 12,
    completed_parts: 3,
    percent_complete: 25,
    is_bookmarked: true,
    bookmarked_at: '2026-08-23T11:00:00Z',
  },
  {
    series_id: 's-5',
    church_id: 101,
    title: 'The Book of Romans Deep Dive',
    summary: 'Verse-by-verse exposition of the Gospel of God in Romans.',
    description: 'Exhaustive chapter-by-chapter study on Paul’s Epistle to the Romans and core doctrines.',
    content_type: 'bible_study',
    thumbnail_url: null,
    status: 'published',
    categories: ['Bible Study', 'Theology'],
    total_parts: 16,
    completed_parts: 8,
    percent_complete: 50,
    is_bookmarked: true,
    bookmarked_at: '2026-08-24T18:00:00Z',
  },
  {
    series_id: 's-7',
    church_id: 101,
    title: 'Kingdom Stewardship & Finance',
    summary: 'Biblical wisdom on financial management and generous giving.',
    description: 'Learn how Scripture guides personal stewardship, wise investments, and church support.',
    content_type: 'general',
    thumbnail_url: null,
    status: 'published',
    categories: ['General', 'Finance'],
    total_parts: 4,
    completed_parts: 0,
    percent_complete: 0,
    is_bookmarked: true,
    bookmarked_at: '2026-08-25T09:45:00Z',
  },
];

/**
 * Fetch the user's bookmarked series list with cursor-based pagination.
 *
 * TO DO: Connect to backend endpoint GET /api/v1/content/bookmarks
 * Query params: cursor, limit
 * Header: Authorization Bearer token / Session cookie
 */
export async function fetchMyListSeries(
  cursor?: string | null,
  limit: number = 20
): Promise<FetchMyListResponse> {
  // Simulating network latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 200));

  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const endIndex = startIndex + limit;
  const pagedData = STATIC_BOOKMARKED_SERIES.slice(startIndex, endIndex);
  const hasMore = endIndex < STATIC_BOOKMARKED_SERIES.length;

  return {
    data: pagedData,
    meta: {
      next_cursor: hasMore ? String(endIndex) : null,
      has_more: hasMore,
      total_count: STATIC_BOOKMARKED_SERIES.length,
    },
  };
}

/**
 * Remove a series from the user's bookmarks list.
 *
 * TO DO: Connect to backend endpoint DELETE /api/v1/content/bookmarks/:series_id
 */
export async function removeBookmarkApi(seriesId: string): Promise<RemoveBookmarkResponse> {
  // Simulating network response
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    success: true,
    series_id: seriesId,
  };
}
