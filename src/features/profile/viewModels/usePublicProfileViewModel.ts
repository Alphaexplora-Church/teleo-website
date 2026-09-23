import { useState } from 'react';
import type { UserPublicProfile } from '../models/publicProfileTypes';
import { MOCK_USER_PROFILE } from '../models/publicProfileApi';

interface UsePublicProfileViewModelProps {
  userId?: string;
  onBack?: () => void;
}

export const usePublicProfileViewModel = ({
  onBack,
}: UsePublicProfileViewModelProps = {}) => {
  const [profile, setProfile] = useState<UserPublicProfile>(MOCK_USER_PROFILE);

  const handleToggleAddFriend = () => {
    setProfile((prev) => ({
      ...prev,
      isFriend: !prev.isFriend,
      friendsCount: prev.isFriend ? prev.friendsCount - 1 : prev.friendsCount + 1,
    }));
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return {
    profile,
    handleToggleAddFriend,
    handleBackPress,
  };
};
