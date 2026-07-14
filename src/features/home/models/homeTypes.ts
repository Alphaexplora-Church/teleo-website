// Home-domain contracts remain framework-free so the model can be reused by
// future API mappers without coupling it to React or presentation concerns.
export type PostCategory = 'Announcement' | 'Services' | 'Events' | 'Discussion';

export interface HeroSlide { id: 'gospel' | 'event'; imageUrl: string; }

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
  imageTall?: boolean;
  date: string;
  time: string;
  location: string;
  locationNote: string;
  fee: string;
  organizer: string;
  speakers: string;
  participants: string;
  dressCode: string;
}

// Centralized media references prevent individual views from owning content data.
export const SERMON_IMAGE = 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=85';
export const COMMUNION_IMAGE = 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=900&q=85';
export const EVENT_IMAGE = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85';

export const HERO_SLIDES: HeroSlide[] = [{ id: 'gospel', imageUrl: SERMON_IMAGE }, { id: 'event', imageUrl: EVENT_IMAGE }];

// These defaults represent information shared by the current mock events.
// When the backend is connected, each mapped post can override any field.
const sharedDetails = {
  location: 'Someplace, Paranaque', locationNote: 'Complete address with Google Maps link', fee: '₱200.00 / pax',
  organizer: 'Ministry Church\nSpecial thanks to the volunteers', speakers: 'Christian Youth Choir\nPastor John', participants: '100+ Registered', dressCode: 'Semi-Casual',
};

// Mock content intentionally lives in the model layer; views receive only
// prepared FeedPostModel objects through the Home ViewModel.
export const HOME_POSTS: FeedPostModel[] = [
  { id: 'announcement', author: 'Pastor John', meta: 'Ministry Church • 30 mins ago', category: 'Announcement', title: 'Sunday Service Schedule Change', tags: ['Worship', 'Community', 'Sunday'], body: 'Starting next week, our Sunday Service will begin at 9:30 AM instead of 10:00 AM. Please make a note of this change and adjust your schedule accordingly.', schedule: 'New Schedule:\n◷ New Service Time: 9:30 AM', imageUrl: SERMON_IMAGE, imageAlt: 'Pastor celebrating Sunday service', date: 'Sunday, July 19', time: '9:30 AM – 11:00 AM', ...sharedDetails },
  { id: 'communion', author: 'Pastor John', meta: 'Ministry Church • June 1', category: 'Services', title: 'Communion Services Open!', tags: ['Communion', 'Mass', 'Faith'], body: 'Holy Mass will be available every Sunday at the Ministry Church. Everyone is welcome to join us in prayer and fellowship.', imageUrl: COMMUNION_IMAGE, imageAlt: 'Communion service', imageTall: true, date: 'Sunday, July 26', time: '8:00 AM – 10:00 AM', ...sharedDetails },
  { id: 'event', author: 'Pastor John', meta: 'Ministry Church • 30 mins ago', category: 'Events', title: 'PRAISE! Youth Worship Charity Concert', tags: ['Music', 'Youth', 'Community'], details: ['● Paranaque, 1713', '▣ March 10, 2026', '◷ 6:00 PM'], body: 'Join us for an uplifting evening of worship, music, and fellowship in support of our youth charity programs. The proceeds will help fund community outreach and learning activities. Everyone is welcome to celebrate, connect, and worship with us.', schedule: 'Doors open at 5:30 PM', imageUrl: EVENT_IMAGE, imageAlt: 'Youth worship charity concert gathering', date: 'Sunday, March 10', time: '6:00 PM – 9:00 PM', ...sharedDetails },
  { id: 'discussion', author: 'John', meta: 'Jan 5, 2026', category: 'Discussion', title: 'Couples for Christ Community Night', tags: ['Family', 'Community', 'Fellowship'], body: 'A welcoming evening for couples and families to meet, share stories, and strengthen relationships through faith and community.', date: 'Friday, August 7', time: '6:30 PM – 9:00 PM', ...sharedDetails },
];
