// features/profile/churchprofile/viewModels/useChurchProfileViewModel.ts
// ViewModel layer — owns ALL state, effects, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useCallback, useEffect } from 'react';
import type {
  ChurchProfileTab,
  ChurchProfileTabDef,
  ChurchProfileData,
  ChurchService,
} from '../models/churchProfileTypes';

const MOCK_SERVICES: ChurchService[] = [
  { id: 'svc-1', name: 'Baptism', subtitle: 'Sacred Initiation', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80' },
  { id: 'svc-2', name: 'House Blessing', subtitle: 'Sanctify Your Home', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80' },
  { id: 'svc-3', name: 'Prayers', subtitle: 'Spiritual Support', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80' },
  { id: 'svc-4', name: 'Funeral', subtitle: 'Memorial Services', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { id: 'svc-5', name: 'Dedication', subtitle: 'Commitment Rituals', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80' },
  { id: 'svc-6', name: 'Counseling', subtitle: 'Spiritual Guidance', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80' },
];
import { fetchChurchById, joinChurch, leaveChurch, fetchChurchContents } from '../models/churchProfileApi';
import { fetchProfileSettingsView } from '../../models/profileApi';

// ── Static tab definitions ────────────────────────────────────────────────────
const TABS: ChurchProfileTabDef[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'events', label: 'Events' },
  { key: 'services', label: 'Services' },
];

const DEFAULT_STATIC_CHURCH: ChurchProfileData = {
  id: 1,
  name: 'Grace Community Church',
  logoUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=400&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
  joinedDate: 'January 2024',
  location: '123 Faith Avenue, Detroit, MI 48201',
  churchCategory: 'Main Church',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  websiteUrl: 'https://gracecommunity.org',
  overview: 'Grace Community Church is a vibrant, welcoming community dedicated to worship, spiritual growth, and serving our local neighbors. Join us for Sunday services, midweek Bible studies, and community outreach projects as we walk together in faith and love.',
  announcements: [],
  events: [],
  services: MOCK_SERVICES,
};

export interface ChurchProfileConfirmationModal {
  type: 'set_home' | 'leave_home' | 'unfollow';
  title: string;
  message: string;
  confirmText: string;
  confirmVariant: 'primary' | 'danger';
}

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

  /** Toggle the follow state directly. */
  toggleFollow: () => void;

  /** Whether this church is set as the user's home church. */
  isHomeChurch: boolean;

  /** Toggle the home church state directly. */
  toggleHomeChurch: () => void;

  /** Whether a join/leave API call is in progress. */
  isTogglingHome: boolean;

  /** Active confirmation modal state, if any. */
  confirmationModal: ChurchProfileConfirmationModal | null;

  /** Request setting or removing home church with confirmation check. */
  requestSetHomeChurch: () => void;

  /** Request follow/unfollow with confirmation check on unfollow. */
  requestFollowChurch: () => void;

  /** Confirm the pending modal action. */
  confirmModalAction: () => void;

  /** Cancel and close the confirmation modal. */
  cancelModalAction: () => void;

  /** All available tab definitions. */
  tabs: ChurchProfileTabDef[];

  /** The currently active tab key. */
  activeTab: ChurchProfileTab;

  /** Switch to a different tab. */
  setActiveTab: (tab: ChurchProfileTab) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

import type { Church } from '../../findmychurch/models/findMyChurchTypes';

export const useChurchProfileViewModel = (
  churchId?: number,
  userHomeChurchId?: number | null,
  initialTab: ChurchProfileTab = 'overview',
  onHomeChurchChange?: (isHome: boolean, churchData?: Church | null) => void,
): ChurchProfileViewModelReturn => {
  // ── API state ──────────────────────────────────────────────
  const [church, setChurch] = useState<ChurchProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Business state ────────────────────────────────────────────
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHomeChurch, setIsHomeChurch] = useState(false);
  const [isTogglingHome, setIsTogglingHome] = useState(false);
  const [activeTab, setActiveTab] = useState<ChurchProfileTab>(initialTab);
  const [confirmationModal, setConfirmationModal] = useState<ChurchProfileConfirmationModal | null>(null);
  const [existingHomeChurchId, setExistingHomeChurchId] = useState<number | null>(userHomeChurchId ?? null);
  const [existingHomeChurchName, setExistingHomeChurchName] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, churchId]);

  // ── Fetch church details on mount / when churchId changes ──
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let targetChurchId = churchId;
        let userProfile: { home_church_id?: number | null; home_church_name?: string | null } | null = null;

        if (!targetChurchId) {
          userProfile = await fetchProfileSettingsView().catch(() => null);
          targetChurchId = userProfile?.home_church_id ?? undefined;
        }

        if (!targetChurchId) {
          setChurch(DEFAULT_STATIC_CHURCH);
          setIsLoading(false);
          return;
        }

        const [data, profile, contents] = await Promise.all([
          fetchChurchById(targetChurchId),
          userProfile
            ? Promise.resolve(userProfile)
            : userHomeChurchId === undefined
            ? fetchProfileSettingsView().catch(() => null)
            : Promise.resolve({ home_church_id: userHomeChurchId, home_church_name: null }),
          fetchChurchContents(targetChurchId).catch(() => ({ announcements: [], events: [] })),
        ]);

        const announcements = contents.announcements;
        const events = contents.events;

        setChurch({
          id: data.church_id,
          name: data.church_name,
          logoUrl: data.logo_url || DEFAULT_STATIC_CHURCH.logoUrl,
          bannerUrl: data.cover_photo_url || DEFAULT_STATIC_CHURCH.bannerUrl,
          joinedDate: 'January 2024',
          location: DEFAULT_STATIC_CHURCH.location,
          churchCategory: 'Main Church',
          facebookUrl: 'https://facebook.com',
          instagramUrl: 'https://instagram.com',
          youtubeUrl: 'https://youtube.com',
          websiteUrl: 'https://gracecommunity.org',
          overview: data.church_description || DEFAULT_STATIC_CHURCH.overview,
          announcements,
          events,
          services: MOCK_SERVICES,
        });

        const currentHomeChurchId =
          userHomeChurchId !== undefined ? userHomeChurchId : profile?.home_church_id;
        setIsHomeChurch(currentHomeChurchId === data.church_id);

        if (profile?.home_church_id) {
          setExistingHomeChurchId(profile.home_church_id);
          if ('home_church_name' in profile && profile.home_church_name) {
            setExistingHomeChurchName(profile.home_church_name as string);
          }
        }
      } catch (err) {
        console.error('Failed to fetch church details:', err);
        setChurch(DEFAULT_STATIC_CHURCH);
        setError(null);
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
        setExistingHomeChurchId(null);
        setExistingHomeChurchName(null);
        onHomeChurchChange?.(false, null);
      } else {
        await joinChurch(churchId);
        setIsHomeChurch(true);
        if (church) {
          setExistingHomeChurchId(church.id);
          setExistingHomeChurchName(church.name);
          onHomeChurchChange?.(true, {
            id: church.id,
            name: church.name,
            shortName: '',
            description: church.overview || null,
            imageUrl: church.logoUrl || null,
          });
        }
      }
    } catch (err) {
      console.error('Failed to toggle home church:', err);
    } finally {
      setIsTogglingHome(false);
    }
  }, [church, churchId, isHomeChurch, isTogglingHome, onHomeChurchChange]);

  const requestSetHomeChurch = useCallback(() => {
    const churchName = church?.name || 'this church';
    if (isHomeChurch) {
      setConfirmationModal({
        type: 'leave_home',
        title: 'Leave Home Church',
        message: `Are you sure you want to remove ${churchName} as your home church?`,
        confirmText: 'Leave Home',
        confirmVariant: 'danger',
      });
    } else if (existingHomeChurchId && existingHomeChurchId !== churchId) {
      setConfirmationModal({
        type: 'set_home',
        title: 'Replace Home Church?',
        message: `You currently have ${existingHomeChurchName ? `"${existingHomeChurchName}"` : 'a home church'} set as your home church. Would you like to replace it with ${churchName}?`,
        confirmText: 'Replace',
        confirmVariant: 'primary',
      });
    } else {
      setConfirmationModal({
        type: 'set_home',
        title: 'Set as Home Church',
        message: `Are you sure you want to set ${churchName} as your home church?`,
        confirmText: 'Set as Home',
        confirmVariant: 'primary',
      });
    }
  }, [church?.name, churchId, existingHomeChurchId, existingHomeChurchName, isHomeChurch]);

  const requestFollowChurch = useCallback(() => {
    const churchName = church?.name || 'this church';
    if (isFollowing) {
      setConfirmationModal({
        type: 'unfollow',
        title: 'Unfollow Church',
        message: `Are you sure you want to unfollow ${churchName}?`,
        confirmText: 'Unfollow',
        confirmVariant: 'danger',
      });
    } else {
      toggleFollow();
    }
  }, [church?.name, isFollowing, toggleFollow]);

  const confirmModalAction = useCallback(() => {
    if (!confirmationModal) return;

    if (confirmationModal.type === 'set_home' || confirmationModal.type === 'leave_home') {
      toggleHomeChurch();
    } else if (confirmationModal.type === 'unfollow') {
      toggleFollow();
    }

    setConfirmationModal(null);
  }, [confirmationModal, toggleFollow, toggleHomeChurch]);

  const cancelModalAction = useCallback(() => {
    setConfirmationModal(null);
  }, []);

  return {
    church,
    isLoading,
    error,
    isFollowing,
    toggleFollow,
    isHomeChurch,
    toggleHomeChurch,
    isTogglingHome,
    confirmationModal,
    requestSetHomeChurch,
    requestFollowChurch,
    confirmModalAction,
    cancelModalAction,
    tabs: TABS,
    activeTab,
    setActiveTab,
  };
};
