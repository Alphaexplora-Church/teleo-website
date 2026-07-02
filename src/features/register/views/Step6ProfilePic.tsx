// features/register/views/Step6ProfilePic.tsx
// View: Step 6 — Profile picture upload with circular avatar preview

import React, { useRef } from 'react';

// ── Plus icon ─────────────────────────────────────────────────
const PlusIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ── Edit icon (overlay) ────────────────────────────────────────
const EditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ── Props ─────────────────────────────────────────────────────
interface Step6Props {
  profilePictureUrl: string | null;
  onFileSelected: (file: File) => void;
  onSkip: () => void;
}

// ── Component ─────────────────────────────────────────────────
const Step6ProfilePic: React.FC<Step6Props> = ({ profilePictureUrl, onFileSelected, onSkip }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate: must be image, max 10 MB
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    onFileSelected(file);
  };

  return (
    <div className="flex flex-col items-center gap-0 w-full animate-page-fade-in">
      {/* ── Title ── */}
      <div className="flex flex-col items-center gap-2 mb-10 text-center">
        <h2 className="text-[24px] font-bold text-navy leading-tight">
          Lastly, put a face to the name!
        </h2>
        <p className="text-[14px] text-gray-placeholder">
          Upload a profile photo so others can recognize you.
        </p>
      </div>

      {/* ── Avatar circle ── */}
      <button
        id="btn-reg-avatar-picker"
        type="button"
        onClick={triggerFilePicker}
        aria-label="Upload profile picture"
        className="relative w-[140px] h-[140px] rounded-full border-[2px] border-dashed border-gray-border bg-white flex items-center justify-center cursor-pointer transition-all hover:border-navy hover:bg-navy/5 active:scale-95 mb-10 group shadow-sm"
      >
        {profilePictureUrl ? (
          <>
            <img
              src={profilePictureUrl}
              alt="Profile preview"
              className="w-full h-full rounded-full object-cover"
            />
            {/* Edit overlay on hover */}
            <div className="absolute inset-0 rounded-full bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white"><EditIcon /></span>
            </div>
          </>
        ) : (
          <span className="text-gray-placeholder group-hover:text-navy transition-colors">
            <PlusIcon />
          </span>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ── Action Buttons ── */}
      <div className="flex flex-col gap-3 w-full">
        <button
          id="btn-reg-step6-upload"
          type="button"
          onClick={triggerFilePicker}
          className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none select-none"
        >
          {profilePictureUrl ? 'Change Photo' : 'Upload Photo'}
        </button>

        {profilePictureUrl && (
          <button
            id="btn-reg-step6-continue"
            type="button"
            onClick={onSkip}
            className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none select-none"
          >
            Continue
          </button>
        )}

        <button
          id="btn-reg-step6-skip"
          type="button"
          onClick={onSkip}
          className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-full border-[1.5px] border-gray-border bg-transparent text-gray-placeholder font-sans text-[15px] font-medium cursor-pointer px-6 transition-all hover:border-navy hover:text-navy hover:bg-navy/5 active:scale-95 active:bg-navy/10 select-none"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Step6ProfilePic;
