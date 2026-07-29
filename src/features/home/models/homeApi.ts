import {
  EVENT_IMAGE,
  GOSPEL_SLIDE,
  type ContentFeedRecord,
  type ContentFeedResponse,
  type FeedPostModel,
  type HeroSlide,
} from './homeTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ChurchMembershipRequiredError extends Error {
  constructor() {
    super('A church membership is required to load the home feed.');
    this.name = 'ChurchMembershipRequiredError';
  }
}

const formatTimeAgo = (value: string) => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Recently';

  const elapsed = Math.max(Date.now() - timestamp, 0);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed < minute) return 'Just now';
  if (elapsed < hour) return `${Math.floor(elapsed / minute)} mins ago`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)} hrs ago`;
  if (elapsed < 7 * day) return `${Math.floor(elapsed / day)} days ago`;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
};

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value: string | null) => {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(date)
    : 'Date to be announced';
};

const formatTime = (value?: string | null) => {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    : null;
};

const getImageUrl = (record: ContentFeedRecord) =>
  record.media.find((item) => item.media_type === 'image' && item.file_url)?.file_url;

const getTags = (record: ContentFeedRecord) =>
  record.category_content
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

export const mapContentFeedRecord = (record: ContentFeedRecord): FeedPostModel => {
  const startTime = formatTime(record.start_date);
  const endTime = formatTime(record.end_date);
  const time =
    startTime && endTime
      ? `${startTime} – ${endTime}`
      : startTime ?? 'Time to be announced';
  const isEvent = record.type_content === 'event';
  const tags = getTags(record);

  return {
    id: String(record.id),
    author: record.author_username?.trim() || 'Church Admin',
    meta: formatTimeAgo(record.created_at),
    category: isEvent ? 'Events' : 'Announcement',
    title: record.title,
    tags: tags.length > 0 ? tags : [isEvent ? 'Event' : 'Church Update'],
    body: record.description?.trim() || 'More details will be shared soon.',
    details: isEvent
      ? [record.location, formatDate(record.start_date), startTime]
          .filter((value): value is string => Boolean(value))
      : undefined,
    imageUrl: getImageUrl(record) ?? undefined,
    imageAlt: record.title,
    date: formatDate(record.start_date),
    time,
    location: record.location?.trim() || 'Location to be announced',
    locationNote: record.location?.trim() ? 'Event location' : 'Check back for updates',
    fee: 'Not specified',
    organizer: record.author_username?.trim() || 'Church Admin',
    speakers: 'To be announced',
    participants: 'Open to church members',
    dressCode: 'Not specified',
    startDate: record.start_date,
    createdAt: record.created_at,
  };
};

export const isEventWithinFifteenDays = (
  post: FeedPostModel,
  today = new Date(),
) => {
  if (post.category !== 'Events' || !post.startDate) return false;

  const startDate = parseDate(post.startDate);
  if (!startDate) return false;

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfWindow = new Date(startOfToday);
  endOfWindow.setDate(endOfWindow.getDate() + 16);

  return startDate >= startOfToday && startDate < endOfWindow;
};

export const toEventHeroSlide = (post: FeedPostModel): HeroSlide => {
  const date = parseDate(post.startDate);

  return {
    id: `event-${post.id}`,
    kind: 'event',
    postId: post.id,
    imageUrl: post.imageUrl || EVENT_IMAGE,
    title: post.title,
    location: post.location,
    month: date
      ? new Intl.DateTimeFormat(undefined, { month: 'short' })
          .format(date)
          .toUpperCase()
      : 'TBA',
    day: date ? String(date.getDate()) : '—',
    time: formatTime(post.startDate) ?? 'Time TBA',
  };
};

export const fetchHomeFeed = async (): Promise<FeedPostModel[]> => {
  const response = await fetch(`${API_BASE_URL}/api/contents/feed`, {
    credentials: 'include',
  });
  const json = (await response.json().catch(() => null)) as ContentFeedResponse | null;

  if (!response.ok) {
    const errorMessage =
      (json as { error?: { message?: string } } | null)?.error?.message;

    if (errorMessage?.toLowerCase().includes('church id not found')) {
      throw new ChurchMembershipRequiredError();
    }

    throw new Error(
      errorMessage || `Unable to load the home feed (${response.status}).`,
    );
  }

  if (!Array.isArray(json?.data)) {
    throw new Error('The home feed returned an invalid response.');
  }

  return json.data.map(mapContentFeedRecord);
};

export const buildHeroSlides = (posts: FeedPostModel[]): HeroSlide[] => [
  GOSPEL_SLIDE,
  ...posts
    .filter((post) => isEventWithinFifteenDays(post))
    .sort(
      (first, second) =>
        new Date(first.startDate!).getTime() - new Date(second.startDate!).getTime(),
    )
    .map(toEventHeroSlide),
];
