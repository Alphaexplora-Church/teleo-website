export type PostCategory = 'Announcement' | 'Events';

// Recurring schedule (SCRUM-228): weekly on recurrence_day 0 (Sunday) - 6,
// or monthly on day 1 - 31.
export type RecurrenceType = 'weekly' | 'monthly';

export interface HeroSlide {
  id: string;
  kind: 'gospel' | 'event';
  imageUrl: string;
  postId?: string;
  title?: string;
  location?: string;
  month?: string;
  day?: string;
  time?: string;
}

export interface FeedPostModel {
  id: string;
  author: string;
  meta: string;
  category: PostCategory;
  title: string;
  tags: string[];
  body: string;
  schedule?: string;
  details?: string[];
  imageUrl?: string;
  imageAlt?: string;
  date?: string;
  time?: string;
  location?: string;
  locationNote?: string;
  fee?: string;
  speakers?: string;
  participants?: string;
  dressCode?: string;
  /** For a recurring post, the start of its next occurrence. */
  startDate?: string | null;
  createdAt?: string;
  /** "Every Thursday", "Monthly on the 15th"; only on recurring posts. */
  recurrenceLabel?: string;
}

export interface ContentFeedMedia {
  id: string;
  url: string;
  media_type: 'image' | 'video';
  sort_order: number;
}

/**
 * One row of GET /api/contents/feed: the v_church_feed view of the
 * events_announcements schema. Announcements have no location or dates.
 */
export interface ContentFeedRecord {
  post_id: string;
  church_id: number | string;
  post_type: 'announcement' | 'event';
  title: string;
  body: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_paid: boolean;
  fee_amount: number | string;
  currency: string;
  capacity_limit: number | null;
  is_full: boolean;
  status: 'active';
  created_at: string;
  media: ContentFeedMedia[];
  // Not in the view yet; read when the schema adds them.
  author_username?: string | null;
  recurrence_type?: RecurrenceType | null;
  recurrence_day?: number | null;
  /** Next occurrences computed by the API; start_date is only the first one. */
  next_occurrences?: { start_date: string; end_date: string | null }[] | null;
}

export interface ContentFeedResponse {
  data: ContentFeedRecord[];
  message: string;
}

export const SERMON_IMAGE =
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=85';
export const EVENT_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85';

export const GOSPEL_SLIDE: HeroSlide = {
  id: 'gospel',
  kind: 'gospel',
  imageUrl: SERMON_IMAGE,
};
