// Model Layer: Pure TypeScript API contracts & Request/Response payload definitions
import type {
  ContentCategory,
  ContentSeriesSummary,
  ContentSeriesDetail,
  ContentPart,
  ContentStatus,
  MediaType,
} from './contentTypes';
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

interface ApiPart {
  partId: string;
  journeyId?: string;
  partOrder: number;
  title: string;
  mediaUrl?: string | null;
  mediaType?: MediaType;
  mediaDurationSeconds?: number | null;
  readingText?: string | null;
  estimatedReadTimeMinutes?: number | null;
  status: ContentStatus;
  isCompleted?: boolean;
  lastResumedPositionSeconds?: number;
}

const toContentPart = (row: ApiPart, seriesId: string): ContentPart => ({
  part_id: row.partId,
  series_id: row.journeyId ?? seriesId,
  part_order: row.partOrder,
  title: row.title,
  media_url: row.mediaUrl ?? null,
  media_type: row.mediaType ?? null,
  media_duration_seconds: row.mediaDurationSeconds ?? null,
  reading_text: row.readingText ?? null,
  estimated_read_time_minutes: row.estimatedReadTimeMinutes ?? null,
  status: row.status,
  is_completed: row.isCompleted === true,
});

export async function fetchSeriesDetail(seriesId: string): Promise<ContentSeriesDetail> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404 ? 'This journey is no longer available.' : `Failed to load journey (${response.status})`
    );
  }

  const body = await response.json();
  const summary = toSeriesSummary(body.journey as ApiJourney);

  return {
    ...summary,
    parts: ((body.parts ?? []) as ApiPart[])
      .map((row) => toContentPart(row, seriesId))
      .sort((a, b) => a.part_order - b.part_order),
  };
}

export interface JourneyProgress {
  completed_parts: number;
  total_parts: number;
  percent_complete: number;
  progress_status: 'not_started' | 'in_progress' | 'completed';
  resume_part_id: string | null;
}

export async function fetchJourneyProgress(seriesId: string): Promise<JourneyProgress> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/progress`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to load progress (${response.status})`);
  }

  const body = await response.json();

  return {
    completed_parts: Number(body.completedParts ?? 0),
    total_parts: Number(body.totalPublishedParts ?? 0),
    percent_complete: Number(body.completionPercentage ?? 0),
    progress_status: body.progressStatus ?? 'not_started',
    resume_part_id: body.resumePartId ?? null,
  };
}

/**
 * Feeds discovery ranking only. Deduped server-side to once per member per
 * journey per day, so it is safe to call on every open, and a failure here
 * must never block the screen.
 */
export async function recordJourneyView(seriesId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/view`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => undefined);
}

/** Opening a part is what enrolls the member; there is no separate start-journey call. */
export async function startPart(seriesId: string, partId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/parts/${partId}/start`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to open this part (${response.status})`);
  }
}

export interface CompletePartResult {
  completed: boolean;
  percent_complete: number;
  progress_status: 'not_started' | 'in_progress' | 'completed';
}

export async function completePart(
  seriesId: string,
  partId: string,
  completed: boolean = true
): Promise<CompletePartResult> {
  const response = await fetch(`${API_BASE_URL}/api/journeys/${seriesId}/parts/${partId}/complete`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update progress (${response.status})`);
  }

  const body = await response.json();

  return {
    completed: body.completed === true,
    percent_complete: Number(body.completionPercentage ?? 0),
    progress_status: body.progressStatus ?? 'in_progress',
  };
}
