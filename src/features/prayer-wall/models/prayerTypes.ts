import type { PrayerComment, PrayerCommentRecord } from './commentTypes';

export type PrayerAudience = 'PUBLIC' | 'PRIVATE' | 'HOME_CHURCH' | 'CHURCH_MINISTRY' | 'CHURCH_INTERCESSION';

export type PrayerReactionType = 'AMEN' | 'PRAYING' | 'HEART' | 'PRAYED';

export interface PrayerReactionRecord {
  id: string;
  prayer_id: string;
  user_id: number;
  reaction_type: PrayerReactionType;
  created_at: string;
}

export interface PrayerApiRecord {
  id: string;
  user_id: string;
  home_church_id: number | null;
  title: string;
  audience: PrayerAudience;
  description: string;
  prayer_tag: string | null;
  is_urgent?: boolean;
  is_anonymous?: boolean;
  is_prayed_by_church?: boolean;
  times_prayed_by_church?: number;
  is_answered: boolean;
  answer_note: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
  username?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  name?: string | null;
}

export interface PrayerFeedResponse {
  data: PrayerApiRecord[];
  meta: {
    next_cursor: string | null;
    has_more: boolean;
  };
}

export interface PrayerCardsPage {
  prayers: PrayerCard[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PrayerCard {
  id: string;
  author: string | null;
  timeAgo: string;
  title: string;
  description: string;
  frontMessage: string;
  backTitle: string;
  backDetails: string;
  accentColor: string;
  tags: string[];
  prayerTag: string | null;
  audience: PrayerAudience;
  isUrgent?: boolean;
  isAnonymous?: boolean;
  isPrayedByChurch?: boolean;
  timesPrayedByChurch?: number;
  isAnswered: boolean;
  answerNote: string | null;
  createdAt: string;
  ownerId: string;
  comments: PrayerComment[];
}

export interface CreatePrayerPayload {
  title: string;
  description: string;
  prayer_tag?: string;
  audience?: PrayerAudience;
  is_urgent?: boolean;
  is_anonymous?: boolean;
}

export interface UpdatePrayerPayload extends CreatePrayerPayload {}

export interface PrayerApiRecordWithComments extends PrayerApiRecord {
  comments?: PrayerCommentRecord[];
}
