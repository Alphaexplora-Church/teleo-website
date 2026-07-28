// features/profile/security/models/securityTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Security action items ──────────────────────────────────────────────────────

export type SecurityActionId =
  | 'change-email'
  | 'change-password'
  | 'change-phone'
  | 'privacy-policy'
  | 'delete-account';

export interface SecurityActionItem {
  id: SecurityActionId;
  label: string;
  /** Supporting text shown below the label (e.g. current value or hint). */
  subtitle: string;
  iconType: 'email' | 'password' | 'phone' | 'shield' | 'trash';
  /** Marks the row as a destructive action (red styling). */
  destructive?: boolean;
  /** Marks the row as a navigable external link (opens in new tab). */
  isExternalLink?: boolean;
}

// ── Static seed data ───────────────────────────────────────────────────────────

export const SECURITY_CREDENTIAL_ITEMS: readonly SecurityActionItem[] = [
  {
    id: 'change-email',
    label: 'Change Email',
    subtitle: 'ninika@teleo.app',
    iconType: 'email',
  },
  {
    id: 'change-password',
    label: 'Change Password',
    subtitle: 'Last changed 3 months ago',
    iconType: 'password',
  },
  {
    id: 'change-phone',
    label: 'Change Phone Number',
    subtitle: '+63 912 345 6789',
    iconType: 'phone',
  },
] as const;

export const SECURITY_PRIVACY_ITEMS: readonly SecurityActionItem[] = [
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    subtitle: '',
    iconType: 'shield',
    isExternalLink: true,
  },
] as const;

export const SECURITY_DANGER_ITEMS: readonly SecurityActionItem[] = [
  {
    id: 'delete-account',
    label: 'Delete Account',
    subtitle: '',
    iconType: 'trash',
    destructive: true,
  },
] as const;
