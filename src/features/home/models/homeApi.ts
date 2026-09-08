import {
  EVENT_IMAGE,
  GOSPEL_SLIDE,
  STATIC_SAMPLE_EVENT_POSTS,
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

// TO DO: Replace static church fallback with live author church relation once backend exposes author home church
const resolvePostAuthor = (record: ContentFeedRecord): string => {
  const raw = record as unknown as Record<string, unknown>;
  const username = record.author_username?.trim();
  const rawChurchName =
    (typeof raw.church_name === 'string' && raw.church_name.trim()) ||
    (typeof raw.author_church_name === 'string' && raw.author_church_name.trim()) ||
    (typeof raw.home_church_name === 'string' && raw.home_church_name.trim());

  const isAdmin =
    raw.is_admin === true ||
    raw.role === 'admin' ||
    raw.role === 'system_admin' ||
    !username ||
    username.toLowerCase() === 'admin' ||
    username.toLowerCase() === 'church admin' ||
    username.toLowerCase() === 'system admin';

  if (isAdmin) {
    return 'System Admin';
  }

  if (rawChurchName) {
    return rawChurchName;
  }

  // Static fallback data for church name if post is authored by a user
  return 'Grace Community Church';
};

export const mapContentFeedRecord = (record: ContentFeedRecord): FeedPostModel => {
  const startTime = formatTime(record.start_date);
  const endTime = formatTime(record.end_date);
  const time =
    startTime && endTime
      ? `${startTime} – ${endTime}`
      : startTime ?? undefined;
  const isEvent = record.type_content === 'event';
  const tags = getTags(record);
  const formattedDate = formatDate(record.start_date);
  const location = record.location?.trim() || undefined;

  const raw = record as unknown as Record<string, unknown>;
  const fee = typeof raw.fee === 'string' && raw.fee.trim() ? raw.fee.trim() : undefined;
  const speakers =
    typeof raw.speakers === 'string' && raw.speakers.trim()
      ? raw.speakers.trim()
      : undefined;
  const participants =
    typeof raw.participants === 'string' && raw.participants.trim()
      ? raw.participants.trim()
      : undefined;
  const rawDressCode =
    typeof raw.dress_code === 'string' && raw.dress_code.trim()
      ? raw.dress_code.trim()
      : typeof raw.dressCode === 'string' && raw.dressCode.trim()
        ? raw.dressCode.trim()
        : undefined;
  const isDressCodeSpecified =
    rawDressCode &&
    !['not specified', 'none', 'n/a', 'null', 'undefined'].includes(
      rawDressCode.toLowerCase(),
    );
  const dressCode = isDressCodeSpecified ? rawDressCode : undefined;

  return {
    id: String(record.id),
    author: resolvePostAuthor(record),
    meta: formatTimeAgo(record.created_at),
    category: isEvent ? 'Events' : 'Announcement',
    title: record.title,
    tags: tags.length > 0 ? tags : [isEvent ? 'Event' : 'Church Update'],
    body: record.description?.trim() || '',
    details: isEvent
      ? [location, formattedDate, startTime]
        .filter((value): value is string => Boolean(value))
      : undefined,
    imageUrl: getImageUrl(record) ?? undefined,
    imageAlt: record.title,
    date: isEvent && record.start_date ? formattedDate : undefined,
    time: isEvent ? time : undefined,
    location: isEvent ? location : undefined,
    locationNote: isEvent && location ? 'Event location' : undefined,
    fee: isEvent ? fee : undefined,
    speakers: isEvent ? speakers : undefined,
    participants: isEvent ? participants : undefined,
    dressCode: isEvent ? dressCode : undefined,
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

  // TO DO: DELETE STATIC DATA - Prepending static sample event posts for testing UI designs
  return [
    ...STATIC_SAMPLE_EVENT_POSTS,
    ...json.data.map(mapContentFeedRecord),
  ];
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
