// features/profile/accountinformation/viewModels/useEditProfilePictureViewModel.ts
// ViewModel layer — owns ALL useState, useEffect, file handling, and derived state.
// NO JSX. Returns only what the View needs.

import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadProfilePicture, removeProfilePicture } from '../models/editProfilePictureApi';
import {
  AVATAR_PRESETS,
  MAX_UPLOAD_BYTES,
} from '../models/editProfilePictureTypes';
import type {
  AvatarPreset,
  ProfilePictureState,
  UploadSource,
} from '../models/editProfilePictureTypes';

// ── ViewModel return type ──────────────────────────────────────────────────────

export interface EditProfilePictureViewModelReturn {
  // Current picture state
  currentPictureUrl: string | null;
  pictureState: ProfilePictureState;
  selectedPresetId: string | null;
  isDirty: boolean;

  // Preset grid data
  avatarPresets: readonly AvatarPreset[];

  // Async flags
  isSaving: boolean;
  isRemoving: boolean;

  // Feedback
  saveError: string | null;
  saveSuccess: boolean;
  validationError: string | null;

  // Handlers
  handleFileSelect: (file: File) => void;
  handlePresetSelect: (preset: AvatarPreset) => void;
  handleRemovePicture: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleDismissSuccess: () => void;
  handleDismissError: () => void;
}

export interface EditProfilePictureViewModelOptions {
  /** The currently saved profile picture URL — passed in from the parent page. */
  initialPictureUrl: string | null;
  /** Called after a successful save so the parent can refresh its own state. */
  onSaveSuccess?: (newUrl: string | null) => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useEditProfilePictureViewModel = ({
  initialPictureUrl,
  onSaveSuccess,
}: EditProfilePictureViewModelOptions): EditProfilePictureViewModelReturn => {

  // ── Current picture (persisted value, only updated on save) ───
  const [currentPictureUrl, setCurrentPictureUrl] = useState<string | null>(initialPictureUrl);

  // ── In-progress selection (not yet saved) ─────────────────────
  const [pictureState, setPictureState] = useState<ProfilePictureState>({
    previewUrl: null,
    source: null,
    file: null,
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // ── Async flags ────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // ── Feedback ───────────────────────────────────────────────────
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Track whether a file object URL was created so we can revoke it on unmount
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // ── Derived ────────────────────────────────────────────────────
  const isDirty = pictureState.previewUrl !== null;

  // ── Handlers ───────────────────────────────────────────────────

  const handleFileSelect = useCallback((file: File) => {
    setValidationError(null);
    setSaveError(null);
    setSaveSuccess(false);

    // Validate size
    if (file.size > MAX_UPLOAD_BYTES) {
      setValidationError('File is too large. Maximum size is 5 MB.');
      return;
    }

    // Validate MIME type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setValidationError('Unsupported format. Please use JPEG, PNG, WebP, or GIF.');
      return;
    }

    // Revoke any previous object URL to avoid memory leaks
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setSelectedPresetId(null);
    setPictureState({ previewUrl: objectUrl, source: 'gallery' as UploadSource, file });
  }, []);

  const handlePresetSelect = useCallback((preset: AvatarPreset) => {
    setValidationError(null);
    setSaveError(null);
    setSaveSuccess(false);

    // Revoke any previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setSelectedPresetId(preset.id);
    setPictureState({ previewUrl: preset.url, source: 'preset', file: null });
  }, []);

  const handleRemovePicture = useCallback(async () => {
    if (isRemoving || isSaving) return;
    setIsRemoving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setValidationError(null);

    try {
      await removeProfilePicture();
      setCurrentPictureUrl(null);
      setPictureState({ previewUrl: null, source: null, file: null });
      setSelectedPresetId(null);
      setSaveSuccess(true);
      onSaveSuccess?.(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to remove picture.');
    } finally {
      setIsRemoving(false);
    }
  }, [isRemoving, isSaving, onSaveSuccess]);

  const handleSave = useCallback(async () => {
    if (isSaving || isRemoving || !isDirty) return;
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const newUrl = await uploadProfilePicture({
        file: pictureState.file ?? undefined,
        presetId: selectedPresetId ?? undefined,
      });

      // For presets, the returned string is the presetId; resolve the real url
      const resolvedUrl = pictureState.source === 'preset'
        ? pictureState.previewUrl   // we already have the full url in preview
        : newUrl;

      setCurrentPictureUrl(resolvedUrl);
      setPictureState({ previewUrl: null, source: null, file: null });
      setSelectedPresetId(null);
      setSaveSuccess(true);
      onSaveSuccess?.(resolvedUrl);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save picture. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, isRemoving, isDirty, pictureState, selectedPresetId, onSaveSuccess]);

  const handleDismissSuccess = useCallback(() => setSaveSuccess(false), []);
  const handleDismissError = useCallback(() => setSaveError(null), []);

  return {
    currentPictureUrl,
    pictureState,
    selectedPresetId,
    isDirty,
    avatarPresets: AVATAR_PRESETS,
    isSaving,
    isRemoving,
    saveError,
    saveSuccess,
    validationError,
    handleFileSelect,
    handlePresetSelect,
    handleRemovePicture,
    handleSave,
    handleDismissSuccess,
    handleDismissError,
  };
};
