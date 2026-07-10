export interface PrayerCommentRecord {
  id: string;
  prayer_id: string;
  user_id: number | string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
}

export interface PrayerComment {
  id: string;
  author: string | null;
  message: string;
  timeAgo: string;
}

const LOCAL_COMMENT_CACHE_KEY = 'teleo_prayer_comments';

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

export const mapPrayerCommentRecord = (
  record: PrayerCommentRecord,
): PrayerComment => ({
  id: record.id,
  author: record.author_name?.trim() || null,
  message: record.content,
  timeAgo: formatTimeAgo(record.created_at),
});

const readLocalCommentCache = (): Record<string, PrayerCommentRecord[]> => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENT_CACHE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeLocalCommentCache = (cache: Record<string, PrayerCommentRecord[]>) => {
  try {
    localStorage.setItem(LOCAL_COMMENT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Backend data remains the source of truth if browser storage is unavailable.
  }
};

const getCachedPrayerComments = (prayerId: string): PrayerComment[] => {
  const cache = readLocalCommentCache();
  return (cache[prayerId] ?? []).map(mapPrayerCommentRecord);
};

export const cachePrayerComment = (
  prayerId: string,
  comment: PrayerCommentRecord,
) => {
  const cache = readLocalCommentCache();
  const existingComments = cache[prayerId] ?? [];
  const alreadyCached = existingComments.some((item) => item.id === comment.id);

  if (alreadyCached) {
    return;
  }

  cache[prayerId] = [...existingComments, comment];
  writeLocalCommentCache(cache);
};

export const mergePrayerComments = (
  prayerId: string,
  serverComments: PrayerComment[],
) => {
  const cachedComments = getCachedPrayerComments(prayerId);
  const merged = [...serverComments];

  cachedComments.forEach((cachedComment) => {
    if (!merged.some((comment) => comment.id === cachedComment.id)) {
      merged.push(cachedComment);
    }
  });

  return merged;
};
