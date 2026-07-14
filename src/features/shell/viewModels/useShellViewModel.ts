// features/shell/viewModels/useShellViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly — they call this hook only.
//
// NOTE: 'profile' is NOT in the DashboardTab nav union (it's not a bottom-nav tab).
// It is an extended shell destination reachable only via the header avatar button.

import { useState, useCallback, useEffect } from 'react';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

// Shell destinations extend the nav tabs with the profile page (header-only access)
export type ShellDestination = DashboardTab | 'profile';

export interface DashboardViewModelReturn {
  activeTab: ShellDestination;
  setActiveTab: (tab: DashboardTab) => void;
  navigateToProfile: () => void;
  showBrandText: boolean;
}

export const useShellViewModel = (): DashboardViewModelReturn => {
  const [activeTab, setActiveTabState] = useState<ShellDestination>('home');
  const [showBrandText, setShowBrandText] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBrandText(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setActiveTabState(tab);
  }, []);

  // Dedicated action — views call this instead of knowing the 'profile' string
  const navigateToProfile = useCallback(() => {
    setActiveTabState('profile');
  }, []);

  return {
    activeTab,
    setActiveTab,
    navigateToProfile,
    showBrandText,
  };
};
