// features/profile/models/notificationTypes.ts
// Model layer — type definitions and constants. No React code, no logic.

export type NotificationFrequency = 'instant' | 'daily' | 'weekly';

export interface NotificationSettings {
  // Toggle switches
  eventReminders: boolean;
  announcements: boolean;
  prayerRequests: boolean;

  // Delivery preferences
  push: boolean;
  email: boolean;
  inApp: boolean;

  // Frequency options
  frequency: NotificationFrequency;

  // Quiet hours / Do not disturb
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "HH:MM"
  quietHoursEnd: string;   // "HH:MM"
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  eventReminders: true,
  announcements: true,
  prayerRequests: false,
  push: true,
  email: true,
  inApp: true,
  frequency: 'daily',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};
