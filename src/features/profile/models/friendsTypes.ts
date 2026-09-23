// features/profile/models/friendsTypes.ts
// Model layer: declarative types and interfaces only. No functions, no hooks, no side effects.

export interface FriendUser {
  id: number;
  name: string;
  church: string;
  avatar: string;
}

export interface ChurchItem {
  id: number;
  name: string;
  location: string;
  distance?: string;
  avatar: string;
  isFollowing?: boolean;
}

export type FriendsTab = 'Suggestions' | 'Friends' | 'Church Following';
