// features/profile/accountinformation/viewModels/useAccountInformationViewModel.ts
// ViewModel layer — owns ALL useState, useEffect, API calls, form handlers, and derived state.
// NO JSX. Returns only what the View needs.

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCurrentUserProfile, updateUserProfile } from '../models/accountInformationApi';
import type {
  AccountInformationFormState,
  UserProfileDetails,
  UserProfileResponse,
  UpdateProfilePayload,
} from '../models/accountInformationTypes';
import { GENDER_OPTIONS } from '../models/accountInformationTypes';

// ── ViewModel return type ──────────────────────────────────────────────────────

export interface AccountInformationViewModelReturn {
  // Loading / error states
  isLoadingProfile: boolean;
  loadError: string | null;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;

  // Current profile (read-only header / avatar data)
  profile: UserProfileDetails | null;

  // Form state
  form: AccountInformationFormState;
  isDirty: boolean;

  // Dropdown options
  genderOptions: readonly string[];

  // Handlers
  handleFieldChange: (field: keyof AccountInformationFormState, value: string) => void;
  handleSave: () => Promise<void>;
  handleDismissSuccess: () => void;
  handleDismissError: () => void;
}

// ── Helper ─────────────────────────────────────────────────────────────────────

/** Maps a UserProfileDetails object into the editable form state. */
function profileToFormState(profile: UserProfileDetails): AccountInformationFormState {
  return {
    username: profile.username ?? '',
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    // Use the dedicated display_name if available, otherwise fall back to full name
    displayName: profile.display_name?.trim()
      || `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
    location: profile.location ?? '',
    birthday: profile.birthdate ?? '',
    gender: profile.gender ?? '',
  };
}

/** Maps the editable form state into the API update payload. */
function formStateToPayload(form: AccountInformationFormState): UpdateProfilePayload {
  return {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    ...(form.displayName.trim() ? { display_name: form.displayName.trim() } : {}),
    ...(form.birthday ? { birthdate: form.birthday } : {}),
    ...(form.location.trim() ? { location: form.location.trim() } : {}),
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useAccountInformationViewModel = (): AccountInformationViewModelReturn => {

  // ── Loading & error state ──────────────────────────────────────
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Profile data ───────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfileDetails | null>(null);

  // ── Form state ─────────────────────────────────────────────────
  const [form, setForm] = useState<AccountInformationFormState>({
    username: '',
    firstName: '',
    lastName: '',
    displayName: '',
    location: '',
    birthday: '',
    gender: '',
  });

  // Snapshot used to detect dirty state without deep equality
  const originalFormRef = useRef<AccountInformationFormState | null>(null);

  // ── Fetch profile on mount ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setLoadError(null);
      try {
        const result: UserProfileResponse = await fetchCurrentUserProfile();
        if (cancelled) return;
        setProfile(result.profile);
        const initialForm = profileToFormState(result.profile);
        setForm(initialForm);
        originalFormRef.current = initialForm;
      } catch (err) {
        if (cancelled) return;
        console.error('[AccountInformation] Failed to load profile:', err);
        setLoadError('Could not load account information. Please try again.');
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, []);

  // ── Derived: dirty state ───────────────────────────────────────
  const isDirty =
    originalFormRef.current !== null &&
    (form.firstName !== originalFormRef.current.firstName ||
      form.lastName !== originalFormRef.current.lastName ||
      form.displayName !== originalFormRef.current.displayName ||
      form.location !== originalFormRef.current.location ||
      form.birthday !== originalFormRef.current.birthday ||
      form.gender !== originalFormRef.current.gender);

  // ── Handlers ───────────────────────────────────────────────────

  const handleFieldChange = useCallback(
    (field: keyof AccountInformationFormState, value: string) => {
      setSaveError(null);
      setSaveSuccess(false);
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const payload = formStateToPayload(form);
      const result: UserProfileResponse = await updateUserProfile(payload);

      // Sync local state with server response
      setProfile(result.profile);
      const refreshedForm = profileToFormState(result.profile);
      setForm(refreshedForm);
      originalFormRef.current = refreshedForm;

      setSaveSuccess(true);
    } catch (err) {
      console.error('[AccountInformation] Save error:', err);
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save changes. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [form, isSaving]);

  const handleDismissSuccess = useCallback(() => {
    setSaveSuccess(false);
  }, []);

  const handleDismissError = useCallback(() => {
    setSaveError(null);
  }, []);

  return {
    isLoadingProfile,
    loadError,
    isSaving,
    saveError,
    saveSuccess,
    profile,
    form,
    isDirty,
    genderOptions: GENDER_OPTIONS,
    handleFieldChange,
    handleSave,
    handleDismissSuccess,
    handleDismissError,
  };
};
