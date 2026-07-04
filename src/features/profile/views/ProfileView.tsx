// features/dashboard/views/ProfileTab.tsx
// View: Profile tab — avatar block + account setting rows

import React from 'react';
import { useProfileViewModel } from '../viewModels/useProfileViewModel';

// ── Chevron right ─────────────────────────────────────────────
const ChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── User placeholder icon ─────────────────────────────────────
const UserIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Setting row ───────────────────────────────────────────────
interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, danger, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors border-none bg-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 active:bg-navy/5 active:scale-[0.99]'}`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50 text-error' : 'bg-off-white text-navy'}`}>
      {icon}
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className={`text-[14px] font-medium leading-tight ${danger ? 'text-error' : 'text-navy'}`}>{label}</span>
      {value && <span className="text-[12px] text-gray-placeholder truncate">{value}</span>}
    </div>
    <span className="text-gray-placeholder shrink-0"><ChevronRight /></span>
  </button>
);

// ── Setting section ───────────────────────────────────────────
interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <div className="flex flex-col gap-0">
    <p className="text-[11px] font-bold text-gray-placeholder uppercase tracking-widest px-1 mb-2">{title}</p>
    <div className="w-full rounded-2xl bg-white border border-gray-border/60 shadow-sm overflow-hidden divide-y divide-gray-border/40">
      {children}
    </div>
  </div>
);

// ── Inline icons ──────────────────────────────────────────────
const PersonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const ChurchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7v13h20V7L12 2z" /><path d="M12 2v4M10 4h4" /><rect x="9" y="13" width="6" height="8" /></svg>;
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

// ── Profile avatar ────────────────────────────────────────────
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
        className="w-[84px] h-[84px] rounded-full object-cover border-4 border-white shadow-md"
      />
    );
  }

  return (
    <div className="w-[84px] h-[84px] rounded-full bg-[#e8ecef] border-4 border-white shadow-md flex items-center justify-center text-gray-border">
      <UserIcon />
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────
const ProfileView: React.FC = () => {
  const { isLoggingOut, handleLogout, profileView, isLoadingProfile, profileError } = useProfileViewModel();

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
      {/* Avatar + identity block */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-4">
        {isLoadingProfile ? (
          // Skeleton shimmer while loading
          <>
            <div className="w-[84px] h-[84px] rounded-full bg-gray-200 animate-pulse" />
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-36 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3.5 w-28 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </>
        ) : profileError ? (
          // Error fallback — still show avatar placeholder
          <>
            <div className="w-[84px] h-[84px] rounded-full bg-[#e8ecef] border-4 border-white shadow-md flex items-center justify-center text-gray-border">
              <UserIcon />
            </div>
            <p className="text-[12px] text-error text-center">{profileError}</p>
          </>
        ) : (
          // Real data
          <>
            <ProfileAvatar url={profileView?.profile_picture_url ?? null} />
            <div className="flex flex-col items-center gap-0.5">
              <h1 className="text-[20px] font-bold text-navy">
                {profileView?.username ?? 'Teleo Member'}
              </h1>
              <p className="text-[13px] text-gray-placeholder">
                @{profileView?.home_church_short_name ?? 'member'} · {profileView?.joined_date ?? ''}
              </p>
            </div>
          </>
        )}
        <button
          type="button"
          className="px-5 py-2 rounded-full border-[1.5px] border-navy bg-transparent text-navy text-[13px] font-semibold cursor-pointer transition-all hover:bg-navy/5 active:scale-95"
        >
          Edit Profile
        </button>
      </div>

      {/* Account settings */}
      <SettingSection title="Account">
        <SettingRow icon={<PersonIcon />} label="Personal Information" value="Name, birthday, gender" />
        <SettingRow icon={<LockIcon />} label="Privacy & Security" value="Password, 2FA" />
        <SettingRow icon={<BellIcon />} label="Notifications" value="Push, email alerts" />
      </SettingSection>

      {/* Church */}
      <SettingSection title="Church">
        <SettingRow icon={<ChurchIcon />} label="My Church" value="Not connected yet" />
      </SettingSection>

      {/* Support */}
      <SettingSection title="Support">
        <SettingRow icon={<HelpIcon />} label="Help & FAQ" />
      </SettingSection>

      {/* Danger zone */}
      <SettingSection title="Session">
        <SettingRow 
          icon={<LogOutIcon />} 
          label={isLoggingOut ? 'Signing out...' : 'Sign Out'} 
          danger 
          onClick={handleLogout}
          disabled={isLoggingOut}
        />
      </SettingSection>

      {/* App version */}
      <p className="text-center text-[11px] text-gray-placeholder mt-1">Teleo v0.1.0 — Beta</p>
    </div>
  );
};

export default ProfileView;
