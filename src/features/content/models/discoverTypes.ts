// features/content/models/discoverTypes.ts
// Domain types for the Discover / Library screen.

export type DiscoverTabId = 'library' | 'bookshelf' | 'downloads';

export type ContentFormat = 'chapters' | 'lesson' | 'reading';

export interface DiscoverCourse {
  id: string;
  title: string;
  /** Small line under the title, e.g. "(7 chapters)", "Lesson", "Reading" */
  formatLabel: string;
  format: ContentFormat;
  /** Human readable duration, e.g. "6h 30min" */
  duration: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  isBookmarked: boolean;
  isDownloaded: boolean;
}

export interface DiscoverSection {
  id: string;
  title: string;
  /** Whether a "Show all" link should render next to the section title */
  showAll: boolean;
  courses: DiscoverCourse[];
}

export interface DiscoverNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
}

export interface DiscoverUser {
  firstName: string;
}

export const DISCOVER_TABS: { id: DiscoverTabId; label: string }[] = [
  { id: 'library', label: 'Library' },
  { id: 'bookshelf', label: 'Bookshelf' },
  { id: 'downloads', label: 'Downloads' },
];
