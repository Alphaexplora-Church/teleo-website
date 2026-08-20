// shared/models/navigationTypes.ts
// Pure TypeScript types and constants for the dashboard navigation shell.
// Imported by BottomNavBar and useDashboardViewModel — NO React, hooks, or JSX.

// ── Tab identifier union ──────────────────────────────────────
export type DashboardTab = 'home' | 'services' | 'announcements' | 'content' | 'profile';

// ── Navigation tab config (id + display label) ────────────────
export interface NavTabConfig {
  id: DashboardTab;
  label: string;
}

export const NAV_TABS: NavTabConfig[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'content', label: 'Content' },
  { id: 'profile', label: 'Profile' },
];
