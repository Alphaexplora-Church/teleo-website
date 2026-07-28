// features/profile/churchprofile/viewModels/useChurchProfileViewModel.ts
// ViewModel layer — owns ALL state, effects, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useCallback, useEffect } from 'react';
import type {
  ChurchProfileTab,
  ChurchProfileTabDef,
  ChurchProfileData,
} from '../models/churchProfileTypes';
import { fetchChurchById, joinChurch, leaveChurch } from '../models/churchProfileApi';
import { fetchProfileSettingsView } from '../../models/profileApi';

import { SERMON_IMAGE, EVENT_IMAGE, type FeedPostModel } from '../../../home/models/homeTypes';

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

// ── Mock tab data (announcements, events, services — no backend yet) ──────────
const MOCK_ANNOUNCEMENTS: FeedPostModel[] = [
  {
    id: 'ann-1',
    author: 'Pastor John',
    meta: 'Church \u2022 2 hours ago',
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
    meta: 'Church \u2022 July 20',
    category: 'Announcement',
    title: 'Volunteer Sign-Up Open',
    tags: ['Volunteer', 'Outreach', 'Community'],
    body: 'We need volunteers for the upcoming community outreach program. Sign up at the welcome desk after service. Your time and talent make a difference!',
    date: 'Saturday, July 26',
    time: '8:00 AM \u2013 12:00 PM',
    ...sharedDetails,
  },
];

const MOCK_EVENTS: FeedPostModel[] = [
  {
    id: 'evt-1',
    author: 'Pastor John',
    meta: 'Church \u2022 30 mins ago',
    category: 'Events',
    title: 'PRAISE! Youth Worship Charity Concert',
    tags: ['Music', 'Youth', 'Community'],
    details: ['\u25CF Detroit, MI', '\u25A3 July 25, 2026', '\u25F7 6:00 PM'],
    body: 'Join us for an uplifting evening of worship, music, and fellowship in support of our youth charity programs.',
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
    meta: 'Church \u2022 3 days ago',
    category: 'Events',
    title: 'Women\u2019s Bible Study',
    tags: ['Bible Study', 'Women', 'Faith'],
    body: 'A warm and welcoming space for women of all ages to study scripture, share testimonies, and grow together in faith.',
    date: 'Wednesday, July 23',
    time: '10:00 AM \u2013 12:00 PM',
    ...sharedDetails,
  },
];

const MOCK_SERVICES = [
  { id: 'svc-1', day: 'Sunday', name: 'Morning Worship', time: '9:00 AM' },
  { id: 'svc-2', day: 'Sunday', name: 'Evening Service', time: '6:00 PM' },
  { id: 'svc-3', day: 'Wednesday', name: 'Midweek Prayer', time: '7:00 PM' },
];

// ── Return type ───────────────────────────────────────────────────────────────

export interface ChurchProfileViewModelReturn {
  /** The church data to render. */
  church: ChurchProfileData | null;

  /** Whether church data is loading. */
  isLoading: boolean;

  /** Error message if fetch failed. */
  error: string | null;

  /** Whether the user is following this church. */
  isFollowing: boolean;

  /** Toggle the follow state. */
  toggleFollow: () => void;

  /** Whether this church is set as the user's home church. */
  isHomeChurch: boolean;

  /** Toggle the home church state (calls join/leave API). */
  toggleHomeChurch: () => void;

  /** Whether a join/leave API call is in progress. */
  isTogglingHome: boolean;

  /** All available tab definitions. */
  tabs: ChurchProfileTabDef[];

  /** The currently active tab key. */
  activeTab: ChurchProfileTab;

  /** Switch to a different tab. */
  setActiveTab: (tab: ChurchProfileTab) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useChurchProfileViewModel = (
  churchId?: number,
  userHomeChurchId?: number | null,
): ChurchProfileViewModelReturn => {
  // ── API state ──────────────────────────────────────────────
  const [church, setChurch] = useState<ChurchProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Business state ────────────────────────────────────────────
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHomeChurch, setIsHomeChurch] = useState(false);
  const [isTogglingHome, setIsTogglingHome] = useState(false);
  const [activeTab, setActiveTab] = useState<ChurchProfileTab>('overview');

  // ── Fetch church details on mount / when churchId changes ──
  useEffect(() => {
    if (!churchId) {
      setIsLoading(false);
      setError('No church selected.');
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch both church details and user profile concurrently
        const [data, profile] = await Promise.all([
          fetchChurchById(churchId),
          userHomeChurchId === undefined ? fetchProfileSettingsView().catch(() => null) : Promise.resolve({ home_church_id: userHomeChurchId })
        ]);

        setChurch({
          id: data.church_id,
          name: data.church_name,
          logoUrl: data.logo_url || '',
          bannerUrl: data.cover_photo_url || '',
          joinedDate: '',
          overview: data.church_description || 'No description available.',
          announcements: MOCK_ANNOUNCEMENTS,
          events: MOCK_EVENTS,
          services: MOCK_SERVICES,
        });

        // Determine home church status from profile data
        const currentHomeChurchId = userHomeChurchId !== undefined ? userHomeChurchId : profile?.home_church_id;
        setIsHomeChurch(currentHomeChurchId === data.church_id);
      } catch (err) {
        console.error('Failed to fetch church details:', err);
        setError('Could not load church details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [churchId, userHomeChurchId]);

  const toggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  const toggleHomeChurch = useCallback(async () => {
    if (!churchId || isTogglingHome) return;

    setIsTogglingHome(true);
    try {
      if (isHomeChurch) {
        await leaveChurch();
        setIsHomeChurch(false);
      } else {
        await joinChurch(churchId);
        setIsHomeChurch(true);
      }
    } catch (err) {
      console.error('Failed to toggle home church:', err);
    } finally {
      setIsTogglingHome(false);
    }
  }, [churchId, isHomeChurch, isTogglingHome]);

  return {
    church,
    isLoading,
    error,
    isFollowing,
    toggleFollow,
    isHomeChurch,
    toggleHomeChurch,
    isTogglingHome,
    tabs: TABS,
    activeTab,
    setActiveTab,
  };
};
