// Model Layer: Pure TypeScript API contracts for Chapter Reading & Progress tracking
import type { ReaderChapterDetail } from './contentReaderTypes';

export interface GetChapterPayloadParams {
  series_id: string;
  part_id: string;
  user_id: string;
}

export interface ChapterPayloadResponse {
  chapter: ReaderChapterDetail;
}

export interface SaveProgressPayload {
  series_id: string;
  part_id: string;
  user_id: string;
  scroll_percentage?: number;
  media_timestamp_seconds?: number;
  is_completed?: boolean;
}
