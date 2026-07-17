import {
  mapPrayerCommentRecord,
  mergePrayerComments,
} from './commentApi';
import { fetchProfileSettingsView } from '../../profile/models/profileApi';
import type { PrayerComment } from './commentTypes';
import type {
  CreatePrayerPayload,
  PrayerApiRecord,
  PrayerApiRecordWithComments,
  PrayerCard,
  PrayerCardsPage,
  PrayerFeedResponse,
  PrayerReactionRecord,
  PrayerReactionType,
  UpdatePrayerPayload,
} from './prayerTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const PRAYER_THEME_COLORS = [
  '#1e3a5f',
  '#129e9a',
  '#8426d6',
  '#c71961',
  '#dd7600',
  '#079a73',
];
const MOCK_PRAYER_TITLE_PATTERN = /^prayers?\s+\d+$/i;
const MOCK_PRAYER_DESCRIPTION_PATTERNS = [
  /^card details/i,
  /^this space can become/i,
  /^only i can see this post/i,
];
const MOCK_PRAYER_TITLE_SUBSTRINGS = ['update (public)'];

const getAccessToken = () => localStorage.getItem('access_token');

const getRequiredAccessToken = () => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('You need to log in to access the Prayer Wall.');
  }

  return token;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : null) ||
      (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : null) ||
      'Prayer Wall request failed.';

    throw new Error(message);
  }

  return data as T;
};

const formatTimeAgo = (timestamp: string) => {
  const now = Date.now();
  const date = new Date(timestamp).getTime();

  if (Number.isNaN(date)) {
    return 'Recently';
  }

  const diffMs = Math.max(now - date, 0);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return 'Just now';
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(diffMs / day);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const hashToThemeColor = (seed: string) => {
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return PRAYER_THEME_COLORS[hash % PRAYER_THEME_COLORS.length];
};

const toPrayerSubject = (title: string) => title.trim() || 'Prayer Request';

const splitPrayerTags = (tag: string | null) =>
  tag
    ? tag
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const getPrayerAuthorName = (record: PrayerApiRecord) => {
  const authorFields = [
    record.author_name,
    record.username,
    record.full_name,
    record.display_name,
    record.name,
  ];

  return authorFields.find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )?.trim() ?? null;
};

const applyCurrentUserAuthorFallback = async (prayers: PrayerCard[]) => {
  const currentUserId = getCurrentUserId();

  if (!currentUserId || !prayers.some((prayer) => prayer.ownerId === currentUserId && !prayer.author)) {
    return prayers;
  }

  try {
    const profile = await fetchProfileSettingsView();
    const fallbackAuthor = profile.username?.trim() || null;

    if (!fallbackAuthor) {
      return prayers;
    }

    return prayers.map((prayer) =>
      prayer.ownerId === currentUserId && !prayer.author
        ? { ...prayer, author: fallbackAuthor }
        : prayer,
    );
  } catch {
    return prayers;
  }
};

const mapPrayerRecordToCard = (record: PrayerApiRecord): PrayerCard => {
  const recordWithComments = record as PrayerApiRecordWithComments;
  const tag = record.prayer_tag?.trim() || null;
  const tags = splitPrayerTags(tag);

  return {
    id: record.id,
    author: getPrayerAuthorName(record),
    timeAgo: formatTimeAgo(record.created_at),
    title: record.title,
    description: record.description,
    frontMessage: toPrayerSubject(record.title),
    backTitle: record.is_answered ? 'Praise Report' : record.title || 'Prayer Request',
    backDetails: record.is_answered && record.answer_note
      ? `${record.description}\n\nPraise Report: ${record.answer_note}`
      : record.description,
    accentColor: hashToThemeColor(tags[0] ?? record.id),
    tags,
    prayerTag: tag,
    audience: record.audience,
    isAnswered: record.is_answered,
    answerNote: record.answer_note,
    createdAt: record.created_at,
    ownerId: record.user_id,
    comments: (recordWithComments.comments ?? []).map(mapPrayerCommentRecord),
  };
};

const isLikelyMockPrayerRecord = (record: PrayerApiRecord) => {
  const normalizedTitle = record.title.trim();
  const normalizedDescription = record.description.trim();

  if (MOCK_PRAYER_TITLE_PATTERN.test(normalizedTitle)) {
    return true;
  }

  if (
    MOCK_PRAYER_TITLE_SUBSTRINGS.some((substring) =>
      normalizedTitle.toLowerCase().includes(substring),
    )
  ) {
    return true;
  }

  return MOCK_PRAYER_DESCRIPTION_PATTERNS.some((pattern) =>
    pattern.test(normalizedDescription),
  );
};

const isLikelyMockPrayerCard = (prayer: PrayerCard) =>
  MOCK_PRAYER_TITLE_PATTERN.test(prayer.frontMessage.trim()) ||
  MOCK_PRAYER_TITLE_PATTERN.test(prayer.backTitle.trim());

const getPrayerCreatedTime = (prayer: PrayerCard) => {
  const createdTime = new Date(prayer.createdAt).getTime();
  return Number.isNaN(createdTime) ? 0 : createdTime;
};

export const sortPrayerCardsByRecent = (prayers: PrayerCard[]) =>
  [...prayers].sort(
    (firstPrayer, secondPrayer) =>
      getPrayerCreatedTime(secondPrayer) - getPrayerCreatedTime(firstPrayer),
  );

const fetchPrayerFeed = async (cursor?: string | null, limit = 10) => {
  const token = getRequiredAccessToken();
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) {
    params.set('cursor', cursor);
  }

  const response = await fetch(`${API_BASE_URL}/api/prayers?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<PrayerFeedResponse>(response);
};

const fetchPrayerById = async (prayerId: string) => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers/${prayerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<PrayerApiRecordWithComments>(response);
};

export const getCurrentUserId = (): string | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.sub === 'string' ? decoded.sub : null;
  } catch {
    return null;
  }
};

export const getPrayerCards = async (): Promise<PrayerCard[]> => {
  const page = await getPrayerCardsPage();
  return page.prayers;
};

export const getPrayerCardsPage = async (
  cursor?: string | null,
  limit = 10,
): Promise<PrayerCardsPage> => {
  const response = await fetchPrayerFeed(cursor, limit);

  const mappedPrayers = response.data
    .filter((record) => !isLikelyMockPrayerRecord(record))
    .map(mapPrayerRecordToCard)
    .filter((prayer) => !isLikelyMockPrayerCard(prayer));
  const prayers = sortPrayerCardsByRecent(
    await applyCurrentUserAuthorFallback(mappedPrayers),
  );

  return {
    prayers,
    nextCursor: response.meta.next_cursor,
    hasMore: response.meta.has_more,
  };
};

export const getPrayerCardById = async (prayerId: string): Promise<PrayerCard> => {
  const record = await fetchPrayerById(prayerId);
  const [prayer] = await applyCurrentUserAuthorFallback([mapPrayerRecordToCard(record)]);
  return prayer;
};

export const getPrayerComments = (
  prayerId: string,
  serverComments: PrayerComment[],
) => mergePrayerComments(prayerId, serverComments);

export const createPrayer = async (payload: CreatePrayerPayload) => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PrayerApiRecord>(response);
};

export const updatePrayer = async (
  prayerId: string,
  payload: UpdatePrayerPayload,
): Promise<PrayerCard> => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers/${prayerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return mapPrayerRecordToCard(await parseJsonResponse<PrayerApiRecord>(response));
};

export const deletePrayer = async (prayerId: string) => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers/${prayerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await parseJsonResponse<unknown>(response);
};

export const togglePrayerReaction = async (
  prayerId: string,
  reactionType: PrayerReactionType,
) => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers/${prayerId}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reaction_type: reactionType }),
  });

  return parseJsonResponse<PrayerReactionRecord>(response);
};

export const markPrayerAsAnswered = async (
  prayerId: string,
  answerNote: string,
): Promise<PrayerCard> => {
  const token = getRequiredAccessToken();
  const response = await fetch(`${API_BASE_URL}/api/prayers/${prayerId}/praise`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer_note: answerNote }),
  });

  return mapPrayerRecordToCard(await parseJsonResponse<PrayerApiRecord>(response));
};
