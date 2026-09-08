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
  date?: string;
  time?: string;
  location?: string;
  locationNote?: string;
  fee?: string;
  speakers?: string;
  participants?: string;
  dressCode?: string;
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

// ==========================================
// TO DO: DELETE STATIC DATA
// Static sample posts for UI testing:
// 1. Main event details only (Date, Location, Fee)
// 2. Event information only (Speakers, Participants, Dress Code)
// 3. Both main event details and event information
// ==========================================
export const STATIC_SAMPLE_EVENT_POSTS: FeedPostModel[] = [
  {
    id: 'static-sample-event-main-details',
    author: 'Grace Community Church',
    meta: '2 hours ago',
    category: 'Events',
    title: 'Sample Event (Main Event Details Design)',
    tags: ['Event', 'Main Details Only'],
    body: 'This sample event demonstrates the layout when only the main event details (Date/Time, Location, and Event Fee) are provided.',
    details: ['Grace Sanctuary, Main Hall', 'Saturday, October 24, 2026', '10:00 AM'],
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Sample Event (Main Event Details Design)',
    date: 'Saturday, October 24, 2026',
    time: '10:00 AM – 1:00 PM',
    location: 'Grace Sanctuary, Main Hall',
    locationNote: 'Event location',
    fee: 'Free Admission',
    speakers: undefined,
    participants: undefined,
    dressCode: undefined,
    startDate: '2026-10-24T10:00:00Z',
    createdAt: '2026-09-07T10:00:00Z',
  },
  {
    id: 'static-sample-event-info-details',
    author: 'Grace Community Church',
    meta: '4 hours ago',
    category: 'Events',
    title: 'Sample Event (Event Information Details Design)',
    tags: ['Event', 'Event Info Only'],
    body: 'This sample event demonstrates the layout when only event information (Speakers/Guests, Participants, and Dress Code) is specified.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Sample Event (Event Information Details Design)',
    date: undefined,
    time: undefined,
    location: undefined,
    locationNote: undefined,
    fee: undefined,
    speakers: 'Pastor John Doe\nGuest Speaker Jane Smith',
    participants: 'Open to all youth, young adults, and ministry volunteers',
    dressCode: 'Smart Casual / Comfortable Attire',
    startDate: undefined,
    createdAt: '2026-09-07T08:00:00Z',
  },
  {
    id: 'static-sample-event-both-details',
    author: 'Grace Community Church',
    meta: '1 day ago',
    category: 'Events',
    title: 'Sample Event (Main and Event Information Details Design)',
    tags: ['Event', 'Both Details'],
    body: 'This sample event demonstrates the complete layout when both main event details and event information sections are specified.',
    details: ['Community Fellowship Center', 'Sunday, November 15, 2026', '2:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Sample Event (Main and Event Information Details Design)',
    date: 'Sunday, November 15, 2026',
    time: '2:00 PM – 5:00 PM',
    location: 'Community Fellowship Center',
    locationNote: 'Event location',
    fee: '$10 Registration Fee',
    speakers: 'Bishop Michael Roberts\nDr. Sarah Jenkins',
    participants: 'All Church Members, Families & Friends',
    dressCode: 'Sunday Best / Semi-Formal',
    startDate: '2026-11-15T14:00:00Z',
    createdAt: '2026-09-06T14:00:00Z',
  },
];

