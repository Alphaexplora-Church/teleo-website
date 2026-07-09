import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRAYERS } from '../models/Prayer';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

export const usePrayerHistoryViewModel = () => {
  const navigate = useNavigate();
  const [historyFilter, setHistoryFilter] = useState<'others' | 'mine'>('others');

  return {
    historyFilter,
    prayers: historyFilter === 'others' ? PRAYERS : [],
    setHistoryFilter,
    goBack: () => navigate(-1),
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
