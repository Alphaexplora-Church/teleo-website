import type { ContentSeriesSummary } from './contentTypes';
import type { BookmarkedSeriesApiRecord } from './myListTypes';

export interface ApiJourney {
  journeyId: string;
  churchId: number;
  title: string;
  description: string | null;
  summary: string | null;
  contentType: string;
  thumbnailUrl: string | null;
  status: string;
  categories: string[];
  categoryIds: string[];
  totalPublishedParts: number;
  createdAt: string;
  updatedAt: string;
}

export const toSeriesSummary = (j: ApiJourney): ContentSeriesSummary => ({
  series_id: j.journeyId,
  church_id: j.churchId,
  title: j.title,
  description: j.description,
  summary: j.summary,
  content_type: j.contentType as ContentSeriesSummary['content_type'],
  thumbnail_url: j.thumbnailUrl,
  status: j.status as ContentSeriesSummary['status'],
  categories: j.categories ?? [],
  total_parts: j.totalPublishedParts ?? 0,
});

export const toBookmarkedRecord = (j: ApiJourney): BookmarkedSeriesApiRecord => ({
  series_id: j.journeyId,
  church_id: j.churchId,
  title: j.title,
  description: j.description ?? null,
  summary: j.summary ?? null,
  content_type: j.contentType as BookmarkedSeriesApiRecord['content_type'],
  thumbnail_url: j.thumbnailUrl,
  status: j.status as BookmarkedSeriesApiRecord['status'],
  categories: j.categories ?? [],
  total_parts: j.totalPublishedParts ?? 0,
  is_bookmarked: true,
});
