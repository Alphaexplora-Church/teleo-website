// features/shell/viewModels/useShellViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly - they call this hook only.
//
// NOTE: 'profile' and 'find-my-church' are NOT in the DashboardTab nav union.
// They are extended shell destinations reachable via header/profile interactions.

import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DashboardTab } from '../../../shared/models/navigationTypes';
import type { Church } from '../../profile/findmychurch/models/findMyChurchTypes';
import { toChurch } from '../../profile/findmychurch/models/findMyChurchTypes';
import type { ChurchProfileTab } from '../../profile/churchprofile/models/churchProfileTypes';
import { fetchProfileSettingsView } from '../../profile/models/profileApi';
import { fetchChurchById } from '../../profile/churchprofile/models/churchProfileApi';

export type ShellDestination =
  | DashboardTab
  | 'profile'
  | 'find-my-church'
  | 'account-information'
  | 'edit-profile-picture'
  | 'security'
  | 'change-email'
  | 'verify-email'
  | 'change-number'
  | 'verify-number'
  | 'change-password'
  | 'privacy-policy'
  | 'notifications'
  | 'help'
  | 'history'
  | 'church-profile'
  | 'select-church'
  | 'booking'
  | 'booking-schedule'
  | 'friends'
  | 'public-profile';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  showBrandText: boolean;
  navigateToFindMyChurch: () => void;
  navigateToAccountInformation: () => void;
  navigateToEditProfilePicture: () => void;
  navigateToSecurity: () => void;
  navigateToChangeEmail: () => void;
  navigateToVerifyEmail: (email: string) => void;
  navigateToChangeNumber: () => void;
  navigateToVerifyNumber: (phoneNumber: string) => void;
  navigateToChangePassword: () => void;
  navigateToPrivacyPolicy: () => void;
  navigateToNotifications: () => void;
  navigateToHelp: () => void;
  navigateToHistory: () => void;
  navigateToChurchProfile: (tab?: ChurchProfileTab) => void;
  churchProfileTab: ChurchProfileTab;
  navigateToServices: () => void;
  navigateToSelectChurch: (serviceName?: string) => void;
  navigateToBooking: (church?: { id: string | number; name: string }, serviceName?: string) => void;
  navigateToBookingSchedule: () => void;
  navigateToFriends: (initialTab?: string) => void;
  navigateToPublicProfile: (userId: string | number) => void;
  viewingUserId: string | number | null;
  friendsInitialTab: string;
  selectedServiceName: string;
  selectedChurchForBooking: { id: string | number; name: string } | null;
  verifyEmailTarget: string;
  verifyNumberTarget: string;
  selectedChurch: Church | null;
  viewingChurch: Church | null;
  selectChurch: (church: Church) => void;
  updateSelectedChurch: (church: Church | null) => void;
}

export const useShellViewModel = (): DashboardViewModelReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split('/')[1];
  const activeTab = (currentPath || 'home') as ShellDestination;

  const setActiveTabState = useCallback(
    (tab: ShellDestination | string) => {
      navigate(`/${tab}`);
    },
    [navigate]
  );
  const [showBrandText, setShowBrandText] = useState(true);
  const [verifyEmailTarget, setVerifyEmailTarget] = useState('');
  const [verifyNumberTarget, setVerifyNumberTarget] = useState('');
  const [homeChurch, setHomeChurch] = useState<Church | null>(null);
  const [viewingChurch, setViewingChurch] = useState<Church | null>(null);
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [selectedChurchForBooking, setSelectedChurchForBooking] = useState<{ id: string | number; name: string } | null>(null);
  const [churchProfileTab, setChurchProfileTab] = useState<ChurchProfileTab>('overview');

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandText(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadHomeChurch = async () => {
      try {
        const profile = await fetchProfileSettingsView();
        if (profile?.home_church_id) {
          const churchData = await fetchChurchById(profile.home_church_id);
          setHomeChurch(toChurch(churchData));
        }
      } catch (err) {
        // Silent catch for guest / unauthenticated users
      }
    };
    loadHomeChurch();
  }, []);

  const navigateToProfile = useCallback(() => {
    setActiveTabState('profile');
  }, []);

  const navigateToFindMyChurch = useCallback(() => {
    setActiveTabState('find-my-church');
  }, []);

  const navigateToAccountInformation = useCallback(() => {
    setActiveTabState('account-information');
  }, []);

  const navigateToEditProfilePicture = useCallback(() => {
    setActiveTabState('edit-profile-picture');
  }, []);

  const navigateToSecurity = useCallback(() => {
    setActiveTabState('security');
  }, []);

  const navigateToChangeEmail = useCallback(() => {
    setActiveTabState('change-email');
  }, []);

  const navigateToVerifyEmail = useCallback((email: string) => {
    setVerifyEmailTarget(email);
    setActiveTabState('verify-email');
  }, []);

  const navigateToChangeNumber = useCallback(() => {
    setActiveTabState('change-number');
  }, []);

  const navigateToVerifyNumber = useCallback((phoneNumber: string) => {
    setVerifyNumberTarget(phoneNumber);
    setActiveTabState('verify-number');
  }, []);

  const navigateToChangePassword = useCallback(() => {
    setActiveTabState('change-password');
  }, []);

  const navigateToPrivacyPolicy = useCallback(() => {
    setActiveTabState('privacy-policy');
  }, []);

  const navigateToNotifications = useCallback(() => {
    setActiveTabState('notifications');
  }, []);

  const navigateToHelp = useCallback(() => {
    setActiveTabState('help');
  }, []);

  const navigateToHistory = useCallback(() => {
    setActiveTabState('history');
  }, []);

  const navigateToChurchProfile = useCallback(
    (tab?: ChurchProfileTab) => {
      setViewingChurch(null);
      const validTab = typeof tab === 'string' ? tab : 'overview';
      setChurchProfileTab(validTab);
      setActiveTabState('church-profile');
    },
    [setActiveTabState]
  );

  const navigateToServices = useCallback(() => {
    setActiveTabState('services');
  }, []);

  const navigateToSelectChurch = useCallback((serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceName(serviceName);
    }
    setActiveTabState('select-church');
  }, []);

  const navigateToBooking = useCallback(
    (church?: { id: string | number; name: string }, serviceName?: string) => {
      if (church) {
        setSelectedChurchForBooking(church);
      }
      if (serviceName) {
        setSelectedServiceName(serviceName);
      }
      setActiveTabState('booking');
    },
    [setActiveTabState]
  );

  const navigateToBookingSchedule = useCallback(() => {
    setActiveTabState('booking-schedule');
  }, []);

  const [friendsInitialTab, setFriendsInitialTab] = useState<string>('Suggestions');
  const [viewingUserId, setViewingUserId] = useState<string | number | null>(null);
  const pathUserId = currentPath === 'public-profile' ? location.pathname.split('/')[2] : null;
  const effectiveViewingUserId = viewingUserId ?? pathUserId;

  const navigateToFriends = useCallback((initialTab?: string) => {
    if (initialTab) {
      setFriendsInitialTab(initialTab);
    }
    setActiveTabState('friends');
  }, []);

  const navigateToPublicProfile = useCallback(
    (userId: string | number) => {
      setViewingUserId(userId);
      setActiveTabState(`public-profile/${userId}`);
    },
    [setActiveTabState]
  );

  // Selecting a church card in Find My Church to VIEW its profile (does NOT set as home)
  const selectChurch = useCallback(
    (church: Church) => {
      setViewingChurch(church);
      setChurchProfileTab('overview');
      setActiveTabState('church-profile');
    },
    [setActiveTabState]
  );

  // Explicitly setting or unsetting home church from ChurchProfileView
  const updateSelectedChurch = useCallback((church: Church | null) => {
    setHomeChurch(church);
  }, []);

  return {
    activeTab,
    setActiveTab: setActiveTabState,
    navigateToProfile,
    showBrandText,
    navigateToFindMyChurch,
    navigateToAccountInformation,
    navigateToEditProfilePicture,
    navigateToSecurity,
    navigateToChangeEmail,
    navigateToVerifyEmail,
    navigateToChangeNumber,
    navigateToVerifyNumber,
    navigateToChangePassword,
    navigateToPrivacyPolicy,
    navigateToNotifications,
    navigateToHelp,
    navigateToHistory,
    navigateToChurchProfile,
    churchProfileTab,
    navigateToServices,
    navigateToSelectChurch,
    navigateToBooking,
    navigateToBookingSchedule,
    navigateToFriends,
    navigateToPublicProfile,
    viewingUserId: effectiveViewingUserId,
    friendsInitialTab,
    selectedServiceName,
    selectedChurchForBooking,
    verifyEmailTarget,
    verifyNumberTarget,
    selectedChurch: homeChurch,
    viewingChurch,
    selectChurch,
    updateSelectedChurch,
  };
};
