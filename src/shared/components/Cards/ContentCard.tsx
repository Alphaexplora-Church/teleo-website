import React from 'react';
import type { ContentSeriesSummary } from '../../../features/content/models/contentTypes';

interface ContentCardProps {
  series: ContentSeriesSummary;
  onClick: (seriesId: string) => void;
  onBookmarkToggle?: (seriesId: string, e: React.MouseEvent) => void;
  showProgress?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  series,
  onClick,
  onBookmarkToggle,
  showProgress = false,
}) => {
  return (
    <div
      onClick={() => onClick(series.series_id)}
      className="group relative flex-none w-65 sm:w-75 cursor-pointer rounded-[20px] bg-[#336ef90d] border border-[#1f2156] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-3 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-300">
        {series.thumbnail_url ? (
          <img
            src={series.thumbnail_url}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#1f2156] to-[#336ef9] flex items-center justify-center p-4">
            <span className="text-white text-xs font-semibold text-center line-clamp-2">
              {series.title}
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1">
          <span className="rounded-md bg-[#1f2156]/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm uppercase">
            {series.content_type.replace('_', ' ')}
          </span>
        </div>

        {onBookmarkToggle && (
          <button
            onClick={(e) => onBookmarkToggle(series.series_id, e)}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Bookmark"
          >
            {series.is_bookmarked ? '★' : '☆'}
          </button>
        )}

        {showProgress && series.percent_complete !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div
              className="h-full bg-[#336ef9]"
              style={{ width: `${series.percent_complete}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-sans text-sm font-semibold text-black line-clamp-1">
          {series.title}
        </h3>
        <div className="flex items-center justify-between text-[12px] text-gray-placeholder">
          <span>{series.total_parts} {series.total_parts === 1 ? 'Part' : 'Parts'}</span>
          {showProgress && series.percent_complete !== undefined && (
            <span className="text-[#336ef9] font-medium">{series.percent_complete}% Done</span>
          )}
        </div>
      </div>
    </div>
  );
};
