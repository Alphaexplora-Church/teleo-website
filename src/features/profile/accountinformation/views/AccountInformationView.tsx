// features/profile/accountinformation/views/AccountInformationView.tsx
// View layer — dumb UI only. NO useState (except local img-error), NO useEffect, NO API calls.
// All state and logic is delegated to useAccountInformationViewModel.
// The AppShell provides the back-header for this tab; no duplicate header rendered here.

import React from 'react';
import { useAccountInformationViewModel } from '../viewModels/useAccountInformationViewModel';

// ── User placeholder icon ──────────────────────────────────────────────────────
const UserPlaceholderIcon: React.FC = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Camera / edit icon over avatar ─────────────────────────────────────────────
const CameraIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// ── Profile avatar ─────────────────────────────────────────────────────────────
interface ProfileAvatarProps {
  url: string | null;
}
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ url }) => {
  const [imgError, setImgError] = React.useState(false);

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt="Profile picture"
        onError={() => setImgError(true)}
        className="w-[81px] h-[81px] rounded-full object-cover bg-[#d9d9d9]"
      />
    );
  }

  return (
    <div className="w-[81px] h-[81px] rounded-full bg-[#d9d9d9] flex items-center justify-center text-gray-400">
      <UserPlaceholderIcon />
    </div>
  );
};

// ── Form field ─────────────────────────────────────────────────────────────────
interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (value: string) => void;
  className?: string;
}
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  type = 'text',
  placeholder = '',
  disabled = false,
  readOnly = false,
  onChange,
  className = '',
}) => (
  <div className={`flex flex-col gap-[3px] ${className}`}>
    <label
      htmlFor={id}
      className="text-black text-sm font-medium font-sans leading-6 select-none"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      className={[
        'w-full h-11 px-4 py-2',
        'bg-blue-500/5 rounded-[10px]',
        'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
        'text-black text-xs font-normal font-sans leading-4',
        'placeholder:text-gray-400',
        'focus:outline-2 focus:outline-[#336ef9]',
        'transition-all duration-150',
        readOnly || disabled
          ? 'opacity-60 cursor-not-allowed bg-gray-100'
          : 'cursor-text',
      ].join(' ')}
    />
  </div>
);

// ── Gender select ──────────────────────────────────────────────────────────────
interface GenderSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}
const GenderSelect: React.FC<GenderSelectProps> = ({
  id,
  label,
  value,
  options,
  disabled = false,
  onChange,
}) => (
  <div className="flex flex-col gap-[3px] flex-1 min-w-0">
    <label
      htmlFor={id}
      className="text-black text-sm font-medium font-sans leading-6 select-none"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={[
        'w-full h-11 px-4 py-2',
        'bg-blue-500/5 rounded-[10px]',
        'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
        'text-black text-xs font-normal font-sans leading-4',
        'focus:outline-2 focus:outline-[#336ef9]',
        'transition-all duration-150 appearance-none',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <option value="">Select gender…</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

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
      'rounded-[10px] text-sm font-sans',
      type === 'success'
        ? 'bg-green-50 text-green-800 outline outline-1 outline-green-300'
        : 'bg-red-50 text-red-800 outline outline-1 outline-red-300',
      'transition-all duration-300',
    ].join(' ')}
  >
    <span>{message}</span>
    {onDismiss && (
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    )}
  </div>
);

// ── Skeleton loader ────────────────────────────────────────────────────────────
const SkeletonField: React.FC = () => (
  <div className="h-11 w-full rounded-[10px] bg-gray-200 animate-pulse" />
);
const SkeletonLabel: React.FC<{ width?: string }> = ({ width = 'w-20' }) => (
  <div className={`${width} h-5 bg-gray-200 animate-pulse rounded`} />
);

// ── View component ─────────────────────────────────────────────────────────────
interface AccountInformationViewProps {
  /** Called when the user taps the camera badge to go to the Edit Profile Picture page. */
  onEditProfilePicture?: () => void;
}

const AccountInformationView: React.FC<AccountInformationViewProps> = ({ onEditProfilePicture }) => {
  const {
    isLoadingProfile,
    loadError,
    saveError,
    saveSuccess,
    profile,
    form,
    genderOptions,
    handleDismissSuccess,
    handleDismissError,
  } = useAccountInformationViewModel();

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-screen pt-6 pb-10">

      <div className="flex flex-col w-full items-center gap-6 px-4">

        {/* ── Avatar section ────────────────────────────────── */}
        <section aria-label="Profile picture" className="flex flex-col items-center gap-3">
          <div className="relative w-[100px] h-[100px] rounded-full border-[5px] border-solid border-[#336ef9] flex items-center justify-center shrink-0">
            {isLoadingProfile ? (
              <div className="w-[81px] h-[81px] rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <ProfileAvatar url={profile?.profile_picture_url ?? null} />
            )}
            {/* Camera badge disabled for now until API is ready
            {!isLoadingProfile && (
              <button
                type="button"
                aria-label="Change profile picture"
                onClick={onEditProfilePicture}
                className="absolute bottom-0 right-0 size-6 bg-amber-500 rounded-xl flex items-center justify-center shadow-md hover:bg-amber-400 active:scale-90 transition-all duration-150"
              >
                <CameraIcon />
              </button>
            )} */}
          </div>

          {/* Name under avatar */}
          {isLoadingProfile ? (
            <div className="w-36 h-6 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <p className="text-black text-2xl font-bold font-sans leading-6 text-center min-h-[24px]">
              {form.displayName || `${form.firstName} ${form.lastName}`.trim() || ''}
            </p>
          )}
        </section>

        {/* ── Feedback banners ─────────────────────────────── */}
        {saveSuccess && (
          <FeedbackBanner
            type="success"
            message="Changes saved successfully!"
            onDismiss={handleDismissSuccess}
          />
        )}
        {saveError && <FeedbackBanner type="error" message={saveError} onDismiss={handleDismissError} />}
        {loadError && <FeedbackBanner type="error" message={loadError} />}

        {/* ── Form fields ───────────────────────────────────── */}
        <section
          aria-labelledby="account-info-form-heading"
          className="flex flex-col w-full max-w-[371px] gap-2"
        >
          <h2 id="account-info-form-heading" className="sr-only">
            Account Information
          </h2>

          {/* Username — read-only */}
          {isLoadingProfile ? (
            <div className="flex flex-col gap-[3px]">
              <SkeletonLabel />
              <SkeletonField />
            </div>
          ) : (
            <FormField
              id="account-username"
              label="Username"
              value={form.username ? `@${form.username}` : ''}
              placeholder="@username"
              readOnly
              disabled
              onChange={() => { /* read-only */ }}
            />
          )}

          {/* First Name + Last Name row */}
          <div className="flex gap-3">
            {isLoadingProfile ? (
              <>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <SkeletonLabel width="w-20" />
                  <SkeletonField />
                </div>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <SkeletonLabel width="w-20" />
                  <SkeletonField />
                </div>
              </>
            ) : (
              <>
                <FormField
                  id="account-first-name"
                  label="First Name"
                  value={form.firstName}
                  placeholder="First name"
                  readOnly
                  disabled
                  onChange={() => { /* read-only */ }}
                  className="flex-1 min-w-0"
                />
                <FormField
                  id="account-last-name"
                  label="Last Name"
                  value={form.lastName}
                  placeholder="Last name"
                  readOnly
                  disabled
                  onChange={() => { /* read-only */ }}
                  className="flex-1 min-w-0"
                />
              </>
            )}
          </div>

          {/* Location */}
          {isLoadingProfile ? (
            <div className="flex flex-col gap-[3px]">
              <SkeletonLabel width="w-16" />
              <SkeletonField />
            </div>
          ) : (
            <FormField
              id="account-location"
              label="Location"
              value={form.location}
              placeholder="e.g. Los Banos, Laguna"
              readOnly
              disabled
              onChange={() => { /* read-only */ }}
            />
          )}

          {/* Birthday + Gender row */}
          <div className="flex gap-3">
            {isLoadingProfile ? (
              <>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <SkeletonLabel width="w-16" />
                  <SkeletonField />
                </div>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <SkeletonLabel width="w-14" />
                  <SkeletonField />
                </div>
              </>
            ) : (
              <>
                <FormField
                  id="account-birthday"
                  label="Birthday"
                  value={form.birthday}
                  type="date"
                  placeholder="MM/DD/YYYY"
                  readOnly
                  disabled
                  onChange={() => { /* read-only */ }}
                  className="flex-1 min-w-0"
                />
                <GenderSelect
                  id="account-gender"
                  label="Gender"
                  value={form.gender}
                  options={genderOptions}
                  disabled
                  onChange={() => { /* read-only */ }}
                />
              </>
            )}
          </div>
        </section>

      </div>
    </main>
  );
};

export default AccountInformationView;

