// features/dashboard/viewModels/useDashboardViewModel.ts
// ViewModel: manages active tab state for the dashboard shell.
// Views never manage navigation state directly — they call this hook only.

import { useState, useCallback } from 'react';
import type { DashboardTab } from '../models/homeTypes';

export interface DashboardViewModelReturn {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const useDashboardViewModel = (): DashboardViewModelReturn => {
  const [activeTab, setActiveTabState] = useState<DashboardTab>('home');

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setActiveTabState(tab);
  }, []);

  return {
    activeTab,
    setActiveTab,
  };
};
