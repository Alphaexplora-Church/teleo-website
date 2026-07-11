// features/profile/models/profileTypes.ts
// Pure TypeScript types — no React, no hooks, no JSX.

export interface ProfileSettingsView {
  uid: string;
  username: string;
  joined_date: string;           // formatted as "MON YYYY", e.g. "JUN 2026"
  home_church_name: string;
  home_church_short_name: string;
  profile_picture_url: string | null;
  email?: string;
}

export interface ProfileSettingsViewResponse {
  data: ProfileSettingsView;
  message: string;
  meta: null;
}

// ── Design data types ─────────────────────────────────────────────────────────

export interface RecentActivityItem {
  id: string;
  title: string;
  date: string;
  type: 'service' | 'prayer-1' | 'prayer-2';
}

export interface SettingsItem {
  id: string;
  label: string;
  iconType: 'account' | 'security' | 'notifications' | 'help' | 'logout';
  hasArrow?: boolean;
  destructive?: boolean;
}

