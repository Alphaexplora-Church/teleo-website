import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPrayer } from '../models/prayerApi';
import type { PrayerAudience } from '../models/prayerTypes';
import type { DashboardTab } from '../../../shared/models/navigationTypes';

const PRAYER_HASHTAGS = [
  'Art',
  'Business',
  'Culture',
  'Education',
  'Family',
  'Health',
] as const;

const PRAYER_THEMES = [
  { id: 'navy', label: 'Navy', color: '#1e3a5f' },
  { id: 'teal', label: 'Teal', color: '#129e9a' },
  { id: 'purple', label: 'Purple', color: '#8426d6' },
  { id: 'magenta', label: 'Magenta', color: '#c71961' },
  { id: 'orange', label: 'Orange', color: '#dd7600' },
  { id: 'green', label: 'Green', color: '#079a73' },
] as const;

const PRAYER_AUDIENCES: readonly {
  id: PrayerAudience;
  label: string;
  description: string;
  disabled: boolean;
}[] = [
  {
    id: 'PUBLIC',
    label: 'Public',
    description: 'Visible to everyone',
    disabled: false,
  },
  {
    id: 'HOME_CHURCH',
    label: 'Church Community',
    description: 'Visible to your home church',
    disabled: true,
  },
  {
    id: 'PRIVATE',
    label: 'Only Me',
    description: 'Visible only to you',
    disabled: false,
  },
] as const;

export const useCreatePrayerViewModel = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitPrayer = async (formData: FormData) => {
    const title = String(formData.get('subject') ?? '').trim();
    const description = String(formData.get('request') ?? '').trim();
    const prayerTag = String(formData.get('hashtag') ?? '').trim();
    const audience = String(formData.get('audience') ?? 'PUBLIC') as PrayerAudience;

    if (!title || !description) {
      setErrorMessage('Please complete the subject and prayer request.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createPrayer({
        title,
        description,
        audience,
        prayer_tag: prayerTag || undefined,
      });

      navigate('/dashboard', { state: { activeTab: 'prayer-wall', prayerWallRefresh: Date.now() } });
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to post your prayer request.',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    audiences: PRAYER_AUDIENCES,
    hashtags: PRAYER_HASHTAGS,
    themes: PRAYER_THEMES,
    isThemeSelectionEnabled: false,
    isSubmitting,
    errorMessage,
    submitPrayer,
    navigateToTab: (tab: DashboardTab) =>
      navigate('/dashboard', { state: { activeTab: tab } }),
  };
};
