import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { DashboardTab } from '../../../shared/models/navigationTypes';
import type { Church } from '../../profile/findmychurch/models/findMyChurchTypes';

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
  verifyEmailTarget: string;
  verifyNumberTarget: string;
  selectedChurch: Church | null;
  selectChurch: (church: Church) => void;
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

  const setActiveTab = useCallback((tab: DashboardTab) => setActiveTabState(tab), []);
  const navigateToProfile = useCallback(() => setActiveTabState('profile'), []);
  const navigateToFindMyChurch = useCallback(() => setActiveTabState('find-my-church'), []);
  const navigateToAccountInformation = useCallback(() => setActiveTabState('account-information'), []);
  const navigateToEditProfilePicture = useCallback(() => setActiveTabState('edit-profile-picture'), []);
  const navigateToSecurity = useCallback(() => setActiveTabState('security'), []);
  const navigateToChangeEmail = useCallback(() => setActiveTabState('change-email'), []);
  const navigateToChangeNumber = useCallback(() => setActiveTabState('change-number'), []);
  const navigateToChangePassword = useCallback(() => setActiveTabState('change-password'), []);
  const navigateToPrivacyPolicy = useCallback(() => setActiveTabState('privacy-policy'), []);
  const navigateToNotifications = useCallback(() => setActiveTabState('notifications'), []);
  const navigateToHelp = useCallback(() => setActiveTabState('help'), []);

  const navigateToVerifyEmail = useCallback((email: string) => {
    setVerifyEmailTarget(email);
    setActiveTabState('verify-email');
  }, []);

  const navigateToVerifyNumber = useCallback((phoneNumber: string) => {
    setVerifyNumberTarget(phoneNumber);
    setActiveTabState('verify-number');
  }, []);

  const selectChurch = useCallback((church: Church) => {
    setSelectedChurch(church);
    setActiveTabState('profile');
  }, []);

  return {
    activeTab,
    setActiveTab,
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
    verifyEmailTarget,
    verifyNumberTarget,
    selectedChurch,
    selectChurch,
  };
};
