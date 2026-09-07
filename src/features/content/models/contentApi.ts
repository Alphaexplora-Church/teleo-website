// Model Layer: Pure TypeScript API contracts & Request/Response payload definitions
import type { ContentCategory, ContentSeriesSummary, ContentSeriesDetail } from './contentTypes';
import { toSeriesSummary, type ApiJourney } from './journeyMapper';
import { getCachedUserId, refreshCurrentUser } from '../../../shared/models/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface GetContentCatalogParams {
  church_id: number;
  content_type?: string;
  category_id?: string;
}

export interface ContentCatalogResponse {
  featured: ContentSeriesSummary | null;
  continue_rail: ContentSeriesSummary[];
  bookmarks_rail: ContentSeriesSummary[];
  category_rails: {
    category_id: string;
    category_name: string;
    series: ContentSeriesSummary[];
  }[];
  categories: ContentCategory[];
}

export interface GetSeriesDetailParams {
  series_id: string;
  user_id: string;
}

export interface SeriesDetailResponse {
  series: ContentSeriesDetail;
}

export interface ToggleBookmarkRequest {
  series_id: string;
  user_id: string;
}

export interface RecordProgressRequest {
  series_id: string;
  part_id: string;
  user_id: string;
  church_id: number;
  is_completed: boolean;
}

export async function searchJourneys(query: string): Promise<ContentSeriesSummary[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/journeys/search?q=${encodeURIComponent(query)}&limit=50`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }

  const body = await response.json();
  return (body.journeys ?? []).map((j: ApiJourney) => toSeriesSummary(j));
}

async function getJourneys(path: string, fallback: string): Promise<ContentSeriesSummary[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`${fallback} (${response.status})`);
  }

  const body = await response.json();
  return ((body.journeys ?? body.similarJourneys ?? []) as ApiJourney[]).map(toSeriesSummary);
}

export function fetchDiscoverJourneys(limit: number = 50): Promise<ContentSeriesSummary[]> {
  return getJourneys(`/api/journeys/discover?limit=${limit}`, 'Failed to load journeys');
}

export type RecommendedRowType = 'most_watched' | 'because_you_watched';

export function fetchRecommendedJourneys(type: RecommendedRowType): Promise<ContentSeriesSummary[]> {
  return getJourneys(`/api/journeys/recommended?type=${type}`, 'Failed to load recommendations');
}

export function fetchSimilarJourneys(seriesId: string): Promise<ContentSeriesSummary[]> {
  return getJourneys(`/api/journeys/${seriesId}/similar`, 'Failed to load similar journeys');
}

export async function fetchCategories(): Promise<ContentCategory[]> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/categories`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to load categories (${response.status})`);
  }

  const body = await response.json();

  return ((body.categories ?? []) as { categoryId: string; name: string; sortOrder: number }[])
    .map((row) => ({ category_id: row.categoryId, name: row.name, sort_order: row.sortOrder }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export interface MemberJourneyProgress {
  series_id: string;
  title: string;
  completed_parts: number;
  total_parts: number;
  percent_complete: number;
  progress_status: 'not_started' | 'in_progress' | 'completed';
  started_at: string | null;
  last_activity_at: string | null;
}

export async function fetchMemberJourneys(
  status?: 'in_progress' | 'completed' | 'not_started'
): Promise<MemberJourneyProgress[]> {
  const userId = getCachedUserId() ?? (await refreshCurrentUser());
  if (!userId) throw new Error('Not signed in');

  const query = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE_URL}/api/members/${userId}/journeys${query}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to load your journeys (${response.status})`);
  }

  const body = await response.json();

  return ((body.journeys ?? []) as Record<string, unknown>[]).map((row) => ({
    series_id: String(row.journeyId),
    title: String(row.title ?? ''),
    completed_parts: Number(row.completedParts ?? 0),
    total_parts: Number(row.totalPublishedParts ?? 0),
    percent_complete: Number(row.completionPercentage ?? 0),
    progress_status: (row.status ?? 'not_started') as MemberJourneyProgress['progress_status'],
    started_at: (row.startedAt as string) ?? null,
    last_activity_at: (row.lastActivityAt as string) ?? null,
  }));
}
