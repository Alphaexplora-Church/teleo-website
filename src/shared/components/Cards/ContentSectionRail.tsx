import React from 'react';
import { ContentItemCard } from './ContentItemCard';
import type { ContentSeriesSummary } from '../../../features/content/models/contentTypes';

interface ContentSectionRailProps {
  title: string;
  seriesList: ContentSeriesSummary[];
  onViewAll?: () => void;
  onViewSeries: (id: string) => void;
  showProgress?: boolean;
}

export const ContentSectionRail: React.FC<ContentSectionRailProps> = ({
  title,
  seriesList,
  onViewAll,
  onViewSeries,
  showProgress = false,
}) => {
  if (!seriesList || seriesList.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-black text-lg sm:text-xl font-semibold leading-snug">{title}</h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-right text-[#336ef9] text-xs sm:text-sm font-medium transition-opacity duration-150 hover:opacity-75 cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
        {seriesList.map((series) => (
          <ContentItemCard
            key={series.series_id}
            series={series}
            onViewSeries={onViewSeries}
            showProgress={showProgress}
          />
        ))}
      </div>
    </section>
  );
};