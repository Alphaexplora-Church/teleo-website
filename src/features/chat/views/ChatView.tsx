// features/chat/views/ChatView.tsx
// View: Chat tab — "Coming Soon" placeholder screen.
// Purely presentational — no ViewModel needed (no business state or async ops).

import React from 'react';

// ── Large decorative chat icon ────────────────────────────────
const ChatBubbleIcon: React.FC = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    {/* Subtle message dots */}
    <circle cx="9" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="12" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="11" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
const ChatView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 py-12 text-center gap-5">
      {/* Icon container */}
      <div className="w-[120px] h-[120px] rounded-3xl bg-navy/5 flex items-center justify-center text-navy/25">
        <ChatBubbleIcon />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2 max-w-[260px]">
        <h1 className="text-[22px] font-bold text-navy leading-tight">
          Chat Coming Soon
        </h1>
        <p className="text-[13.5px] text-gray-placeholder leading-relaxed">
          We're building a space for your community to connect. Stay tuned!
        </p>
      </div>

      {/* Subtle badge */}
      <span className="mt-1 px-4 py-1.5 rounded-full bg-navy/8 text-navy/60 text-[11px] font-semibold tracking-wide uppercase">
        In Development
      </span>
    </div>
  );
};

export default ChatView;
