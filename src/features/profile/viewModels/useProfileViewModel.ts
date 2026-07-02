import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../shared/models/authService';

export interface ProfileViewModelReturn {
  isLoggingOut: boolean;
  logoutError: string | null;
  handleLogout: () => Promise<void>;
}

export const useProfileViewModel = (): ProfileViewModelReturn => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      // Redirect to login page on success
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('An unexpected error occurred during logout.');
      setIsLoggingOut(false);
    }
  }, [navigate]);

  return {
    isLoggingOut,
    logoutError,
    handleLogout,
  };
};
