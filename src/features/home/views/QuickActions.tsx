import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-3 px-3">
    <button className="relative flex h-[82px] flex-col rounded-[18px] bg-[#3E2723] px-3 py-2 text-left text-[#FFF7E0] shadow-[0_7px_16px_rgba(62,39,35,0.30)] ring-1 ring-[#C7A17A]/30">
      <span className="text-[10px]">My Next Appointment</span><span className="text-[14px] font-bold leading-5">Pastoral<br/>Counseling</span>
      <span className="absolute right-2 top-2 flex w-11 flex-col items-center gap-1 text-center text-[8px] font-bold leading-none"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFAF00] text-[#001739]"><Icon size={18}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Icon></span><span className="rounded-full bg-[#001739]/55 px-2 py-1 text-white shadow-[0_2px_5px_rgba(0,0,0,0.28)] backdrop-blur-sm">Today</span></span>
      <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#001739]"><Icon size={12}><path d="m9 18 6-6-6-6"/></Icon></span>
    </button>
    <button className="relative flex h-[82px] flex-col rounded-[18px] bg-[#F7941D] px-3 py-2 text-left text-white shadow-[0_7px_16px_rgba(230,81,0,0.24)] ring-1 ring-[#FFE0B2]/40">
      <span className="text-[10px]">Continue Reading</span><span className="text-[14px] font-bold">Sunday Service</span>
      <span className="absolute right-1 top-2 flex w-[58px] flex-col items-center gap-1 text-center text-[7px] font-bold leading-none"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B4E87] text-white"><Icon size={17}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6"/></Icon></span><span className="whitespace-nowrap rounded-full bg-[#001739]/65 px-1.5 py-1 text-white shadow-[0_2px_5px_rgba(0,0,0,0.28)] backdrop-blur-sm">Matt. 5:17–19</span></span>
      <div className="mt-auto flex items-center gap-1.5 pr-6"><span className="h-2 min-w-0 flex-1 overflow-hidden rounded bg-white/75"><span className="block h-full w-[42%] rounded bg-[#22C55E]" /></span><b className="shrink-0 text-[9px]">42%</b></div>
      <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#001739]"><Icon size={12}><path d="m9 18 6-6-6-6"/></Icon></span>
    </button>
  </div>
);

export default QuickActions;
