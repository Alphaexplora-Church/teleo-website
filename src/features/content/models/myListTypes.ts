// features/content/my-list/models/myListTypes.ts
// Model layer: pure TypeScript. Types, interfaces, and declarative constants only.
// NO functions with side effects, NO React hooks, NO JSX.

import type { ContentSeriesSummary, ContentStatus, ContentType } from './contentTypes';

/** API Record structure for a bookmarked series returned by backend endpoints */
export interface BookmarkedSeriesApiRecord {
  series_id: string;
  church_id: number;
  title: string;
  description: string | null;
  summary: string | null;
  content_type: ContentType;
  thumbnail_url: string | null;
  status: ContentStatus;
  categories: string[];
  total_parts: number;
  completed_parts?: number;
  percent_complete?: number;
  last_activity_at?: string | null;
  is_bookmarked: boolean;
  bookmarked_at?: string | null;
}

/** Pagination metadata for the MyList bookmarked series list endpoint */
export interface MyListPaginationMeta {
  next_cursor: string | null;
  has_more: boolean;
  total_count?: number;
}

/** Frontend-friendly shape consumed by the MyList view and cards */
export interface MyListSeriesItem {
  id: string;
  churchId: number;
  title: string;
  summary: string | null;
  description: string | null;
  contentType: ContentType;
  imageUrl: string | null;
  totalParts: number;
  completedParts?: number;
  percentComplete?: number;
  categories: string[];
  isBookmarked: boolean;
}

/** Pure mapping function from API record to frontend model shape */
export function toMyListSeriesItem(record: BookmarkedSeriesApiRecord): MyListSeriesItem {
  return {
    id: record.series_id,
    churchId: record.church_id,
    title: record.title,
    summary: record.summary,
    description: record.description,
    contentType: record.content_type,
    imageUrl: record.thumbnail_url,
    totalParts: record.total_parts,
    completedParts: record.completed_parts,
    percentComplete: record.percent_complete,
    categories: record.categories ?? [],
    isBookmarked: record.is_bookmarked ?? true,
  };
}

/** Pure mapping function from MyListSeriesItem to ContentSeriesSummary */
export function toContentSeriesSummary(item: MyListSeriesItem): ContentSeriesSummary {
  return {
    series_id: item.id,
    church_id: item.churchId,
    title: item.title,
    summary: item.summary,
    description: item.description,
    content_type: item.contentType,
    thumbnail_url: item.imageUrl,
    status: 'published',
    categories: item.categories,
    total_parts: item.totalParts,
    completed_parts: item.completedParts,
    percent_complete: item.percentComplete,
    is_bookmarked: item.isBookmarked,
  };
}

