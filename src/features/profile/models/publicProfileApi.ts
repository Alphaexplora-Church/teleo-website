import type { UserPublicProfile } from './publicProfileTypes';

export * from './publicProfileTypes';

export const MOCK_USER_PROFILE: UserPublicProfile = {
  id: 'usr_101',
  name: 'Sarah Jenkins',
  username: '@sarahj',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  bio: 'Walking in faith daily. Loving mother and community volunteer.',
  friendsCount: 142,
  followingCount: 18,
  isFriend: false,
  about: {
    church: 'Grace Community Church',
    birthday: 'October 14',
    gender: 'Female',
  },
  recentPrayers: [
    {
      id: 'p1',
      category: 'Family',
      content: 'Please pray for my child as they start their high school exams this week.',
      timestamp: '2 hours ago',
      likesCount: 12,
    },
    {
      id: 'p2',
      category: 'Health & Marriage',
      content: 'Praying for my husband’s speedy recovery after his knee surgery.',
      timestamp: 'Yesterday',
      likesCount: 24,
    },
    {
      id: 'p3',
      category: 'Career',
      content: 'Lifting up my workplace for wisdom and peaceful direction during changes.',
      timestamp: '3 days ago',
      likesCount: 19,
    },
  ],
};
