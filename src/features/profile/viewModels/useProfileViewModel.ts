import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../shared/models/authService';
import { fetchProfileSettingsView } from '../models/profileApi';
import type { ProfileSettingsView } from '../models/profileTypes';

export interface ProfileViewModelReturn {
  // Profile header data
  profileView: ProfileSettingsView | null;
  isLoadingProfile: boolean;
  profileError: string | null;

  // Session
  isLoggingOut: boolean;
  logoutError: string | null;
  handleLogout: () => Promise<void>;
}

export const useProfileViewModel = (): ProfileViewModelReturn => {
  const [profileView, setProfileView] = useState<ProfileSettingsView | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ── Fetch profile header data on mount ───────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileSettingsView();
        setProfileView(data);
      } catch (err) {
        console.error('Failed to load profile view:', err);
        setProfileError('Could not load profile information.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('An unexpected error occurred during logout.');
      setIsLoggingOut(false);
    }
  }, [navigate]);

  return {
    profileView,
    isLoadingProfile,
    profileError,
    isLoggingOut,
    logoutError,
    handleLogout,
  };
};
