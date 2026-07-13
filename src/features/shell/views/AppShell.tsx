// features/shell/views/AppShell.tsx

import React from 'react';
import TeleoLogo from '../../../shared/components/TeleoLogo';
import BottomNavBar from '../../../shared/components/BottomNavBar';
import { useShellViewModel } from '../viewModels/useShellViewModel';

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

const TAB_PAGES: Record<string, React.FC> = {
  home: HomeFeedView,
  services: ServicesView,
  'prayer-wall': PrayerWallView,
  content: ContentView,
  giving: GivingView,
  chat: ChatView,
};

const BellIcon: React.FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const BackChevron: React.FC = () => (
  <svg className="w-[7.4px] h-3" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline points="7 1 1 6.5 7 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface BackHeaderProps {
  title: string;
  onBack: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => (
  <div className="flex items-center gap-5 h-[60px]">
    <button type="button" aria-label="Go back" onClick={onBack} className="flex items-center justify-center relative cursor-pointer border-none bg-transparent text-[#1f2156] transition-opacity hover:opacity-75">
      <BackChevron />
    </button>
    <h1 className="font-medium text-[#1f2156] text-xl leading-6 tracking-[0] font-sans">{title}</h1>
  </div>
);

interface HeaderAvatarProps {
  profilePictureUrl?: string | null;
  onClick: () => void;
}

const HeaderAvatar: React.FC<HeaderAvatarProps> = ({ profilePictureUrl, onClick }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button id="btn-header-profile-avatar" type="button" aria-label="Go to Profile" onClick={onClick} className="relative w-8 h-8 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center p-0 shrink-0 transition-opacity hover:opacity-80 active:scale-95">
      {profilePictureUrl && !imgError ? (
        <img src={profilePictureUrl} alt="Profile" onError={() => setImgError(true)} className="w-8 h-8 rounded-full object-cover ring-2 ring-navy/15" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#e8ecef] ring-2 ring-navy/10 flex items-center justify-center text-[#a0aab4]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
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
    verifyEmailTarget,
    verifyNumberTarget,
    selectedChurch,
    selectChurch,
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
  ].includes(activeTab);

  return (
    <div className="w-full max-w-[448px] min-h-dvh bg-off-white flex flex-col relative ring-1 ring-black/4 shadow-card">
      <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-border/50 shadow-[0_1px_8px_rgba(27,50,82,0.06)]">
        <div className="flex items-center justify-between px-5 h-[60px]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {isSubPage ? (
            <>
              {activeTab === 'profile' && <BackHeader title="Profile" onBack={() => setActiveTab('home')} />}
              {activeTab === 'find-my-church' && <BackHeader title="Find My Church" onBack={navigateToProfile} />}
              {activeTab === 'account-information' && <BackHeader title="Account Information" onBack={navigateToProfile} />}
              {activeTab === 'edit-profile-picture' && <BackHeader title="Edit Profile Picture" onBack={navigateToAccountInformation} />}
              {activeTab === 'security' && <BackHeader title="Security & Privacy" onBack={navigateToProfile} />}
              {activeTab === 'change-email' && <BackHeader title="Change Email" onBack={navigateToSecurity} />}
              {activeTab === 'verify-email' && <BackHeader title="Verify Email" onBack={navigateToChangeEmail} />}
              {activeTab === 'change-number' && <BackHeader title="Change Phone Number" onBack={navigateToSecurity} />}
              {activeTab === 'verify-number' && <BackHeader title="Verify OTP" onBack={navigateToChangeNumber} />}
              {activeTab === 'change-password' && <BackHeader title="Change Password" onBack={navigateToSecurity} />}
              {activeTab === 'privacy-policy' && <BackHeader title="Privacy Policy" onBack={navigateToSecurity} />}
              {activeTab === 'notifications' && <BackHeader title="Notifications" onBack={navigateToProfile} />}
              {activeTab === 'help' && <BackHeader title="Help & FAQs" onBack={navigateToProfile} />}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <TeleoLogo size={32} />
                <span className="text-[18px] font-black tracking-[4px] text-navy leading-none select-none font-sans">TELEO</span>
              </div>
              <div className="flex items-center gap-3">
                <button id="btn-header-notifications" type="button" aria-label="Notifications" className="relative w-10 h-10 flex items-center justify-center rounded-full text-navy border-none bg-transparent cursor-pointer transition-colors hover:bg-navy/8 active:bg-navy/15" onClick={navigateToNotifications}>
                  <BellIcon />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFAF00] border-2 border-white" aria-hidden="true" />
                </button>
                <HeaderAvatar onClick={navigateToProfile} />
              </div>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto" id="dashboard-content-area" aria-live="polite" aria-label={`${activeTab} page`}>
        {activeTab === 'profile' ? (
          <ProfileView onFindMyChurch={navigateToFindMyChurch} selectedChurch={selectedChurch} onChangeChurch={navigateToFindMyChurch} onAccountInformation={navigateToAccountInformation} onSecurity={navigateToSecurity} onNotifications={navigateToNotifications} onHelp={navigateToHelp} />
        ) : activeTab === 'find-my-church' ? (
          <FindMyChurchView onChurchSelect={selectChurch} />
        ) : activeTab === 'account-information' ? (
          <AccountInformationView onEditProfilePicture={navigateToEditProfilePicture} />
        ) : activeTab === 'edit-profile-picture' ? (
          <EditProfilePictureView />
        ) : activeTab === 'security' ? (
          <SecurityView onChangeEmail={navigateToChangeEmail} onChangeNumber={navigateToChangeNumber} onChangePassword={navigateToChangePassword} onChangePrivacyPolicy={navigateToPrivacyPolicy} />
        ) : activeTab === 'change-email' ? (
          <ChangeEmailView onCodeSent={navigateToVerifyEmail} />
        ) : activeTab === 'verify-email' ? (
          <VerificationView targetEmail={verifyEmailTarget} onSuccess={() => setTimeout(navigateToSecurity, 2000)} />
        ) : activeTab === 'change-number' ? (
          <ChangeNumberView onOtpSent={navigateToVerifyNumber} />
        ) : activeTab === 'verify-number' ? (
          <OtpView targetNumber={verifyNumberTarget} onSuccess={() => setTimeout(navigateToSecurity, 2000)} />
        ) : activeTab === 'change-password' ? (
          <ChangePasswordView onSuccess={() => setTimeout(navigateToSecurity, 2000)} />
        ) : activeTab === 'privacy-policy' ? (
          <PrivacyPolicyView />
        ) : activeTab === 'notifications' ? (
          <NotificationView onSuccess={() => setTimeout(navigateToProfile, 2000)} />
        ) : activeTab === 'help' ? (
          <HelpView />
        ) : (
          <ActivePage />
        )}
      </main>

      <div className="sticky bottom-0 z-20 w-full">
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default AppShell;
