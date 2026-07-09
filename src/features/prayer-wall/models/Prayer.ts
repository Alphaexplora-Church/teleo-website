export interface Prayer {
  id: string;
  author: string;
  timeAgo: string;
  frontMessage: string;
  backTitle: string;
  backDetails: string;
  accentColor: string;
  tags?: string[];
  prayerCount?: number;
  comments?: PrayerComment[];
}

export interface PrayerComment {
  id: string;
  author: string;
  message: string;
  timeAgo: string;
}

export const PRAYERS: Prayer[] = [
  {
    id: 'prayer-1',
    author: 'Sarah K.',
    timeAgo: '1 day ago',
    frontMessage: 'If anyone is up, I need prayer urgently right now!!',
    backTitle: 'Urgent Prayer Update',
    backDetails:
      "I just received some difficult news about my health and I'm feeling overwhelmed and scared. Please pray for peace, wisdom for the doctors, and healing if it's God's will. I could really use some encouragement right now.",
    accentColor: '#1e3a5f',
    tags: ['Culture', 'Business'],
    prayerCount: 12,
    comments: [
      {
        id: 'comment-1',
        author: 'Pastor Mike',
        message: 'I have prayed for you 🙏',
        timeAgo: '9h',
      },
      {
        id: 'comment-2',
        author: 'Anonymous',
        message: 'Sending you positive thoughts ✨',
        timeAgo: '12m',
      },
      {
        id: 'comment-3',
        author: 'You',
        message: 'I have prayed for you 🙏',
        timeAgo: 'Just now',
      },
    ],
  },
  {
    id: 'prayer-2',
    author: 'Daniel M.',
    timeAgo: '3 hrs ago',
    frontMessage:
      'Please pray for peace over my family while we walk through a hard week together.',
    backTitle: 'Prayer Focus',
    backDetails:
      'Card Details & Comments Go Here. Add more context, prayer points, or encouragement from the community.',
    accentColor: '#10b7b2',
  },
  {
    id: 'prayer-3',
    author: 'Naomi L.',
    timeAgo: '5 hrs ago',
    frontMessage:
      "Believing for healing and calm before tomorrow morning's appointment.",
    backTitle: 'Appointment Details',
    backDetails:
      'Card Details & Comments Go Here. Share follow-up details, answered prayer notes, and words of support.',
    accentColor: '#e33686',
  },
  {
    id: 'prayer-4',
    author: 'Chris A.',
    timeAgo: '2 days ago',
    frontMessage:
      'Pray for courage, discipline, and wisdom as I step into this new season.',
    backTitle: 'Prayer Journey',
    backDetails:
      'Card Details & Comments Go Here. This space can become a full prayer timeline when connected to real data.',
    accentColor: '#6937d6',
  },
];

export const PRAYER_STACK_STYLES = [
  { rotation: -5.5, offsetX: -12, offsetY: 12, scale: 0.985 },
  { rotation: 4.5, offsetX: 15, offsetY: 6, scale: 0.972 },
  { rotation: -2.5, offsetX: -4, offsetY: -2, scale: 0.96 },
] as const;

export const PRAYER_GESTURE = {
  swipeDistance: 90,
  clickTolerance: 7,
  flickDistance: 36,
  flickVelocity: 0.65,
  dragLimit: 190,
  exitDistance: 560,
  exitDuration: 260,
} as const;

export const PRAYER_HASHTAGS = [
  'Art',
  'Business',
  'Culture',
  'Education',
  'Family',
  'Health',
] as const;

export const PRAYER_THEMES = [
  { id: 'navy', label: 'Navy', color: '#1e3a5f' },
  { id: 'teal', label: 'Teal', color: '#129e9a' },
  { id: 'purple', label: 'Purple', color: '#8426d6' },
  { id: 'magenta', label: 'Magenta', color: '#c71961' },
  { id: 'orange', label: 'Orange', color: '#dd7600' },
  { id: 'green', label: 'Green', color: '#079a73' },
] as const;

export const PRAYER_AUDIENCES = [
  {
    id: 'public',
    label: 'Public',
    description: 'Visible to everyone',
  },
  {
    id: 'community',
    label: 'Church Community',
    description: 'Visible to pastors and leaders',
  },
  {
    id: 'private',
    label: 'Only Me',
    description: 'Visible only to you',
  },
] as const;

export const PRAYER_RESPONSES = [
  'I have prayed for you 🙏',
  'Wishing you the best 🤞',
  'Sending you positive thoughts ✨',
  "I'm holding you in my prayers today 💛",
  'Sending you strength and support! 💪',
] as const;
