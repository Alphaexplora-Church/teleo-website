// features/profile/viewModels/useProfileViewModel.ts
// ViewModel layer — owns ALL state, effects, API calls, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../shared/models/authService';
import { fetchProfileSettingsView } from '../models/profileApi';
import type {
  ProfileSettingsView,
  SettingsItem,
  QuickActionItem,
} from '../models/profileTypes';

// ── Static design data ────────────────────────
const QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'qa-giving', label: 'Giving', iconType: 'giving' },
  { id: 'qa-prayers', label: 'Prayers', iconType: 'prayers' },
  { id: 'qa-history', label: 'History', iconType: 'history' },
];

const GENERAL_SETTINGS: SettingsItem[] = [
  {
    id: 'general-1',
    label: 'Security & Privacy',
    iconType: 'security',
    hasArrow: true,
  },
  {
    id: 'general-2',
    label: 'Notification Preferences',
    iconType: 'notifications',
    hasArrow: true,
  },
  {
    id: 'general-3',
    label: 'Help & FAQ',
    iconType: 'help',
    hasArrow: true,
  },
  {
    id: 'general-4',
    label: 'Log Out',
    iconType: 'logout',
    destructive: true,
  },
];

// ── ViewModel options & return interface ──────────────────────────────────────

export interface ProfileViewModelOptions {
  /** Optional callback invoked when the user navigates to Account Information. */
  onAccountInformation?: () => void;
  /** Optional callback invoked when the user navigates to Security & Privacy. */
  onSecurity?: () => void;
  /** Optional callback invoked when the user navigates to Notifications. */
  onNotifications?: () => void;
  /** Optional callback invoked when the user navigates to Help & FAQ. */
  onHelp?: () => void;
  /** Optional callback invoked for Giving. */
  onGiving?: () => void;
  /** Optional callback invoked for Prayers. */
  onPrayers?: () => void;
  /** Optional callback invoked for History. */
  onHistory?: () => void;
  /** Optional callback invoked for Services. */
  onServices?: () => void;
  /** Optional callback invoked for Back action. */
  onBack?: () => void;
}

export interface ProfileViewModelReturn {
  // Profile API state
  profileView: ProfileSettingsView | null;
  isLoadingProfile: boolean;
  profileError: string | null;

  // Derived user details
  displayName: string;
  email: string;
  friendsCount: number;
  churchFollowingCount: number;

  // Guest mode
  isGuest: boolean;

  // Design data lists
  quickActions: QuickActionItem[];
  generalSettings: SettingsItem[];
  preferences: SettingsItem[];

  // Session state & actions
  isLoggingOut: boolean;
  logoutError: string | null;
  handleLogout: () => Promise<void>;
  handleSettingsItemPress: (item: SettingsItem) => Promise<void>;
  handleQuickActionPress: (item: QuickActionItem) => void;
  handleFindMyChurchGuestPress: () => void;
  handleBackPress: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useProfileViewModel = ({
  onAccountInformation,
  onSecurity,
  onNotifications,
  onHelp,
  onGiving,
  onPrayers,
  onHistory,
  onServices,
  onBack,
}: ProfileViewModelOptions = {}): ProfileViewModelReturn => {
  // ── Profile API state ──────────────────────────────────────────
  const [profileView, setProfileView] = useState<ProfileSettingsView | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // ── Session state ──────────────────────────────────────────────
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  // ── Guest status ───────────────────────────────────────────────
  const [isGuest, setIsGuest] = useState(true);

  const navigate = useNavigate();

  // ── Fetch profile header data on mount ────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileSettingsView();
        setProfileView(data);
        setIsGuest(false);
      } catch (err) {
        console.error('Failed to load profile view:', err);
        setProfileError('Could not load profile information.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // Derived data with fallbacks matching D-new-profile.jsx & teleo-brand
  const displayName = profileView?.username || 'Display Name';
  const email = profileView?.email || 'email@gmail.com';
  const friendsCount = profileView?.friends_count ?? 10;
  const churchFollowingCount = profileView?.church_following_count ?? 10;

  // ── Guest Find My Church → navigate to login ──────────────
  const handleFindMyChurchGuestPress = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // ── Top Header Back Action ──────────────
  const handleBackPress = useCallback(() => {
    onBack?.();
  }, [onBack]);

  // ── Quick Action Press Handler ─────────────
  const handleQuickActionPress = useCallback(
    (item: QuickActionItem) => {
      if (item.iconType === 'giving') {
        onGiving?.();
      } else if (item.iconType === 'prayers') {
        onPrayers?.();
      } else if (item.iconType === 'history') {
        if (onHistory) {
          onHistory();
        } else {
          onServices?.();
        }
      }
    },
    [onGiving, onPrayers, onHistory, onServices],
  );

  // ── Logout Handler ────────────────────────────────────────────
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
  const handleSettingsItemPress = useCallback(
    async (item: SettingsItem) => {
      if (item.iconType === 'logout') {
        await handleLogout();
      } else if (item.iconType === 'account') {
        onAccountInformation?.();
      } else if (item.iconType === 'security') {
        onSecurity?.();
      } else if (item.iconType === 'notifications') {
        onNotifications?.();
      } else if (item.iconType === 'help') {
        onHelp?.();
      }
    },
    [handleLogout, onAccountInformation, onSecurity, onNotifications, onHelp],
  );

  return {
    profileView,
    isLoadingProfile,
    profileError,
    displayName,
    email,
    friendsCount,
    churchFollowingCount,
    isGuest,
    quickActions: QUICK_ACTIONS,
    generalSettings: GENERAL_SETTINGS,
    preferences: GENERAL_SETTINGS.filter(
      (i) => i.destructive || i.iconType === 'notifications' || i.iconType === 'help',
    ),
    isLoggingOut,
    logoutError,
    handleLogout,
    handleSettingsItemPress,
    handleQuickActionPress,
    handleFindMyChurchGuestPress,
    handleBackPress,
  };
};
