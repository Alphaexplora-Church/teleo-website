// features/profile/viewModels/useFriendsViewModel.ts
// ViewModel layer: owns state, effects, API requests, derived grouping/sorting, and UI actions.
// NO JSX. Returns only what the View needs.

import { useState, useMemo, useCallback } from 'react';
import type { FriendUser, ChurchItem } from '../models/friendsTypes';
import {
  MOCK_REQUESTS,
  MOCK_SUGGESTIONS,
  MOCK_FRIENDS,
  MOCK_FOLLOWED_CHURCHES,
  MOCK_SUGGESTED_CHURCHES,
} from '../models/friendsApi';

export interface FriendsViewModelOptions {
  initialTab?: string;
  onBack?: () => void;
}

export interface FriendsViewModelReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  requests: FriendUser[];
  suggestions: FriendUser[];
  friends: FriendUser[];
  groupedFriends: Record<string, FriendUser[]>;
  followedChurches: ChurchItem[];
  suggestedChurches: ChurchItem[];
  friendsCount: number;
  churchesCount: number;
  handleAcceptRequest: (id: number) => void;
  handleDeclineRequest: (id: number) => void;
  handleAddFriend: (id: number) => void;
  handleToggleFollowChurch: (id: number) => void;
  handleBackPress: () => void;
}

export const useFriendsViewModel = (
  options: FriendsViewModelOptions = {}
): FriendsViewModelReturn => {
  const { initialTab = 'Suggestions', onBack } = options;

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [requests, setRequests] = useState<FriendUser[]>(MOCK_REQUESTS);
  const [suggestions, setSuggestions] = useState<FriendUser[]>(MOCK_SUGGESTIONS);
  const [friends] = useState<FriendUser[]>(MOCK_FRIENDS);
  const [followedChurches, setFollowedChurches] = useState<ChurchItem[]>(MOCK_FOLLOWED_CHURCHES);
  const [suggestedChurches] = useState<ChurchItem[]>(MOCK_SUGGESTED_CHURCHES);

  const tabs = ['Suggestions', 'Friends', 'Church Following'];

  // Automatically sort and group friends alphabetically by first letter
  const groupedFriends = useMemo(() => {
    const sorted = [...friends].sort((a, b) => a.name.localeCompare(b.name));
    const groups: Record<string, FriendUser[]> = {};
    sorted.forEach((friend) => {
      const letter = friend.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(friend);
    });
    return groups;
  }, [friends]);

  const handleAcceptRequest = useCallback((id: number) => {
    // TODO: Connect backend API POST /api/friends/requests/:id/accept
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleDeclineRequest = useCallback((id: number) => {
    // TODO: Connect backend API POST /api/friends/requests/:id/decline
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleAddFriend = useCallback((id: number) => {
    // TODO: Connect backend API POST /api/friends/add
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleToggleFollowChurch = useCallback((id: number) => {
    // TODO: Connect backend API POST /api/churches/follow
    setFollowedChurches((prev) => {
      const exists = prev.some((c) => c.id === id);
      if (exists) {
        return prev.filter((c) => c.id !== id);
      }
      const match = suggestedChurches.find((c) => c.id === id);
      if (match) {
        return [...prev, { ...match, isFollowing: true }];
      }
      return prev;
    });
  }, [suggestedChurches]);

  const handleBackPress = useCallback(() => {
    onBack?.();
  }, [onBack]);

  return {
    activeTab,
    setActiveTab,
    tabs,
    requests,
    suggestions,
    friends,
    groupedFriends,
    followedChurches,
    suggestedChurches,
    friendsCount: 123,
    churchesCount: 12,
    handleAcceptRequest,
    handleDeclineRequest,
    handleAddFriend,
    handleToggleFollowChurch,
    handleBackPress,
  };
};
