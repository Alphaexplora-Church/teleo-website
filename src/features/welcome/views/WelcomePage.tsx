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
    handleChurchSignUp,
  } = useWelcomeViewModel();

  return (
    <div className="teleo-shell">
      <div className="welcome-container">

        {/* ── Hero Section ── */}
        <div className="welcome-hero">
          <TeleoLogo size={150} />
          <h1 className="welcome-title">Welcome to Teleo!</h1>
        </div>

        {/* ── Action Column ── */}
        <div className="action-column">

          {/* Primary: Create Account */}
          <button
            id="btn-create-account"
            type="button"
            className="btn-primary"
            onClick={handleCreateAccount}
          >
            Create a new account
          </button>

          {/* Outlined: Log In */}
          <button
            id="btn-login"
            type="button"
            className="btn-outline"
            onClick={handleLogin}
          >
            Log in
          </button>

          {/* Divider */}
          <div className="divider-or">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          {/* Google OAuth */}
          <button
            id="btn-google-oauth"
            type="button"
            className="btn-google"
            onClick={handleGoogleOAuth}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="google-icon"
            >
              <path
                fill="#4285F4"
                d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.5-5 7.2v6h8.1c4.7-4.4 7.2-10.8 7.2-17.3z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.3-7.8 2.3-6 0-11.1-4-12.9-9.4H2.7v6.2C6.7 42.9 14.8 48 24 48z"
              />
              <path
                fill="#FBBC05"
                d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.7C1 17.1 0 20.4 0 24s1 6.9 2.7 9.1l8.4-4.2z"
              />
              <path
                fill="#EA4335"
                d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.6-6.6C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.1 2.7 12.9l8.4 4.2c1.8-5.4 6.9-7.6 12.9-7.6z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Continue as Guest */}
          <button
            id="btn-guest"
            type="button"
            className="btn-primary"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>
        </div>

        {/* ── Footer ── */}
        <footer className="welcome-footer">
          <p className="footer-text">
            Registered Church?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={handleChurchSignUp}
            >
              Sign Up
            </button>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default WelcomePage;
