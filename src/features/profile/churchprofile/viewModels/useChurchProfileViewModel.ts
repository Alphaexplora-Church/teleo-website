// features/profile/churchprofile/viewModels/useChurchProfileViewModel.ts
// ViewModel layer — owns ALL state, effects, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useCallback } from 'react';
import type {
  ChurchProfileTab,
  ChurchProfileTabDef,
  ChurchProfileData,
} from '../models/churchProfileTypes';
import churchLogo from '../../../../assets/images/church-logo.png';
import churchBanner from '../../../../assets/images/church-banner.png';

import { SERMON_IMAGE, EVENT_IMAGE } from '../../../home/models/homeTypes';

// ── Static tab definitions ────────────────────────────────────────────────────
const TABS: ChurchProfileTabDef[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'events', label: 'Events' },
  { key: 'services', label: 'Services' },
];

// ── Shared detail defaults (mirrors homeTypes pattern) ────────────────────────
const sharedDetails = {
  location: 'Detroit, MI',
  locationNote: 'Sunny Detroit Church, 123 Faith St, Detroit MI 48201',
  fee: 'Free',
  organizer: 'Sunny Detroit Church',
  speakers: '',
  participants: '',
  dressCode: 'Casual',
};

// ── Mock church data (will be replaced by API later) ──────────────────────────
const MOCK_CHURCH: ChurchProfileData = {
  id: 1,
  name: 'Sunny Detroit Church',
  logoUrl: churchLogo,
  bannerUrl: churchBanner,
  joinedDate: '08/12/03',
  overview:
    'Sunny Treasure Detroit Church is a welcoming faith community dedicated to spreading God\u2019s love through worship, service, and fellowship. Located in the heart of Detroit, we strive to be a beacon of hope, guiding individuals and families toward spiritual growth and a deeper connection with Christ. Join us as we worship, grow, and serve together in faith and love.',
  announcements: [
    {
      id: 'ann-1',
      author: 'Pastor John',
      meta: 'Sunny Detroit Church \u2022 2 hours ago',
      category: 'Announcement',
      title: 'Sunday Service Schedule Change',
      tags: ['Worship', 'Community', 'Sunday'],
      body: 'Starting next week, our Sunday Service will begin at 9:30 AM instead of 10:00 AM. Please make a note of this change and adjust your schedule accordingly.',
      schedule: 'New Schedule:\n\u25F7 New Service Time: 9:30 AM',
      imageUrl: SERMON_IMAGE,
      imageAlt: 'Pastor celebrating Sunday service',
      date: 'Sunday, July 19',
      time: '9:30 AM \u2013 11:00 AM',
      ...sharedDetails,
    },
    {
      id: 'ann-2',
      author: 'Ministry Team',
      meta: 'Sunny Detroit Church \u2022 July 20',
      category: 'Announcement',
      title: 'Volunteer Sign-Up Open',
      tags: ['Volunteer', 'Outreach', 'Community'],
      body: 'We need volunteers for the upcoming community outreach program. Sign up at the welcome desk after service. Your time and talent make a difference!',
      date: 'Saturday, July 26',
      time: '8:00 AM \u2013 12:00 PM',
      ...sharedDetails,
    },
  ],
  events: [
    {
      id: 'evt-1',
      author: 'Pastor John',
      meta: 'Sunny Detroit Church \u2022 30 mins ago',
      category: 'Events',
      title: 'PRAISE! Youth Worship Charity Concert',
      tags: ['Music', 'Youth', 'Community'],
      details: ['\u25CF Detroit, MI', '\u25A3 July 25, 2026', '\u25F7 6:00 PM'],
      body: 'Join us for an uplifting evening of worship, music, and fellowship in support of our youth charity programs. The proceeds will help fund community outreach and learning activities.',
      schedule: 'Doors open at 5:30 PM',
      imageUrl: EVENT_IMAGE,
      imageAlt: 'Youth worship charity concert gathering',
      date: 'Friday, July 25',
      time: '6:00 PM \u2013 9:00 PM',
      ...sharedDetails,
    },
    {
      id: 'evt-2',
      author: 'Sister Mary',
      meta: 'Sunny Detroit Church \u2022 3 days ago',
      category: 'Events',
      title: 'Women\u2019s Bible Study',
      tags: ['Bible Study', 'Women', 'Faith'],
      body: 'A warm and welcoming space for women of all ages to study scripture, share testimonies, and grow together in faith.',
      date: 'Wednesday, July 23',
      time: '10:00 AM \u2013 12:00 PM',
      ...sharedDetails,
    },
  ],
  services: [
    { id: 'svc-1', day: 'Sunday', name: 'Morning Worship', time: '9:00 AM' },
    { id: 'svc-2', day: 'Sunday', name: 'Evening Service', time: '6:00 PM' },
    { id: 'svc-3', day: 'Wednesday', name: 'Midweek Prayer', time: '7:00 PM' },
  ],
};

// ── Return type ───────────────────────────────────────────────────────────────

export interface ChurchProfileViewModelReturn {
  /** The church data to render. */
  church: ChurchProfileData;

  /** Whether the user is following this church. */
  isFollowing: boolean;

  /** Toggle the follow state. */
  toggleFollow: () => void;

  /** Whether this church is set as the user's home church. */
  isHomeChurch: boolean;

  /** Toggle the home church state. */
  toggleHomeChurch: () => void;

  /** All available tab definitions. */
  tabs: ChurchProfileTabDef[];

  /** The currently active tab key. */
  activeTab: ChurchProfileTab;

  /** Switch to a different tab. */
  setActiveTab: (tab: ChurchProfileTab) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useChurchProfileViewModel = (): ChurchProfileViewModelReturn => {
  // ── Business state ────────────────────────────────────────────
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHomeChurch, setIsHomeChurch] = useState(false);
  const [activeTab, setActiveTab] = useState<ChurchProfileTab>('overview');

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  const toggleHomeChurch = useCallback(() => {
    setIsHomeChurch((prev) => !prev);
  }, []);

  return {
    church: MOCK_CHURCH,
    isFollowing,
    toggleFollow,
    isHomeChurch,
    toggleHomeChurch,
    tabs: TABS,
    activeTab,
    setActiveTab,
  };
};
