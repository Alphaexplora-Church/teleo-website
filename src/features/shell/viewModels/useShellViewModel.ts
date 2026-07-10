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

// Shell destinations extend the nav tabs with sub-pages (header-only access)
export type ShellDestination = DashboardTab | 'profile' | 'find-my-church';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  showBrandText: boolean;
  navigateToFindMyChurch: () => void;
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
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandText(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setActiveTabState(tab);
  }, []);

  // Dedicated action - views call this instead of knowing the 'profile' string.
  const navigateToProfile = useCallback(() => {
    setActiveTabState('profile');
  }, []);

  const navigateToFindMyChurch = useCallback(() => {
    setActiveTabState('find-my-church');
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
    selectedChurch,
    selectChurch,
  };
};
