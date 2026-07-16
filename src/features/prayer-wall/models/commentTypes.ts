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
