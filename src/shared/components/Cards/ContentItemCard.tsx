import React from 'react';
import type { ContentSeriesSummary } from '../../../features/content/models/contentTypes';

interface ContentItemCardProps {
  series: ContentSeriesSummary;
  onViewSeries: (id: string) => void;
  showProgress?: boolean;
  className?: string;
}

export const ContentItemCard: React.FC<ContentItemCardProps> = ({
  series,
  onViewSeries,
  showProgress = false,
  className = 'w-32 sm:w-36 shrink-0',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewSeries(series.series_id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewSeries(series.series_id);
        }
      }}
      className={`bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-zinc-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between text-left select-none ${className}`}
    >
      <div>
        <div className="relative w-full aspect-video sm:h-22 bg-zinc-100 overflow-hidden">
          {series.thumbnail_url ? (
            <img
              src={series.thumbnail_url}
              alt={series.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling instanceof HTMLElement) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            style={{ display: series.thumbnail_url ? 'none' : 'flex' }}
            className="w-full h-full items-center justify-center bg-zinc-100 text-black/50 text-[9px] font-medium text-center px-1"
          >
            No image
          </div>
        </div>

        <div className="p-2.5 flex flex-col gap-1">
          <h3 className="text-black text-xs font-semibold leading-snug line-clamp-2">
            {series.title}
          </h3>

          <div className="flex items-center gap-1 text-[9px] text-gray-placeholder font-normal truncate">
            <span>{series.total_parts} {series.total_parts === 1 ? 'Chapter' : 'Chapters'}</span>
            <span>•</span>
            <span className="capitalize truncate">{series.content_type.replace('_', ' ')}</span>
          </div>

          {showProgress && series.percent_complete !== undefined && (
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-[#336ef9] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, series.percent_complete))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};