// features/content/views/EmptyState.tsx
import React from 'react';
import openBookIcon from '../../../assets/Discover__Screen_icons/open_book.svg';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
  <div className="mx-4 mt-10 flex flex-col items-center rounded-2xl border border-dashed border-[#DBE0E4] px-6 py-10 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#001739]">
      <img src={openBookIcon} alt="" className="h-5 w-5" />
    </span>
    <h3 className="mt-3 text-[14px] font-bold text-[#0A0A0A]">{title}</h3>
    <p className="mt-1 max-w-[240px] text-[12px] leading-5 text-[#8A8A8A]">{message}</p>
  </div>
);

export default EmptyState;
