// features/content/models/discoverMockData.ts
// Standalone mock content so the Discover screen renders fully without a backend.
// Swap this module for a real API layer (see models/homeApi.ts for the pattern
// used elsewhere in this codebase) once the content service is available.

import type {
  DiscoverCourse,
  DiscoverNotification,
  DiscoverSection,
  DiscoverUser,
} from './discoverTypes';

export const DISCOVER_USER: DiscoverUser = {
  firstName: 'Jane',
};

const course = (overrides: Partial<DiscoverCourse> & Pick<DiscoverCourse, 'id' | 'title'>): DiscoverCourse => ({
  formatLabel: 'Lesson',
  format: 'lesson',
  duration: '6h 30min',
  thumbnailUrl: '',
  thumbnailAlt: overrides.title,
  isBookmarked: false,
  isDownloaded: false,
  ...overrides,
});

export const DISCOVER_SECTIONS: DiscoverSection[] = [
  {
    id: 'for-starters',
    title: 'For Starters',
    showAll: false,
    courses: [
      course({
        id: 'starter-1',
        title: 'Foundations of Faith',
        formatLabel: '(7 chapters)',
        format: 'chapters',
        duration: '6h 30min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80',
        isBookmarked: true,
        isDownloaded: true,
      }),
      course({
        id: 'starter-2',
        title: 'Understanding Prayer',
        formatLabel: '(5 chapters)',
        format: 'chapters',
        duration: '4h 10min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
      }),
      course({
        id: 'starter-3',
        title: 'The Gospel in Everyday Life',
        formatLabel: '(6 chapters)',
        format: 'chapters',
        duration: '5h 45min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
        isDownloaded: true,
      }),
      course({
        id: 'starter-4',
        title: 'New Believer\u2019s Journey',
        formatLabel: '(4 chapters)',
        format: 'chapters',
        duration: '3h 20min',
        // Intentionally broken URL to demonstrate the card's image fallback state.
        thumbnailUrl: 'https://broken.invalid/new-believers-journey.jpg',
      }),
    ],
  },
  {
    id: 'business',
    title: 'Business',
    showAll: true,
    courses: [
      course({
        id: 'business-1',
        title: 'Faith-Driven Leadership',
        formatLabel: 'Lesson',
        format: 'lesson',
        duration: '2h 15min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
        isBookmarked: true,
      }),
      course({
        id: 'business-2',
        title: 'Stewardship & Finances',
        formatLabel: 'Lesson',
        format: 'lesson',
        duration: '1h 50min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        isDownloaded: true,
      }),
      course({
        id: 'business-3',
        title: 'Purposeful Work Ethics',
        formatLabel: 'Lesson',
        format: 'lesson',
        duration: '2h 05min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      }),
    ],
  },
  {
    id: 'reading',
    title: 'Reading',
    showAll: true,
    courses: [
      course({
        id: 'reading-1',
        title: 'Psalms for the Weary',
        formatLabel: 'Reading',
        format: 'reading',
        duration: '1h 05min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      }),
      course({
        id: 'reading-2',
        title: 'Letters to the Early Church',
        formatLabel: 'Reading',
        format: 'reading',
        duration: '2h 40min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
        isBookmarked: true,
        isDownloaded: true,
      }),
      course({
        id: 'reading-3',
        title: 'Parables & Their Meaning',
        formatLabel: 'Reading',
        format: 'reading',
        duration: '3h 15min',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80',
      }),
    ],
  },
];

export const DISCOVER_NOTIFICATIONS: DiscoverNotification[] = [
  {
    id: 'notif-1',
    title: 'New chapter unlocked',
    message: '"Foundations of Faith" just added Chapter 7.',
    timeAgo: '2h ago',
    isUnread: true,
  },
  {
    id: 'notif-2',
    title: 'Continue your reading',
    message: 'You left off on "Letters to the Early Church".',
    timeAgo: '5h ago',
    isUnread: true,
  },
  {
    id: 'notif-3',
    title: 'Download complete',
    message: '"Stewardship & Finances" is ready offline.',
    timeAgo: '1d ago',
    isUnread: false,
  },
];
