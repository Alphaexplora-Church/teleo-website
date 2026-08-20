// features/content/views/ContentSection.tsx
import React from 'react';
import type { DiscoverSection } from '../models/discoverTypes';
import ContentCard from './ContentCard';

interface ContentSectionProps {
  section: DiscoverSection;
  onToggleBookmark: (courseId: string) => void;
  onShowAll?: (sectionId: string) => void;
}

const ChevronRight: React.FC = () => (
  <svg width="7" height="12" viewBox="0 0 8 13" fill="none" aria-hidden="true">
    <polyline
      points="1 1 7 6.5 1 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContentSection: React.FC<ContentSectionProps> = ({ section, onToggleBookmark, onShowAll }) => (
  <section className="mt-6" aria-labelledby={`section-${section.id}-heading`}>
    <div className="flex items-center justify-between px-4">
      <h2 id={`section-${section.id}-heading`} className="text-[16px] font-bold text-[#0A0A0A]">
        {section.title}
      </h2>
      {section.showAll && (
        <button
          type="button"
          onClick={() => onShowAll?.(section.id)}
          className="flex items-center gap-1 text-[12.5px] font-semibold text-[#336EF9] transition-opacity hover:opacity-75"
        >
          Show all
          <ChevronRight />
        </button>
      )}
    </div>

    <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
      {section.courses.map((course) => (
        <ContentCard key={course.id} course={course} onToggleBookmark={onToggleBookmark} />
      ))}
    </div>
  </section>
);

export default ContentSection;
