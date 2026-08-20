// features/content/views/ContentCard.tsx
import React, { useState } from 'react';
import type { DiscoverCourse } from '../models/discoverTypes';
import bookmarkIcon from '../../../assets/Discover__Screen_icons/Bookmark.svg';
import clockIcon from '../../../assets/Discover__Screen_icons/clock.svg';
import openBookIcon from '../../../assets/Discover__Screen_icons/open_book.svg';

interface ContentCardProps {
  course: DiscoverCourse;
  onToggleBookmark: (courseId: string) => void;
}

/** Gradient placeholder shown when a course has no thumbnail or the image fails to load. */
const ThumbnailFallback: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B4E87] to-[#001739]"
    aria-hidden="true"
  >
    <img src={openBookIcon} alt="" className="h-7 w-7 opacity-70" />
  </div>
);

const ContentCard: React.FC<ContentCardProps> = ({ course, onToggleBookmark }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const showFallback = !course.thumbnailUrl || hasImageError;

  return (
    <article className="w-[152px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-[#ECEEF1] shadow-[0_2px_10px_rgba(27,50,82,0.07)]">
      <div className="relative h-[110px] w-full bg-[#DBE0E4]">
        {showFallback ? (
          <ThumbnailFallback />
        ) : (
          <img
            src={course.thumbnailUrl}
            alt={course.thumbnailAlt}
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <button
          type="button"
          onClick={() => onToggleBookmark(course.id)}
          aria-pressed={course.isBookmarked}
          aria-label={course.isBookmarked ? `Remove ${course.title} from bookshelf` : `Save ${course.title} to bookshelf`}
          className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
            course.isBookmarked ? 'bg-[#336EF9]' : 'bg-white/95'
          }`}
        >
          <img
            src={bookmarkIcon}
            alt=""
            className={`h-2.5 w-2.5 ${course.isBookmarked ? 'brightness-0 invert' : ''}`}
          />
        </button>
      </div>

      <div className="px-2.5 pb-3 pt-2.5">
        <h3 className="truncate text-[12.5px] font-bold leading-tight text-[#0A0A0A]">
          {course.title}
        </h3>
        <p className="mt-0.5 truncate text-[10.5px] text-[#8A8A8A]">{course.formatLabel}</p>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#5B6470]">
          <img src={clockIcon} alt="" className="h-[13px] w-[13px]" />
          <span>{course.duration}</span>
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
