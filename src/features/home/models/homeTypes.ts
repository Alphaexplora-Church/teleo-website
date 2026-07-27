export type PostCategory = 'Announcement' | 'Events';

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
  date: string;
  time: string;
  location: string;
  locationNote: string;
  fee: string;
  organizer: string;
  speakers: string;
  participants: string;
  dressCode: string;
  startDate?: string | null;
  createdAt?: string;
}

export interface ContentFeedMedia {
  id: number | string;
  content_id: number | string;
  media_type: 'image' | 'video' | 'youtube';
  file_url: string | null;
  youtube_url: string | null;
  created_at: string;
}

export interface ContentFeedRecord {
  id: number | string;
  church_id: number | string;
  user_id: string | null;
  type_content: 'announcement' | 'event';
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  category_content: string | null;
  status: 'active';
  created_at: string;
  updated_at: string;
  author_username: string | null;
  author_profile_picture_url: string | null;
  media: ContentFeedMedia[];
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
