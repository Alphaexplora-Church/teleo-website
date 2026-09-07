// features/content/my-list/models/myListApi.ts
// Model layer: API contract specifications and data fetching services.
// Pure TypeScript only — NO functions with component logic, NO React hooks, NO JSX.

import type { BookmarkedSeriesApiRecord, MyListPaginationMeta } from './myListTypes';
import { getCachedUserId } from '../../../shared/models/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

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

/**
 * Fetch the member's bookmarked series. The API paginates by page number
 * while this UI's cursor is a row offset, so the two are mapped here.
 */
export async function fetchMyListSeries(
  cursor?: string | null,
  limit: number = 20
): Promise<FetchMyListResponse> {
  const userId = getCachedUserId();
  if (!userId) throw new Error('Not signed in');

  const offset = cursor ? parseInt(cursor, 10) : 0;
  const page = Math.floor(offset / limit) + 1;

  const response = await fetch(
    `${API_BASE_URL}/api/members/${userId}/bookmarks?page=${page}&limit=${limit}`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch bookmarks (${response.status})`);
  }

  const body = await response.json();
  const rows: BookmarkedSeriesApiRecord[] = body.data ?? [];
  const total = body.meta?.total ?? rows.length;
  const nextOffset = offset + rows.length;
  const hasMore = nextOffset < total;

  return {
    data: rows.map((row) => ({ ...row, is_bookmarked: true })),
    meta: {
      next_cursor: hasMore ? String(nextOffset) : null,
      has_more: hasMore,
      total_count: total,
    },
  };
}

export async function removeBookmarkApi(seriesId: string): Promise<RemoveBookmarkResponse> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/bookmark`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to remove bookmark (${response.status})`);
  }

  return { success: true, series_id: seriesId };
}

export async function addBookmarkApi(seriesId: string): Promise<RemoveBookmarkResponse> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/bookmark`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to add bookmark (${response.status})`);
  }

  return { success: true, series_id: seriesId };
}