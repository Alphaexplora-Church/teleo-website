// Model Layer: Pure TypeScript data declarations for the individual chapter/reading view

import type { MediaType } from '../../models/contentTypes';

export interface ReaderChapterDetail {
  part_id: string;
  series_id: string;
  part_order: number;
  title: string;
  series_title: string;
  church_name?: string;
  total_parts: number;

  // Media payload
  media_url?: string | null;
  media_type?: MediaType;
  media_duration_seconds?: number | null;

  // Text payload
  reading_text?: string | null;
  estimated_read_time_minutes?: number | null;

  // Progress state
  is_completed: boolean;
  last_scroll_percentage?: number;
  last_media_timestamp_seconds?: number;

  // Chapter Navigation
  previous_part_id?: string | null;
  next_part_id?: string | null;
}
