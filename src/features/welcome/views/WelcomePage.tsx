// features/welcome/views/WelcomePage.tsx
// View: Landing / Welcome screen — hero + action column + footer

import React from 'react';
import TeleoLogo from '../../../shared/components/TeleoLogo';
import { useWelcomeViewModel } from '../viewModels/useWelcomeViewModel';

const WelcomePage: React.FC = () => {
  const {
    handleCreateAccount,
    handleLogin,
    handleGoogleOAuth,
    handleGuestLogin,
  } = useWelcomeViewModel();

  return (
    <div className="w-full min-h-dvh flex flex-col lg:flex-row bg-[#001739]">

      {/* ── Left Hero Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center px-16 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 40% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <TeleoLogo size={160} />
          <h1 className="text-5xl font-black tracking-[10px] text-white leading-none font-sans">TELEO</h1>
          <p className="text-white/60 text-lg max-w-[320px] leading-relaxed font-light">
            Your all-in-one church community app. Stay connected, grow in faith.
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full border border-white/5" />
      </div>

      {/* ── Right Card / Mobile Full Screen ── */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center bg-white lg:rounded-l-[40px] min-h-dvh lg:min-h-0 lg:my-6 lg:mr-6 lg:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-[448px] lg:max-w-none flex flex-col items-center pt-14 px-7 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:px-10 lg:py-12 gap-0 animate-page-fade-in">

          {/* ── Brand Header (mobile only) ── */}
          <div className="lg:hidden flex flex-col items-center gap-5 mb-10">
            <TeleoLogo size={150} />
            <h1 className="text-[26px] font-bold text-navy text-center tracking-[-0.3px] leading-[1.2]">Welcome to Teleo!</h1>
          </div>

          {/* ── Desktop Header ── */}
          <div className="hidden lg:flex flex-col items-start gap-2 mb-10 w-full">
            <h2 className="text-3xl font-black text-navy tracking-[-0.5px] leading-tight">Welcome back 👋</h2>
            <p className="text-gray-label text-base">Sign in or create an account to continue.</p>
          </div>

          {/* ── Action Column ── */}
          <div className="w-full flex flex-col gap-3 flex-1">

            {/* Primary: Create Account */}
            <button
              id="btn-create-account"
              type="button"
              className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-65 disabled:cursor-not-allowed select-none"
              onClick={handleCreateAccount}
            >
              Create a new account
            </button>

            {/* Outlined: Log In */}
            <button
              id="btn-login"
              type="button"
              className="w-full min-h-[52px] flex items-center justify-center rounded-full border-[1.5px] border-navy bg-transparent text-navy font-sans text-[15px] font-medium tracking-[0.1px] cursor-pointer px-6 transition-all hover:bg-navy/5 active:scale-95 active:bg-navy/10 select-none"
              onClick={handleLogin}
            >
              Log in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2.5 py-0.5">
              <span className="flex-1 h-px bg-gray-border" />
              <span className="text-[13px] text-gray-placeholder font-normal whitespace-nowrap">or</span>
              <span className="flex-1 h-px bg-gray-border" />
            </div>

            {/* Google OAuth */}
            <button
              id="btn-google-oauth"
              type="button"
              disabled
              className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-[1.5px] border-gray-border bg-white text-gray-label font-sans text-[15px] font-medium px-6 shadow-[0_1px_4px_rgba(0,0,0,0.08)] opacity-50 cursor-not-allowed select-none"
              onClick={handleGoogleOAuth}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
                <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.5-5 7.2v6h8.1c4.7-4.4 7.2-10.8 7.2-17.3z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.3-7.8 2.3-6 0-11.1-4-12.9-9.4H2.7v6.2C6.7 42.9 14.8 48 24 48z" />
                <path fill="#FBBC05" d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.7C1 17.1 0 20.4 0 24s1 6.9 2.7 9.1l8.4-4.2z" />
                <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.6-6.6C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.9l8.4 4.2c1.8-5.4 6.9-7.6 12.9-7.6z" />
              </svg>
              Continue with Google
            </button>

            {/* Continue as Guest */}
            <button
              id="btn-guest"
              type="button"
              className="w-full min-h-[52px] flex items-center justify-center gap-2.5 rounded-full border-none bg-navy text-white font-sans text-[15px] font-semibold tracking-[0.1px] cursor-pointer px-6 transition-all shadow-btn hover:bg-navy-hover hover:shadow-[0_4px_16px_rgba(27,50,82,0.28)] active:bg-navy-active active:scale-95 active:shadow-none disabled:opacity-65 disabled:cursor-not-allowed select-none"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
