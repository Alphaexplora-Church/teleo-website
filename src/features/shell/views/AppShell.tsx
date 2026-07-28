// features/shell/views/AppShell.tsx
// View: Post-authentication App Shell
// Renders: Sticky Top Header + Scrollable Content Area + Sticky Bottom Nav
// Tab switching is entirely state-driven - no URL changes, no shell re-mounts.

import React from 'react';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { useShellViewModel } from '../viewModels/useShellViewModel';
import searchIcon from '../../../assets/icons/Search Button.svg';
import notificationIcon from '../../../assets/icons/Notification Icon.svg';
import profileIcon from '../../../assets/icons/Peofile Icon.svg';
import teleoMini from '../../../assets/icons/teleo-mini.svg';

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
import ChangePasswordView from '../../profile/security/change-password/views/ChangePasswordView';
import PrivacyPolicyView from '../../profile/security/views/PrivacyPolicyView';
import NotificationView from '../../profile/views/NotificationView';
import HelpView from '../../profile/views/HelpView';
import GivingView from '../../giving/views/GivingView';
import ChatView from '../../chat/views/ChatView';
import ChurchProfileView from '../../profile/churchprofile/views/ChurchProfileView';

const TAB_PAGES: Record<string, React.FC> = {
  home: HomeFeedView,
  services: ServicesView,
  'prayer-wall': PrayerWallView,
  content: ContentView,
  giving: GivingView,
  chat: ChatView,
  'find-my-church': FindMyChurchView,
  'account-information': AccountInformationView,
  'edit-profile-picture': EditProfilePictureView,
  security: SecurityView,
  'change-email': ChangeEmailView,
};

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

interface BackHeaderProps {
  title: string;
  onBack: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => (
  <div className="flex items-center gap-5 h-[60px]">
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

interface HeaderAvatarProps {
  profilePictureUrl?: string | null;
  onClick: () => void;
}

const HeaderAvatar: React.FC<HeaderAvatarProps> = ({
  profilePictureUrl,
  onClick,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button id="btn-header-profile-avatar" type="button" aria-label="Go to Profile" onClick={onClick} className="relative w-8 h-8 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center p-0 shrink-0 transition-opacity hover:opacity-80 active:scale-95">
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
    navigateToChangePassword,
    navigateToPrivacyPolicy,
    navigateToNotifications,
    navigateToHelp,
    navigateToChurchProfile,
    verifyEmailTarget,
    verifyNumberTarget,
    selectedChurch,
    selectChurch,
    showBrandText,
  } = useShellViewModel();

  const ActivePage = TAB_PAGES[activeTab] ?? HomeFeedView;
  const isSubPage = [
    'profile',
    'find-my-church',
    'account-information',
    'edit-profile-picture',
    'security',
    'change-email',
    'verify-email',
    'change-number',
    'verify-number',
    'change-password',
    'privacy-policy',
    'notifications',
    'help',
    'church-profile',
  ].includes(activeTab);

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-white flex flex-col relative ring-1 ring-black/4 shadow-card">
      <header className="sticky top-0 z-50 w-full bg-[#001739] text-white">
        {isSubPage ? (
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
            {activeTab === 'verify-number' && (
              <BackHeader title="Verify OTP" onBack={navigateToChangeNumber} />
            )}
            {activeTab === 'change-password' && (
              <BackHeader title="Change Password" onBack={navigateToSecurity} />
            )}
            {activeTab === 'privacy-policy' && (
              <BackHeader title="Privacy Policy" onBack={navigateToSecurity} />
            )}
            {activeTab === 'notifications' && (
              <BackHeader title="Notifications" onBack={navigateToProfile} />
            )}
            {activeTab === 'help' && (
              <BackHeader title="Help & FAQs" onBack={navigateToProfile} />
            )}
            {activeTab === 'church-profile' && (
              <BackHeader title="Church Profile" onBack={navigateToProfile} />
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-between px-5 h-[59px]"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
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

      <main
        className="flex-1 overflow-y-auto"
        id="dashboard-content-area"
        aria-live="polite"
        aria-label={`${activeTab} page`}
      >
        {activeTab === 'profile' ? (
          <ProfileView
            onFindMyChurch={navigateToFindMyChurch}
            selectedChurch={selectedChurch}
            onChangeChurch={navigateToFindMyChurch}
            onAccountInformation={navigateToAccountInformation}
            onSecurity={navigateToSecurity}
            onNotifications={navigateToNotifications}
            onHelp={navigateToHelp}
            onChurchProfile={navigateToChurchProfile}
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
            onChangePassword={navigateToChangePassword}
            onChangePrivacyPolicy={navigateToPrivacyPolicy}
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
        ) : activeTab === 'change-password' ? (
          <ChangePasswordView
            onSuccess={() => {
              setTimeout(navigateToSecurity, 2000);
            }}
          />
        ) : activeTab === 'privacy-policy' ? (
          <PrivacyPolicyView />
        ) : activeTab === 'notifications' ? (
          <NotificationView onSuccess={() => setTimeout(navigateToProfile, 2000)} />
        ) : activeTab === 'help' ? (
          <HelpView />
        ) : activeTab === 'church-profile' ? (
          <ChurchProfileView onBack={navigateToProfile} churchId={selectedChurch?.id} />
        ) : (
          <ActivePage />
        )}
      </main>

      <div className="sticky bottom-0 z-50 w-full">
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default AppShell;
