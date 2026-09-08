// features/shell/viewModels/useShellViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly - they call this hook only.
//
// NOTE: 'profile' and 'find-my-church' are NOT in the DashboardTab nav union.
// They are extended shell destinations reachable via header/profile interactions.

import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  | 'help';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  navigateToContent: () => void;
  navigateToMyList: () => void;
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
  navigateToChurchProfile: (tab?: ChurchProfileTab, churchId?: string | number) => void;
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
  selectChurch: (church: Church) => void;
  updateSelectedChurch: (church: Church | null) => void;
}

export const useShellViewModel = (): DashboardViewModelReturn => {
  const location = useLocation();
  const requestedTab = (
    location.state as { activeTab?: DashboardTab } | null
  )?.activeTab;
  const [activeTab, setActiveTabState] = useState<ShellDestination>(
    requestedTab ?? 'home',
  );
  const [showBrandText, setShowBrandText] = useState(true);
  const [verifyEmailTarget, setVerifyEmailTarget] = useState('');
  const [verifyNumberTarget, setVerifyNumberTarget] = useState('');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandText(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const navigateToProfile = useCallback(() => {
    setActiveTabState('profile');
  }, [setActiveTabState]);

  const navigateToContent = useCallback(() => {
    setActiveTabState('content');
  }, [setActiveTabState]);

  const navigateToMyList = useCallback(() => {
    setActiveTabState('my-list');
  }, [setActiveTabState]);

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

  const selectChurch = useCallback((church: Church) => {
    setSelectedChurch(church);
    setActiveTabState('profile');
  }, []);

  return {
    activeTab,
    setActiveTab: setActiveTabState,
    navigateToProfile,
    navigateToContent,
    navigateToMyList,
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
