// features/content/viewModels/useDiscoverViewModel.ts
// Owns all interactive state for the Discover screen (active tab, search,
// bookmarks, notifications) and derives the data each view needs.
// The view layer stays presentational and simply renders what this hook returns.

import { useMemo, useState } from 'react';
import {
  DISCOVER_NOTIFICATIONS,
  DISCOVER_SECTIONS,
  DISCOVER_USER,
} from '../models/discoverMockData';
import type {
  DiscoverNotification,
  DiscoverSection,
  DiscoverTabId,
} from '../models/discoverTypes';

export const useDiscoverViewModel = (searchQuery: string) => {
  const [activeTab, setActiveTab] = useState<DiscoverTabId>('library');
  const [sections, setSections] = useState<DiscoverSection[]>(DISCOVER_SECTIONS);
  const [notifications, setNotifications] = useState<DiscoverNotification[]>(
    DISCOVER_NOTIFICATIONS,
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleBookmark = (courseId: string) => {
    setSections((previous) =>
      previous.map((section) => ({
        ...section,
        courses: section.courses.map((course) =>
          course.id === courseId
            ? { ...course, isBookmarked: !course.isBookmarked }
            : course,
        ),
      })),
    );
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    // Opening the panel is treated as "read" \u2014 mirrors common inbox UX.
    setNotifications((previous) => previous.map((item) => ({ ...item, isUnread: false })));
  };

  const closeNotifications = () => setIsNotificationsOpen(false);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((item) => item.isUnread).length,
    [notifications],
  );

  // Derive what's actually shown for the active tab + search query without
  // mutating the underlying mock dataset.
  const visibleSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = (title: string) => !query || title.toLowerCase().includes(query);

    return sections
      .map((section) => ({
        ...section,
        courses: section.courses.filter((course) => {
          if (!matchesQuery(course.title)) return false;
          if (activeTab === 'bookshelf') return course.isBookmarked;
          if (activeTab === 'downloads') return course.isDownloaded;
          return true;
        }),
      }))
      .filter((section) => section.courses.length > 0);
  }, [sections, activeTab, searchQuery]);

  const totalCourseCount = useMemo(
    () => sections.reduce((total, section) => total + section.courses.length, 0),
    [sections],
  );

  return {
    user: DISCOVER_USER,
    activeTab,
    setActiveTab,
    visibleSections,
    totalCourseCount,
    toggleBookmark,
    notifications,
    isNotificationsOpen,
    openNotifications,
    closeNotifications,
    unreadNotificationCount,
  };
};

export type DiscoverViewModel = ReturnType<typeof useDiscoverViewModel>;
