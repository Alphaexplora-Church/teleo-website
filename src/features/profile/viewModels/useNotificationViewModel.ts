// features/profile/viewModels/useNotificationViewModel.ts
// ViewModel layer — manages state and interaction logic. No React views, no JSX.

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../models/notificationTypes';
import type { NotificationSettings, NotificationFrequency } from '../models/notificationTypes';
import { fetchNotificationSettings, saveNotificationSettings } from '../models/notificationApi';

export interface NotificationViewModelReturn {
  settings: NotificationSettings;
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  handleToggleField: (field: 'eventReminders' | 'announcements' | 'prayerRequests' | 'quietHoursEnabled') => void;
  handleToggleDelivery: (field: 'push' | 'email' | 'inApp') => void;
  handleFrequencyChange: (freq: NotificationFrequency) => void;
  handleQuietHoursChange: (field: 'quietHoursStart' | 'quietHoursEnd', value: string) => void;
  handleSave: () => void;
  handleResetToDefaults: () => void;
  handleDismissError: () => void;
}

export interface UseNotificationViewModelOptions {
  onSuccess?: () => void;
}

export const useNotificationViewModel = ({ onSuccess }: UseNotificationViewModelOptions = {}): NotificationViewModelReturn => {
  const [settings, setSettings] = useState<NotificationSettings>({ ...DEFAULT_NOTIFICATION_SETTINGS });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing settings
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const fetched = await fetchNotificationSettings();
        if (active) {
          setSettings(fetched);
        }
      } catch (err) {
        console.error('Failed to load notification settings:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleField = useCallback((field: 'eventReminders' | 'announcements' | 'prayerRequests' | 'quietHoursEnabled') => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setSaveSuccess(false);
  }, []);

  const handleToggleDelivery = useCallback((field: 'push' | 'email' | 'inApp') => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setSaveSuccess(false);
  }, []);

  const handleFrequencyChange = useCallback((freq: NotificationFrequency) => {
    setSettings((prev) => ({
      ...prev,
      frequency: freq,
    }));
    setSaveSuccess(false);
  }, []);

  const handleQuietHoursChange = useCallback((field: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await saveNotificationSettings(settings);
      setSaveSuccess(true);
      onSuccess?.();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }, [settings, onSuccess]);

  const handleResetToDefaults = useCallback(() => {
    setSettings({ ...DEFAULT_NOTIFICATION_SETTINGS });
    setSaveSuccess(false);
  }, []);

  const handleDismissError = useCallback(() => {
    setSaveError(null);
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    saveSuccess,
    saveError,
    handleToggleField,
    handleToggleDelivery,
    handleFrequencyChange,
    handleQuietHoursChange,
    handleSave,
    handleResetToDefaults,
    handleDismissError,
  };
};
