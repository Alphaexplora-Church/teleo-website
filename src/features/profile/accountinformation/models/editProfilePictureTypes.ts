// features/profile/accountinformation/models/editProfilePictureTypes.ts
// Model layer — pure TypeScript definitions only. No functions, hooks, JSX, or side effects.

// ── Avatar preset options ──────────────────────────────────────────────────────

/**
 * A pre-built avatar the user can select instead of uploading a photo.
 * `id` is stable and used as the React key and selection identifier.
 * `url` will point to a CDN path once the backend serves these.
 */
export interface AvatarPreset {
  id: string;
  label: string;
  /** Absolute URL or data-URI for the preset image. */
  url: string;
  /** Tailwind background colour class used as a fallback if url fails. */
  bgColour: string;
}

// ── Upload state ───────────────────────────────────────────────────────────────

export type UploadSource = 'camera' | 'gallery' | 'preset';

export interface ProfilePictureState {
  /** Current preview URL (object URL from file input, preset url, or saved url). */
  previewUrl: string | null;
  /** How the current preview was sourced. Null when unchanged. */
  source: UploadSource | null;
  /** The raw File object when the user picked from camera/gallery. Null for preset picks. */
  file: File | null;
}

// ── Update payload ─────────────────────────────────────────────────────────────

/**
 * Sent to PUT /api/users/profile/picture.
 * Use FormData in the real implementation.
 */
export interface UpdateProfilePicturePayload {
  /** Set when the user uploaded a file. */
  file?: File;
  /** Set when the user picked a preset. */
  presetId?: string;
}

// ── Static avatar presets ──────────────────────────────────────────────────────

/**
 * Static preset avatars displayed in the picker grid.
 * Replace `url` values with CDN paths when the backend provides them.
 * The bgColour is used as a CSS fallback on image load error.
 */
export const AVATAR_PRESETS: readonly AvatarPreset[] = [
  { id: 'preset-1', label: 'Sunset', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo1&backgroundColor=ffb347', bgColour: 'bg-orange-300' },
  { id: 'preset-2', label: 'Ocean', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo2&backgroundColor=336ef9', bgColour: 'bg-blue-400' },
  { id: 'preset-3', label: 'Forest', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo3&backgroundColor=4caf50', bgColour: 'bg-green-400' },
  { id: 'preset-4', label: 'Lavender', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo4&backgroundColor=b39ddb', bgColour: 'bg-purple-300' },
  { id: 'preset-5', label: 'Rose', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo5&backgroundColor=f48fb1', bgColour: 'bg-pink-300' },
  { id: 'preset-6', label: 'Sky', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo6&backgroundColor=81d4fa', bgColour: 'bg-sky-300' },
  { id: 'preset-7', label: 'Gold', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo7&backgroundColor=ffd54f', bgColour: 'bg-yellow-300' },
  { id: 'preset-8', label: 'Coral', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo8&backgroundColor=ff8a65', bgColour: 'bg-orange-400' },
  { id: 'preset-9', label: 'Mint', url: 'https://api.dicebear.com/8.x/thumbs/svg?seed=Teleo9&backgroundColor=80cbc4', bgColour: 'bg-teal-300' },
] as const;

// ── Max upload size ─────────────────────────────────────────────────────────────

/** 5 MB limit — surfaced to the user in the ViewModel. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
