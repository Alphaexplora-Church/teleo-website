// features/welcome/viewModels/useWelcomeViewModel.ts
// ViewModel: exposes navigation action handlers for the Welcome/Landing page

import { useNavigate } from 'react-router-dom';
import { continueAsGuest, loginWithGoogle } from '../../../shared/models/authService';

interface WelcomeViewModel {
  handleCreateAccount: () => void;
  handleLogin: () => void;
  handleGoogleOAuth: () => Promise<void>;
  handleGuestLogin: () => Promise<void>;
  handleChurchSignUp: () => void;
}

export const useWelcomeViewModel = (): WelcomeViewModel => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  /**
   * Google OAuth handler — stubbed and isolated, ready to bind to
   * a real OAuth provider callback (e.g. Firebase, Supabase, Auth0).
   */
  const handleGoogleOAuth = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const result = await continueAsGuest();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };

  const handleChurchSignUp = () => {
    navigate('/register?type=church');
  };

  return {
    handleCreateAccount,
    handleLogin,
    handleGoogleOAuth,
    handleGuestLogin,
    handleChurchSignUp,
  };
};
