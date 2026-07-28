import React from 'react';
import timeIcon from '../../../assets/icons/time icon.svg';
import type { DailyGospel } from '../models/gospelTypes';
import type { HeroSlide } from '../models/homeTypes';

const Icon: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;

interface GospelCardProps {
  slides: HeroSlide[];
  activeIndex: number;
  dailyGospel: DailyGospel | null;
  isGospelLoading: boolean;
  gospelError: string | null;
  onSlideChange: (index: number) => void;
  onEventOpen: () => void;
}

const GospelCard: React.FC<GospelCardProps> = ({ slides, activeIndex, dailyGospel, isGospelLoading, gospelError, onSlideChange, onEventOpen }) => (
  // Both slides stay mounted so cross-fades do not trigger image reflow.
  <section className="relative h-[190px] overflow-hidden rounded-xl bg-[#001739] text-white shadow-sm" aria-roledescription="carousel" aria-label="Featured church updates">
    <div className={`absolute inset-0 transition-opacity duration-500 ${activeIndex === 0 ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={activeIndex !== 0}>
      <img src={slides[0].imageUrl} alt="Cross at sunrise" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001739]/75 via-[#042C58]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001739]/25 via-transparent to-transparent" />
      <div className="relative flex h-full flex-col p-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase"><Icon size={20}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4v8H7zM14 8h3M14 12h3"/></Icon> Gospel of the day</p>
        <h1 className="mt-2 text-[22px] font-bold tracking-tight">{isGospelLoading ? "Loading today's Gospel" : dailyGospel?.reference ?? 'Gospel unavailable'}</h1>
        <p className="mt-1 pr-2 text-[11px] font-normal leading-[18px] text-white/95">
          {isGospelLoading ? 'Preparing the daily reading...' : dailyGospel?.content ?? gospelError ?? 'Please check again later.'}
        </p>
      </div>
    </div>
    <div className={`absolute inset-0 transition-opacity duration-500 ${activeIndex === 1 ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={activeIndex !== 1}>
      <button type="button" onClick={onEventOpen} aria-label="Open full event post" className="absolute inset-0 z-10 cursor-pointer" />
      <img src={slides[1].imageUrl} alt="Guests gathering at an outdoor celebration" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001739]/78 via-[#001739]/38 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001739]/20 via-transparent to-transparent" />
      <div className="relative flex h-full flex-col p-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase"><span className="flex h-7 w-7 items-center justify-center rounded bg-[#DBE0E4] text-[#042C58]"><Icon size={18}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Icon></span> Upcoming events</p>
        <h1 className="mt-1 max-w-[285px] font-serif text-[26px] font-bold leading-[1.05]">PRAISE! Youth<br/>Worship Charity<br/>Concert</h1>
        <p className="mt-2 text-[12px] font-semibold text-[#3399FF]">Paranaque, 1713</p>
        <p className="mt-1 flex items-center gap-2 text-[11px]"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-white"><img src={timeIcon} alt="" className="h-3 w-3 brightness-0" /></span> 6:00 PM</p>
        <div className="absolute right-4 top-5 flex h-[74px] w-[64px] flex-col items-center justify-center rounded-[22px] border border-[#FFAF00] bg-[#001739]/30 leading-none backdrop-blur-sm"><span className="text-[11px] font-bold tracking-wider text-[#FFAF00]">MAR</span><strong className="mt-1 text-[31px]">10</strong></div>
      </div>
    </div>
    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label="Choose featured slide">
      {slides.map((slide, index) => <button key={slide.id} type="button" role="tab" aria-selected={activeIndex === index} aria-label={index === 0 ? 'Show Gospel of the Day' : 'Show Upcoming Events'} onClick={() => onSlideChange(index)} className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-7 bg-[#3399FF]' : 'w-2 bg-white/80'}`} />)}
    </div>
  </section>
);

export default GospelCard;
