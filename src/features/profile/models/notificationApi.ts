// features/profile/models/notificationApi.ts
// Model layer — notification api stubs.

import { DEFAULT_NOTIFICATION_SETTINGS } from './notificationTypes';
import type { NotificationSettings } from './notificationTypes';

const STORAGE_KEY = 'teleo_notification_settings';

/**
 * Simulates fetching user's notification settings with a slight latency.
 */
export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          resolve(JSON.parse(stored));
          return;
        } catch {
          // ignore parsing error and fallback
        }
      }
      resolve({ ...DEFAULT_NOTIFICATION_SETTINGS });
    }, 600);
  });
}

/**
 * Simulates saving user's notification settings.
 */
export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        resolve();
      } catch (e) {
        reject(new Error('Failed to save settings to localStorage.'));
      }
    }, 800);
  });
}
