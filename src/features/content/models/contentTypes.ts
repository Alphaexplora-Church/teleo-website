// Model Layer: Pure TypeScript data declarations & schema mappings

export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'sunday_service' | 'devotional' | 'bible_study' | 'general';
export type MediaType = 'youtube' | 'vimeo' | 'audio_mp3' | 'podcast' | null;

export interface ContentCategory {
  category_id: string;
  name: string;
  sort_order: number;
}

export interface ContentPart {
  part_id: string;
  series_id: string;
  part_order: number;
  title: string;
  media_url?: string | null;
  media_type?: MediaType;
  media_duration_seconds?: number | null;
  reading_text?: string | null;
  estimated_read_time_minutes?: number | null;
  status: ContentStatus;
  is_completed?: boolean;
  published_at?: string | null;
}

export interface ContentSeriesSummary {
  series_id: string;
  church_id: number;
  title: string;
  description?: string | null;
  summary?: string | null;
  content_type: ContentType;
  thumbnail_url?: string | null;
  status: ContentStatus;
  categories: string[];
  total_parts: number;
  completed_parts?: number;
  percent_complete?: number;
  last_activity_at?: string | null;
  is_bookmarked?: boolean;
}

export interface ContentSeriesDetail extends ContentSeriesSummary {
  parts: ContentPart[];
}
