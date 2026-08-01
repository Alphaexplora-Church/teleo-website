// shared/models/types.ts — All TypeScript interfaces for the Teleo auth flow

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: 'member' | 'guest' | 'admin' | 'church';
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export type AppRoute =
  | '/'
  | '/welcome'
  | '/login'
  | '/register'
  | '/home'
  | '/approval-status';
