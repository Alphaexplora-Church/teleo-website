// features/profile/viewModels/useProfileViewModel.ts
// ViewModel layer — owns ALL state, effects, API calls, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../shared/models/authService';
import { fetchProfileSettingsView } from '../models/profileApi';
import type { ProfileSettingsView, RecentActivityItem, SettingsItem } from '../models/profileTypes';

// ── Static design data ────────────────────────
// Kept in ViewModel (not Model) because they may later be replaced by API calls.

const RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Attended Sunday Service',
    date: 'Yesterday, 10:00 AM',
    type: 'service',
  },
  {
    id: 'activity-2',
    title: 'Prayed for Sarah K.',
    date: 'June 9, 2026',
    type: 'prayer-1',
  },
  {
    id: 'activity-3',
    title: 'Prayed for Sarah K.',
    date: 'June 9, 2026',
    type: 'prayer-2',
  },
];

const GENERAL_SETTINGS: SettingsItem[] = [
  {
    id: 'general-1',
    label: 'Account Information',
    iconType: 'account',
    hasArrow: true,
  },
  {
    id: 'general-2',
    label: 'Security & Privacy',
    iconType: 'security',
    hasArrow: true,
  },
];

const PREFERENCES: SettingsItem[] = [
  {
    id: 'pref-1',
    label: 'Notifications',
    iconType: 'notifications',
    hasArrow: true,
  },
  {
    id: 'pref-2',
    label: 'Help & FAQ',
    iconType: 'help',
    hasArrow: true,
  },
  {
    id: 'pref-3',
    label: 'Log Out',
    iconType: 'logout',
    destructive: true,
  },
];

// ── ViewModel return type ──────────────────────────────────────────────────────

export interface ProfileViewModelOptions {
  /** Optional callback invoked when the user navigates to Account Information. */
  onAccountInformation?: () => void;
}

export interface ProfileViewModelReturn {
  // Profile header data (from API)
  profileView: ProfileSettingsView | null;
  isLoadingProfile: boolean;
  profileError: string | null;

  // Read-only email
  email: string;

  // Guest mode
  isGuest: boolean;

  // Static design data
  recentActivities: RecentActivityItem[];
  generalSettings: SettingsItem[];
  preferences: SettingsItem[];

  // Session
  isLoggingOut: boolean;
  logoutError: string | null;
  handleLogout: () => Promise<void>;
  handleSettingsItemPress: (item: SettingsItem) => Promise<void>;
  /** Called when a guest taps "Find My Church" — redirects to login. */
  handleFindMyChurchGuestPress: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useProfileViewModel = ({ onAccountInformation }: ProfileViewModelOptions = {}): ProfileViewModelReturn => {
  // ── Profile API state ──────────────────────────────────────────
  const [profileView, setProfileView] = useState<ProfileSettingsView | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // ── Session state ──────────────────────────────────────────────
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  // ── Guest detection ────────────────────────────────────────
  // Guests bypass auth — continueAsGuest() never writes an access_token.
  const isGuest = localStorage.getItem('access_token') === null;

  const navigate = useNavigate();

  // ── Fetch profile header data on mount ────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileSettingsView();
        setProfileView(data);
      } catch (err) {
        console.error('Failed to load profile view:', err);
        setProfileError('Could not load profile information.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // Derived read-only email with fallback
  const email = profileView?.email || 'email@gmail.com';

  // ── Guest Find My Church → navigate to login ──────────────
  const handleFindMyChurchGuestPress = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('An unexpected error occurred during logout.');
      setIsLoggingOut(false);
    }
  }, [navigate]);

  // ── Settings item press dispatcher ────────────────────────────
  // Routes each settings row action to the appropriate handler.
  const handleSettingsItemPress = useCallback(
    async (item: SettingsItem) => {
      if (item.iconType === 'logout') {
        await handleLogout();
      } else if (item.iconType === 'account') {
        onAccountInformation?.();
      }
      // Future: navigate to respective settings screens
    },
    [handleLogout, onAccountInformation],
  );

  return {
    // Profile API
    profileView,
    isLoadingProfile,
    profileError,
    email,

    // Guest mode
    isGuest,

    // Static design data
    recentActivities: RECENT_ACTIVITIES,
    generalSettings: GENERAL_SETTINGS,
    preferences: PREFERENCES,

    // Session
    isLoggingOut,
    logoutError,
    handleLogout,
    handleSettingsItemPress,
    handleFindMyChurchGuestPress,
  };
};
