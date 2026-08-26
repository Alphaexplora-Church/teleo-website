import React from 'react';
import { ContentCard } from './ContentCard';
import type { ContentSeriesSummary } from '../../../features/content/models/contentTypes';

interface ContentRailProps {
  title: string;
  seriesList: ContentSeriesSummary[];
  onSeriesClick: (seriesId: string) => void;
  onBookmarkToggle?: (seriesId: string, e: React.MouseEvent) => void;
  showProgress?: boolean;
}

export const ContentRail: React.FC<ContentRailProps> = ({
  title,
  seriesList,
  onSeriesClick,
  onBookmarkToggle,
  showProgress = false,
}) => {
  if (seriesList.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-xl font-semibold text-black tracking-tight">
          {title}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {seriesList.map((series) => (
          <ContentCard
            key={series.series_id}
            series={series}
            onClick={onSeriesClick}
            onBookmarkToggle={onBookmarkToggle}
            showProgress={showProgress}
          />
        ))}
      </div>
    </section>
  );
};
