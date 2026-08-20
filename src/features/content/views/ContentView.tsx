// features/content/views/ContentView.tsx
// The Discover / Library screen. Fully self-contained (own hero header,
// tab pills, and bottom nav) so it can be dropped in as a standalone screen,
// matching the MVVM convention used across this codebase: this view stays
// presentational and delegates all state to useDiscoverViewModel.

import React from 'react';
import { useDiscoverViewModel } from '../viewModels/useDiscoverViewModel';
import DiscoverHeader from './DiscoverHeader';
import ContentSection from './ContentSection';
import EmptyState from './EmptyState';
import burgerMenuIcon from '../../../assets/Discover__Screen_icons/Burger_menu.svg';

const EMPTY_STATE_COPY: Record<'bookshelf' | 'downloads' | 'search', { title: string; message: string }> = {
  bookshelf: {
    title: 'Your bookshelf is empty',
    message: 'Tap the bookmark icon on any title to save it here for quick access later.',
  },
  downloads: {
    title: 'Nothing downloaded yet',
    message: 'Downloaded chapters, lessons, and readings will show up here for offline viewing.',
  },
  search: {
    title: 'No matches found',
    message: 'Try a different keyword or clear your search to browse the full library.',
  },
};

interface ContentViewProps {
  isSearchOpen: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

const ContentView: React.FC<ContentViewProps> = ({
  isSearchOpen,
  searchQuery,
  onSearchQueryChange,
}) => {
  const {
    user,
    activeTab,
    setActiveTab,
    visibleSections,
    toggleBookmark,
  } = useDiscoverViewModel(searchQuery);

  const isFiltering = searchQuery.trim().length > 0;
  const emptyStateKey = isFiltering ? 'search' : activeTab === 'library' ? null : activeTab;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white text-[#111]">
      <DiscoverHeader
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
      />

      <main className="relative -mt-6 flex-1 rounded-t-[28px] bg-white pb-8 pt-9">
        {visibleSections.length === 0 && emptyStateKey && (
          <EmptyState {...EMPTY_STATE_COPY[emptyStateKey]} />
        )}

        {visibleSections.map((section) => (
          <ContentSection key={section.id} section={section} onToggleBookmark={toggleBookmark} />
        ))}

        <div className="pointer-events-none fixed inset-x-0 bottom-[84px] z-20 flex justify-center">
          <div className="relative w-full max-w-[448px]">
            <button
              type="button"
              aria-label="Open quick actions"
              className="pointer-events-auto absolute bottom-0 right-5 h-[53px] w-[53px] transition-transform active:scale-95"
            >
              <img src={burgerMenuIcon} alt="" className="h-full w-full" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentView;
