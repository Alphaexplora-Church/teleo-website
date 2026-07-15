// features/profile/accountinformation/views/EditProfilePictureView.tsx
// View layer — dumb UI only. NO useState (except imgError), NO useEffect, NO API calls.
// All state and logic is delegated to useEditProfilePictureViewModel.

import React from 'react';
import { useEditProfilePictureViewModel } from '../viewModels/useEditProfilePictureViewModel';
import type { AvatarPreset } from '../models/editProfilePictureTypes';
import { STATIC_USER_PROFILE } from '../models/accountInformationTypes';

// ── Props ──────────────────────────────────────────────────────────────────────
interface EditProfilePictureViewProps {
  /** Currently saved picture url (passed from AccountInformationView or AppShell). */
  initialPictureUrl?: string | null;
  /** Called after a successful save/remove so the parent can update its own state. */
  onSaveSuccess?: (newUrl: string | null) => void;
}

// ── Local icons ────────────────────────────────────────────────────────────────
const UserPlaceholderIcon: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GalleryIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round"
      strokeDasharray="31.4 62.8" />
  </svg>
);

// ── Avatar preview ─────────────────────────────────────────────────────────────
interface AvatarPreviewProps {
  url: string | null;
  isRing?: boolean;
}
const AvatarPreview: React.FC<AvatarPreviewProps> = ({ url, isRing = true }) => {
  const [imgError, setImgError] = React.useState(false);

  // Reset error when url changes
  React.useEffect(() => { setImgError(false); }, [url]);

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt="Profile preview"
        onError={() => setImgError(true)}
        className={[
          'w-[100px] h-[100px] rounded-full object-cover bg-[#d9d9d9]',
          isRing ? 'ring-[5px] ring-[#336ef9]' : '',
        ].join(' ')}
      />
    );
  }

  return (
    <div className={[
      'w-[100px] h-[100px] rounded-full bg-[#d9d9d9]',
      'flex items-center justify-center text-gray-400',
      isRing ? 'ring-[5px] ring-[#336ef9]' : '',
    ].join(' ')}>
      <UserPlaceholderIcon />
    </div>
  );
};

// ── Preset grid tile ───────────────────────────────────────────────────────────
interface PresetTileProps {
  preset: AvatarPreset;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (preset: AvatarPreset) => void;
}
const PresetTile: React.FC<PresetTileProps> = ({ preset, isSelected, disabled, onSelect }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={`Select ${preset.label} avatar`}
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={() => onSelect(preset)}
      className={[
        'relative w-full aspect-square rounded-2xl overflow-hidden',
        'border-2 transition-all duration-200',
        'hover:scale-105 active:scale-95',
        isSelected
          ? 'border-[#336ef9] shadow-[0_0_0_3px_rgba(51,110,249,0.25)]'
          : 'border-[#1f2156]/20 hover:border-[#336ef9]/60',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {imgError ? (
        <div className={`w-full h-full ${preset.bgColour}`} />
      ) : (
        <img
          src={preset.url}
          alt={preset.label}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Selected overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#336ef9]/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#336ef9] flex items-center justify-center shadow-md">
            <CheckIcon />
          </div>
        </div>
      )}
    </button>
  );
};

// ── Feedback banner ────────────────────────────────────────────────────────────
interface FeedbackBannerProps {
  type: 'success' | 'error';
  message: string;
  onDismiss?: () => void;
}
const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message, onDismiss }) => (
  <div
    role="alert"
    aria-live="polite"
    className={[
      'flex items-center justify-between gap-2 w-full max-w-[371px] px-4 py-3',
      'rounded-[10px] text-sm font-sans transition-all duration-300',
      type === 'success'
        ? 'bg-green-50 text-green-800 outline outline-1 outline-green-300'
        : 'bg-red-50 text-red-800 outline outline-1 outline-red-300',
    ].join(' ')}
  >
    <span>{message}</span>
    {onDismiss && (
      <button type="button" onClick={onDismiss} aria-label="Dismiss"
        className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity">
        ✕
      </button>
    )}
  </div>
);

// ── View component ─────────────────────────────────────────────────────────────
const EditProfilePictureView: React.FC<EditProfilePictureViewProps> = ({
  initialPictureUrl = STATIC_USER_PROFILE.profile.profile_picture_url,
  onSaveSuccess,
}) => {
  const {
    currentPictureUrl,
    pictureState,
    selectedPresetId,
    isDirty,
    avatarPresets,
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
  } = useEditProfilePictureViewModel({ initialPictureUrl, onSaveSuccess });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isBusy = isSaving || isRemoving;

  /** Triggered when the user picks a file from the OS picker. */
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input so picking the same file again fires onChange
    e.target.value = '';
  };

  // Display URL: in-progress preview > saved url
  const displayUrl = pictureState.previewUrl ?? currentPictureUrl;

  return (
    <main className="flex flex-col w-full items-center gap-6 min-h-screen pt-6 pb-10">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="profile-picture-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label="Choose a photo from your device"
        className="sr-only"
        onChange={onFileInputChange}
        disabled={isBusy}
      />

      <div className="flex flex-col w-full items-center gap-6 px-4">

        {/* ── Avatar preview ──────────────────────────────────── */}
        <section aria-label="Profile picture preview" className="flex flex-col items-center gap-5">
          <div className="relative">
            <AvatarPreview url={displayUrl} isRing />

            {/* Subtle "changed" badge */}
            {isDirty && (
              <span
                aria-label="Unsaved changes"
                className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#336ef9] border-2 border-white shadow-sm"
              />
            )}
          </div>

          {/* User name under avatar */}
          <p className="text-black text-2xl font-bold font-sans leading-6 text-center">
            {STATIC_USER_PROFILE.profile.display_name}
          </p>
        </section>

        {/* ── Feedback banners ─────────────────────────────────── */}
        {saveSuccess && (
          <FeedbackBanner
            type="success"
            message="Profile picture updated!"
            onDismiss={handleDismissSuccess}
          />
        )}
        {(saveError || validationError) && (
          <FeedbackBanner
            type="error"
            message={saveError ?? validationError ?? ''}
            onDismiss={handleDismissError}
          />
        )}

        {/* ── Upload from device ───────────────────────────────── */}
        <section aria-labelledby="upload-section-heading" className="w-full max-w-[371px]">
          <h2 id="upload-section-heading" className="text-[#757575] text-xl font-bold leading-6 mb-3">
            Upload Photo
          </h2>

          <button
            type="button"
            id="btn-upload-from-gallery"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            aria-label="Choose a photo from your device"
            className={[
              'w-full h-14 flex items-center justify-center gap-3',
              'bg-[#336ef90d] rounded-[20px]',
              'border border-[#1f2156]',
              'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
              'text-[#336ef9] text-sm font-medium font-sans',
              'hover:bg-[#336ef9]/10 hover:scale-[1.01] hover:shadow-md',
              'active:scale-[0.99]',
              'transition-all duration-200',
              isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            <GalleryIcon />
            Choose from Gallery
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            JPEG, PNG, WebP or GIF · Max 5 MB
          </p>
        </section>

        {/* ── Avatar presets ───────────────────────────────────── */}
        <section
          aria-labelledby="preset-section-heading"
          className="w-full max-w-[371px]"
        >
          <h2
            id="preset-section-heading"
            className="text-[#757575] text-xl font-bold leading-6 mb-3"
          >
            Choose an Avatar
          </h2>

          <div
            className="grid grid-cols-3 gap-3 p-4 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
            role="listbox"
            aria-label="Avatar presets"
          >
            {avatarPresets.map((preset) => (
              <div key={preset.id} role="option" aria-selected={selectedPresetId === preset.id}>
                <PresetTile
                  preset={preset}
                  isSelected={selectedPresetId === preset.id}
                  disabled={isBusy}
                  onSelect={handlePresetSelect}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Remove current picture ───────────────────────────── */}
        {currentPictureUrl && (
          <button
            type="button"
            id="btn-remove-profile-picture"
            onClick={handleRemovePicture}
            disabled={isBusy}
            aria-label="Remove current profile picture"
            className={[
              'flex items-center gap-2',
              'text-[#ff0000] text-sm font-medium font-sans',
              'bg-transparent border-none cursor-pointer',
              'hover:opacity-75 transition-opacity duration-150',
              isBusy ? 'opacity-40 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {isRemoving ? (
              <span className="flex items-center gap-2 text-gray-500">
                <SpinnerIcon />
                Removing…
              </span>
            ) : (
              <>
                <TrashIcon />
                Remove current photo
              </>
            )}
          </button>
        )}

        {/* ── Save button ──────────────────────────────────────── */}
        <button
          type="button"
          id="btn-save-profile-picture"
          onClick={handleSave}
          disabled={isBusy || !isDirty}
          aria-label="Save profile picture"
          className={[
            'w-full max-w-[320px] h-12 px-12',
            'bg-[#336ef9] rounded-[10px]',
            'flex items-center justify-center gap-2.5',
            'text-white text-xl font-medium font-sans leading-6',
            'hover:bg-[#2558d8] hover:scale-[1.02] hover:shadow-lg',
            'active:scale-[0.98]',
            'transition-all duration-200',
            isBusy || !isDirty
              ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
              : 'cursor-pointer',
          ].join(' ')}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon />
              Saving…
            </span>
          ) : (
            'Save Photo'
          )}
        </button>

      </div>
    </main>
  );
};

export default EditProfilePictureView;
