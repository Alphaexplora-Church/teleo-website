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
import GivingView from '../../giving/views/GivingView';
import ChatView from '../../chat/views/ChatView';

// ── Tab page registry ─────────────────────────────────────────
// 'profile' and 'find-my-church' are not bottom-nav tabs.
const TAB_PAGES: Record<string, React.FC> = {
  'home': HomeFeedView,
  'services': ServicesView,
  'prayer-wall': PrayerWallView,
  'content': ContentView,
  'giving': GivingView,
  'chat': ChatView,
  'find-my-church': FindMyChurchView, // accessed from ProfileView CTA
  'account-information': AccountInformationView, // accessed from Profile > Account Information
  'edit-profile-picture': EditProfilePictureView, // accessed from Account Information camera icon
  'security': SecurityView, // accessed from Profile > Security & Privacy
};

// ── Notification bell icon ────────────────────────────────────
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
          className="w-8 h-8 rounded-full object-cover ring-2 ring-navy/15"
        />
      ) : (
        // Fallback: light grey silhouette placeholder
        <img src={profileIcon} alt="" className="h-[25px] w-[25px]" />
      )}
    </button>
  );
};

// ── AppShell ──────────────────────────────────────────────────
const AppShell: React.FC = () => {
  const { activeTab, setActiveTab, navigateToProfile, showBrandText } = useShellViewModel();

  // Resolve the active page component (falls back to HomeFeedView if unknown)
  const {
    activeTab,
    setActiveTab,
    navigateToProfile,
    navigateToFindMyChurch,
    navigateToAccountInformation,
    navigateToEditProfilePicture,
    navigateToSecurity,
    selectedChurch,
    selectChurch,
  } = useShellViewModel();

  // Resolve the active page component (falls back to HomeFeedView if unknown).
  // 'profile' is rendered separately below so it can receive props.
  const ActivePage = TAB_PAGES[activeTab] ?? HomeFeedView;

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">

      {/* ── Sticky Top Header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#001739] text-white">
        <div
          className="flex items-center justify-between px-5 h-[59px]"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          {/* Left: Teleo branding */}
          <div className="flex items-center gap-2">
            <img src={teleoMini} alt="Teleo" className="h-8 w-8 shrink-0" />
            <span className={`overflow-hidden whitespace-nowrap text-[24px] font-black leading-none tracking-[5px] text-white transition-all duration-700 ease-in-out ${showBrandText ? 'max-w-[135px] translate-x-0 opacity-100' : 'max-w-0 -translate-x-2 opacity-0'}`}>
              TELEO
            </span>
          </div>

          {/* Right: Bell + Avatar */}
          <div className="flex items-center gap-2 text-white">
            <button type="button" aria-label="Search" className="flex h-10 w-10 items-center justify-center"><img src={searchIcon} alt="" className="h-[38px] w-9" /></button>
            {/* Notification bell */}
      <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-border/50 shadow-[0_1px_8px_rgba(27,50,82,0.06)]">
        {activeTab === 'profile' ? (
          /* Profile back-header: back → home */
          <div
            className="flex items-center gap-5 px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              aria-label="Go back"
              onClick={() => setActiveTab('home')}
              className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
            >
              <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
              Profile
            </h1>
          </div>
        ) : activeTab === 'find-my-church' ? (
          /* Find My Church back-header: back → profile */
          <div
            className="flex items-center gap-5 px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-8 h-10 flex items-center justify-center rounded-full text-white border-none bg-transparent cursor-pointer"
            >
              <img src={notificationIcon} alt="" className="h-[25px] w-[25px]" />
              {/* Unread indicator dot */}
              <span className="absolute top-0 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FFAF00] px-1 text-[10px] font-bold text-[#001739]" aria-hidden="true">3</span>
              aria-label="Go back to Profile"
              onClick={navigateToProfile}
              className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
            >
              <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
              Find My Church
            </h1>
          </div>
        ) : activeTab === 'account-information' ? (
          /* Account Information back-header: back → profile */
          <div
            className="flex items-center gap-5 px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              aria-label="Go back to Profile"
              onClick={navigateToProfile}
              className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
            >
              <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
              Account Information
            </h1>
          </div>
        ) : activeTab === 'edit-profile-picture' ? (
          /* Edit Profile Picture back-header: back → account-information */
          <div
            className="flex items-center gap-5 px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              aria-label="Go back to Account Information"
              onClick={navigateToAccountInformation}
              className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
            >
              <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
              Edit Profile Picture
            </h1>
          </div>
        ) : activeTab === 'security' ? (
          /* Security back-header: back → profile */
          <div
            className="flex items-center gap-5 px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <button
              type="button"
              aria-label="Go back to Profile"
              onClick={navigateToProfile}
              className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75"
            >
              <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
                <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">
              Security &amp; Privacy
            </h1>
          </div>
        ) : (
          /* Default branded header */
          <div
            className="flex items-center justify-between px-5 h-[60px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Left: Teleo branding */}
            <div className="flex items-center gap-2.5">
              <TeleoLogo size={32} />
              <span className="text-[18px] font-black tracking-[4px] text-navy leading-none select-none font-sans">
                TELEO
              </span>
            </div>

            {/* Right: Bell + Avatar */}
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button
                id="btn-header-notifications"
                type="button"
                aria-label="Notifications"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-navy border-none bg-transparent cursor-pointer transition-colors hover:bg-navy/8 active:bg-navy/15"
              >
                <BellIcon />
                {/* Unread indicator dot */}
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFAF00] border-2 border-white" aria-hidden="true" />
              </button>

              {/* Profile avatar — 12–16px gap via gap-3 (12px) */}
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
          /* FindMyChurchView receives the church selection callback */
          <FindMyChurchView onChurchSelect={selectChurch} />
        ) : activeTab === 'account-information' ? (
          <AccountInformationView onEditProfilePicture={navigateToEditProfilePicture} />
        ) : activeTab === 'edit-profile-picture' ? (
          <EditProfilePictureView />
        ) : activeTab === 'security' ? (
          <SecurityView />
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
