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

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)/i;

export type EmbedKind = 'iframe' | 'audio' | 'link';

export interface MediaEmbed {
  kind: EmbedKind;
  src: string;
}

/**
 * Providers serve their watch pages with X-Frame-Options set, so the stored
 * media_url cannot go straight into an iframe — it has to be translated to
 * the provider's player URL first. Anything we cannot translate is offered
 * as a plain link rather than an empty grey box.
 */
export function toMediaEmbed(
  mediaUrl?: string | null,
  startSeconds: number = 0
): MediaEmbed | null {
  if (!mediaUrl) return null;

  const youtube = mediaUrl.match(YOUTUBE_ID);
  if (youtube) {
    const start = startSeconds > 0 ? `?start=${Math.floor(startSeconds)}` : '';
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}${start}` };
  }

  const vimeo = mediaUrl.match(VIMEO_ID);
  if (vimeo) {
    const start = startSeconds > 0 ? `#t=${Math.floor(startSeconds)}s` : '';
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}${start}` };
  }

  if (/\.(mp3|m4a|aac|wav|ogg)(\?|$)/i.test(mediaUrl)) {
    return { kind: 'audio', src: mediaUrl };
  }

  return { kind: 'link', src: mediaUrl };
}
