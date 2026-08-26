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
  className = 'w-32 sm:w-36 shrink-0',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full ${className}`}
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
          <h3 className="text-black text-xs font-semibold leading-snug line-clamp-2 min-h-8">
            {series.title}
          </h3>

          <div className="flex items-center gap-1 text-[9px] text-gray-placeholder font-normal truncate">
            <span>{series.total_parts} {series.total_parts === 1 ? 'Chapter' : 'Chapters'}</span>
            <span>•</span>
            <span className="capitalize truncate">{series.content_type.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 pt-1">
        <button
          type="button"
          onClick={() => onViewSeries(series.series_id)}
          className="w-full py-1.5 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] transition-all duration-200 rounded-md flex justify-center items-center border-none cursor-pointer"
        >
          <span className="text-white text-[9px] font-medium leading-tight tracking-wide">
            View
          </span>
        </button>
      </div>
    </div>
  );
};