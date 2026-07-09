import { useNavigate } from 'react-router-dom';
import {
  PRAYER_AUDIENCES,
  PRAYER_HASHTAGS,
  PRAYER_THEMES,
} from '../models/Prayer';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

export const useCreatePrayerViewModel = () => {
  const navigate = useNavigate();

  return {
    audiences: PRAYER_AUDIENCES,
    hashtags: PRAYER_HASHTAGS,
    themes: PRAYER_THEMES,
    isThemeSelectionEnabled: false,
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
