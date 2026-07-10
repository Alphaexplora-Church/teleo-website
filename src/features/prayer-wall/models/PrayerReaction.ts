export type PrayerReactionType = 'AMEN' | 'PRAYING' | 'HEART';

export interface PrayerReactionRecord {
  id: string;
  prayer_id: string;
  user_id: number;
  reaction_type: PrayerReactionType;
  created_at: string;
}
