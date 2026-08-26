// Model Layer: Pure TypeScript API contracts & Request/Response payload definitions
import type { ContentCategory, ContentSeriesSummary, ContentSeriesDetail } from './contentTypes';

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
