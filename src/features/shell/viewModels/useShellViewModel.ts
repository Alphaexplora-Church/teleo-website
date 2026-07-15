// features/shell/viewModels/useShellViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly — they call this hook only.
//
// NOTE: 'profile' and 'find-my-church' are NOT in the DashboardTab nav union.
// They are extended shell destinations reachable via header/profile interactions.

import { useState, useCallback, useEffect } from 'react';
import type { DashboardTab } from '../../../shared/models/navigationTypes';
import type { Church } from '../../profile/findmychurch/models/findMyChurchTypes';

// Shell destinations extend the nav tabs with sub-pages (header-only access)
export type ShellDestination = DashboardTab | 'profile' | 'find-my-church' | 'account-information' | 'edit-profile-picture';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  showBrandText: boolean;
  navigateToFindMyChurch: () => void;
  navigateToAccountInformation: () => void;
  navigateToEditProfilePicture: () => void;
  /** The church the user has selected from FindMyChurchView. Null until selected. */
  selectedChurch: Church | null;
  /** Saves the chosen church and navigates back to the Profile page. */
  selectChurch: (church: Church) => void;
}

export const useShellViewModel = (): DashboardViewModelReturn => {
  const [activeTab, setActiveTabState] = useState<ShellDestination>('home');
  const [showBrandText, setShowBrandText] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandText(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setActiveTabState(tab);
  }, []);

  // Dedicated actions — views call these instead of knowing the string literals
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

  // Selects a church AND navigates back to Profile in one action
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
    selectedChurch,
    selectChurch,
  };
};
