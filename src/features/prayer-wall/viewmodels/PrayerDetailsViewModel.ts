import { useNavigate, useParams } from 'react-router-dom';
import { PRAYERS } from '../models/Prayer';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

export const usePrayerDetailsViewModel = () => {
  const navigate = useNavigate();
  const { prayerId = '' } = useParams<{ prayerId: string }>();

  return {
    prayer: PRAYERS.find((prayer) => prayer.id === prayerId) ?? null,
    goBack: () => navigate(-1),
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
