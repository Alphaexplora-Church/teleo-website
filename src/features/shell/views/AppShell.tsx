// features/shell/views/AppShell.tsx
// View: Post-authentication App Shell
// Renders: Sticky Top Header + Scrollable Content Area + Sticky Bottom Nav
// Tab switching is entirely state-driven — no URL changes, no shell re-mounts.

import React from 'react';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { useShellViewModel } from '../viewModels/useShellViewModel';
import searchIcon from '../../../assets/icons/Search Button.svg';
import notificationIcon from '../../../assets/icons/Notification Icon.svg';
import profileIcon from '../../../assets/icons/Peofile Icon.svg';
import teleoMini from '../../../assets/icons/teleo-mini.svg';
//import type { ShellDestination } from '../viewModels/useShellViewModel';
//import type { DashboardTab } from '../../../shared/models/navigationTypes';

// ── Tab page views ────────────────────────────────────────────
import HomeFeedView from '../../home/views/HomeFeedView';
import ServicesView from '../../services/views/ServicesView';
import PrayerWallView from '../../prayer-wall/views/PrayerWallView';
import ContentView from '../../content/views/ContentView';
import ProfileView from '../../profile/views/ProfileView';
import FindMyChurchView from '../../profile/findmychurch/views/FindMyChurchView';
import AccountInformationView from '../../profile/accountinformation/views/AccountInformationView';
import EditProfilePictureView from '../../profile/accountinformation/views/EditProfilePictureView';
import SecurityView from '../../profile/security/views/SecurityView';
import ChangeEmailView from '../../profile/security/change-email/views/ChangeEmailView';
import VerificationView from '../../profile/security/change-email/views/VerificationView';
import ChangeNumberView from '../../profile/security/change-number/views/ChangeNumberView';
import OtpView from '../../profile/security/change-number/views/OtpView';
import GivingView from '../../giving/views/GivingView';
import ChatView from '../../chat/views/ChatView';

// ── Tab page registry ─────────────────────────────────────────
// 'profile' and sub-pages are not bottom-nav tabs.
const TAB_PAGES: Record<string, React.FC> = {
  'home': HomeFeedView,
  'services': ServicesView,
  'prayer-wall': PrayerWallView,
  'content': ContentView,
  'giving': GivingView,
  'chat': ChatView,
  'find-my-church': FindMyChurchView,       // accessed from ProfileView CTA
  'account-information': AccountInformationView, // accessed from Profile › Account Information
  'edit-profile-picture': EditProfilePictureView, // accessed from Account Information camera icon
  'security': SecurityView,                 // accessed from Profile › Security & Privacy
  'change-email': ChangeEmailView,           // accessed from Security › Change Email
};

// ── Back-nav chevron ──────────────────────────────────────────
const BackChevron: React.FC = () => (
  <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline
      points="7 1 1 6.5 7 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Reusable back-nav header row ──────────────────────────────
interface BackHeaderProps {
  title: string;
  onBack: () => void;
}
const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => (
  <div
    className="flex items-center gap-5 px-5 h-[60px]"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    <button
      type="button"
      aria-label="Go back"
      onClick={onBack}
      className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
    >
      <BackChevron />
    </button>
    <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
      {title}
    </h1>
  </div>
);

// ── Header profile avatar ─────────────────────────────────────
interface HeaderAvatarProps {
  profilePictureUrl?: string | null;
  onClick: () => void;
}
const HeaderAvatar: React.FC<HeaderAvatarProps> = ({ profilePictureUrl, onClick }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button
      id="btn-header-profile-avatar"
      type="button"
      aria-label="Go to Profile"
      onClick={onClick}
      className="relative w-8 h-8 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center p-0 shrink-0 transition-opacity hover:opacity-80 active:scale-95"
    >
      {profilePictureUrl && !imgError ? (
        <img
          src={profilePictureUrl}
          alt="Profile"
          onError={() => setImgError(true)}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
        />
      ) : (
        <img src={profileIcon} alt="" className="h-[25px] w-[25px]" />
      )}
    </button>
  );
};

// ── AppShell ──────────────────────────────────────────────────
const AppShell: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    navigateToProfile,
    navigateToFindMyChurch,
    navigateToAccountInformation,
    navigateToEditProfilePicture,
    navigateToSecurity,
    navigateToChangeEmail,
    navigateToVerifyEmail,
    navigateToChangeNumber,
    navigateToVerifyNumber,
    verifyEmailTarget,
    verifyNumberTarget,
    selectedChurch,
    selectChurch,
    showBrandText,
  } = useShellViewModel();

  // Resolve the active page component (falls back to HomeFeedView if unknown).
  // 'profile' and sub-pages are rendered separately so they can receive props.
  const ActivePage = TAB_PAGES[activeTab] ?? HomeFeedView;

  // Sub-pages that show a back-nav header instead of the main branded header
  const isSubPage = ['profile', 'find-my-church', 'account-information', 'edit-profile-picture', 'security', 'change-email', 'verify-email', 'change-number', 'verify-number'].includes(activeTab);

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">

      {/* ── Sticky Top Header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#001739] text-white">
        {isSubPage ? (
          /* ── Back-nav header for sub-pages ── */
          <div
            className="flex items-center gap-5 px-5 h-[59px] bg-white border-b border-gray-200 shadow-[0_1px_8px_rgba(27,50,82,0.06)]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {activeTab === 'profile' && (
              <BackHeader title="Profile" onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'find-my-church' && (
              <BackHeader title="Find My Church" onBack={navigateToProfile} />
            )}
            {activeTab === 'account-information' && (
              <BackHeader title="Account Information" onBack={navigateToProfile} />
            )}
            {activeTab === 'edit-profile-picture' && (
              <BackHeader title="Edit Profile Picture" onBack={navigateToAccountInformation} />
            )}
            {activeTab === 'security' && (
              <BackHeader title="Security & Privacy" onBack={navigateToProfile} />
            )}
            {activeTab === 'change-email' && (
              <BackHeader title="Change Email" onBack={navigateToSecurity} />
            )}
            {activeTab === 'verify-email' && (
              <BackHeader title="Verify Email" onBack={navigateToChangeEmail} />
            )}
            {activeTab === 'change-number' && (
              <BackHeader title="Change Phone Number" onBack={navigateToSecurity} />
            )}
          </div>
        ) : (
          /* ── Main branded header ── */
          <div
            className="flex items-center justify-between px-5 h-[59px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Left: Teleo logo + animated wordmark */}
            <div className="flex items-center gap-2">
              <img src={teleoMini} alt="Teleo" className="h-8 w-8 shrink-0" />
              <span
                className={[
                  'overflow-hidden whitespace-nowrap text-[24px] font-black leading-none tracking-[5px] text-white',
                  'transition-all duration-700 ease-in-out',
                  showBrandText
                    ? 'max-w-[135px] translate-x-0 opacity-100'
                    : 'max-w-0 -translate-x-2 opacity-0',
                ].join(' ')}
              >
                TELEO
              </span>
            </div>

            {/* Right: Search + Notifications + Profile */}
            <div className="flex items-center gap-2 text-white">
              <button
                type="button"
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center"
              >
                <img src={searchIcon} alt="" className="h-[38px] w-9" />
              </button>

              <button
                id="btn-header-notifications"
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-8 items-center justify-center rounded-full border-none bg-transparent cursor-pointer"
              >
                <img src={notificationIcon} alt="" className="h-[25px] w-[25px]" />
                {/* Unread badge */}
                <span
                  className="absolute top-0 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FFAF00] px-1 text-[10px] font-bold text-[#001739]"
                  aria-hidden="true"
                >
                  3
                </span>
              </button>

              <HeaderAvatar onClick={navigateToProfile} />
            </div>
          </div>
        )}
      </header>

      {/* ── Scrollable Content Area ───────────────────────── */}
      <main
        className="flex-1 overflow-y-auto"
        id="dashboard-content-area"
        aria-live="polite"
        aria-label={`${activeTab} page`}
      >
        {activeTab === 'profile' ? (
          /* ProfileView receives navigation callbacks and the selected church */
          <ProfileView
            onFindMyChurch={navigateToFindMyChurch}
            selectedChurch={selectedChurch}
            onChangeChurch={navigateToFindMyChurch}
            onAccountInformation={navigateToAccountInformation}
            onSecurity={navigateToSecurity}
          />
        ) : activeTab === 'find-my-church' ? (
          <FindMyChurchView onChurchSelect={selectChurch} />
        ) : activeTab === 'account-information' ? (
          <AccountInformationView onEditProfilePicture={navigateToEditProfilePicture} />
        ) : activeTab === 'edit-profile-picture' ? (
          <EditProfilePictureView />
        ) : activeTab === 'security' ? (
          <SecurityView
            onChangeEmail={navigateToChangeEmail}
            onChangeNumber={navigateToChangeNumber}
          />
        ) : activeTab === 'change-email' ? (
          <ChangeEmailView onCodeSent={navigateToVerifyEmail} />
        ) : activeTab === 'verify-email' ? (
          <VerificationView
            targetEmail={verifyEmailTarget}
            onSuccess={() => {
              setTimeout(navigateToSecurity, 2000);
            }}
          />
        ) : activeTab === 'change-number' ? (
          <ChangeNumberView onOtpSent={navigateToVerifyNumber} />
        ) : activeTab === 'verify-number' ? (
          <OtpView
            targetNumber={verifyNumberTarget}
            onSuccess={() => {
              setTimeout(navigateToSecurity, 2000);
            }}
          />
        ) : (
          <ActivePage />
        )}
      </main>

      {/* ── Sticky Bottom Navigation Bar ─────────────────── */}
      <div className="sticky bottom-0 z-50 w-full">
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default AppShell;
