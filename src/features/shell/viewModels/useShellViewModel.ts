// features/shell/viewModels/useShellViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly — they call this hook only.
//
// NOTE: 'profile' and 'find-my-church' are NOT in the DashboardTab nav union.
// They are extended shell destinations reachable via header/profile interactions.

import { useState, useCallback } from 'react';
import type { DashboardTab } from '../../../shared/models/navigationTypes';
import type { Church } from '../../profile/findmychurch/models/findMyChurchTypes';

// Shell destinations extend the nav tabs with sub-pages (header-only access)
export type ShellDestination = DashboardTab | 'profile' | 'find-my-church';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  navigateToFindMyChurch: () => void;
  /** The church the user has selected from FindMyChurchView. Null until selected. */
  selectedChurch: Church | null;
  /** Saves the chosen church and navigates back to the Profile page. */
  selectChurch: (church: Church) => void;
}

export const useShellViewModel = (): DashboardViewModelReturn => {
  const [activeTab, setActiveTabState] = useState<ShellDestination>('home');
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

  // Selects a church AND navigates back to Profile in one action
  const selectChurch = useCallback((church: Church) => {
    setSelectedChurch(church);
    setActiveTabState('profile');
  }, []);

  return {
    activeTab,
    setActiveTab,
    navigateToProfile,
    navigateToFindMyChurch,
    selectedChurch,
    selectChurch,
  };
};
