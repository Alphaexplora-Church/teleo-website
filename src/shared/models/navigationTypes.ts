// shared/models/navigationTypes.ts
// Pure TypeScript types and constants for the dashboard navigation shell.
// Imported by BottomNavBar and useDashboardViewModel — NO React, hooks, or JSX.

// ── Tab identifier union ──────────────────────────────────────
export type DashboardTab = 'home' | 'services' | 'prayer-wall' | 'content' | 'profile' | 'giving';

// ── Navigation tab config (id + display label) ────────────────
export interface NavTabConfig {
  id: DashboardTab;
  label: string;
}

export const NAV_TABS: NavTabConfig[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'prayer-wall', label: 'Prayer Wall' },
  { id: 'content', label: 'Content' },
  { id: 'giving', label: 'Giving' },
  { id: 'profile', label: 'Profile' },

];
