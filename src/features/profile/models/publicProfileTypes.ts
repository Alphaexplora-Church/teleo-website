export interface PrayerPost {
  id: string;
  category: string;
  content: string;
  timestamp: string;
  likesCount: number;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  friendsCount: number;
  followingCount: number;
  isFriend: boolean;
  about: {
    church: string;
    birthday: string;
    gender: string;
  };
  recentPrayers: PrayerPost[];
}
