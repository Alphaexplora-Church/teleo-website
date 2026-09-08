// features/profile/models/friendsApi.ts
// Model layer: static mock data and declarative API contracts for Friends feature.

import type { FriendUser, ChurchItem } from './friendsTypes';

export const MOCK_REQUESTS: FriendUser[] = [
  { id: 1, name: 'David Chen', church: 'Sunday Church Philippines', avatar: 'https://placehold.co/55x55' },
  { id: 2, name: 'Elena Rodriguez', church: 'Grace Community', avatar: 'https://placehold.co/55x55' },
];

export const MOCK_SUGGESTIONS: FriendUser[] = [
  { id: 3, name: 'Marcus Johnson', church: 'Sunday Church Philippines', avatar: 'https://placehold.co/55x55' },
  { id: 4, name: 'Sarah Wilson', church: 'Elevate Church', avatar: 'https://placehold.co/55x55' },
];

export const MOCK_FRIENDS: FriendUser[] = [
  { id: 5, name: 'Zachary Taylor', church: 'Sunday Church Philippines', avatar: 'https://placehold.co/55x55' },
  { id: 6, name: 'Alice Cooper', church: 'Hillsong', avatar: 'https://placehold.co/55x55' },
  { id: 7, name: 'Aaron Smith', church: 'Grace Community', avatar: 'https://placehold.co/55x55' },
  { id: 8, name: 'Brian Adams', church: 'Sunday Church Philippines', avatar: 'https://placehold.co/55x55' },
  { id: 9, name: 'Chloe Grace', church: 'Elevate Church', avatar: 'https://placehold.co/55x55' },
];

export const MOCK_FOLLOWED_CHURCHES: ChurchItem[] = [
  { id: 101, name: 'Sunday Church Philippines', location: 'Bacoor, Cavite', avatar: 'https://placehold.co/60x60', isFollowing: true },
  { id: 102, name: 'Grace Community Church', location: 'Imus, Cavite', avatar: 'https://placehold.co/60x60', isFollowing: true },
];

export const MOCK_SUGGESTED_CHURCHES: ChurchItem[] = [
  { id: 103, name: 'Elevate Manila', location: 'Alabang, Muntinlupa', distance: '4.2 km away', avatar: 'https://placehold.co/60x60', isFollowing: false },
  { id: 104, name: 'Victory Christian Fellowship', location: 'Las Piñas', distance: '5.1 km away', avatar: 'https://placehold.co/60x60', isFollowing: false },
];

/** Fetch initial requests data (TODO: replace with backend GET /api/friends/requests) */
export async function fetchFriendRequestsApi(): Promise<FriendUser[]> {
  return Promise.resolve(MOCK_REQUESTS);
}

/** Fetch friend suggestions data (TODO: replace with backend GET /api/friends/suggestions) */
export async function fetchFriendSuggestionsApi(): Promise<FriendUser[]> {
  return Promise.resolve(MOCK_SUGGESTIONS);
}

/** Fetch user's friends list (TODO: replace with backend GET /api/friends) */
export async function fetchFriendsListApi(): Promise<FriendUser[]> {
  return Promise.resolve(MOCK_FRIENDS);
}

/** Fetch followed churches (TODO: replace with backend GET /api/churches/followed) */
export async function fetchFollowedChurchesApi(): Promise<ChurchItem[]> {
  return Promise.resolve(MOCK_FOLLOWED_CHURCHES);
}

/** Fetch suggested churches (TODO: replace with backend GET /api/churches/suggested) */
export async function fetchSuggestedChurchesApi(): Promise<ChurchItem[]> {
  return Promise.resolve(MOCK_SUGGESTED_CHURCHES);
}
