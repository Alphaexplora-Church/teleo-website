import { useState, useEffect, useRef, useCallback } from "react";
import { EllipsisVertical, CirclePause, CirclePlay, LogOut } from "lucide-react";

export interface GroupActionProps {
  /** Indicates whether the group membership is currently paused */
  isPaused?: boolean;
  /** Callback fired when user selects Pause */
  onPause?: () => void;
  /** Callback fired when user selects Resume (available when group is paused) */
  onResume?: () => void;
  /** Callback fired when user selects Leave */
  onLeave?: () => void;
  /** Custom label for Pause action. Defaults to "Pause" */
  pauseLabel?: string;
  /** Custom label for Resume action. Defaults to "Resume" */
  resumeLabel?: string;
  /** Custom label for Leave action. Defaults to "Leave" */
  leaveLabel?: string;
  /** Custom trigger button className */
  buttonClassName?: string;
  /** Custom container wrapper className */
  className?: string;
}

export function GroupAction({
  isPaused = false,
  onPause,
  onResume,
  onLeave,
  pauseLabel = "Pause",
  resumeLabel = "Resume",
  leaveLabel = "Leave",
  buttonClassName = "",
  className = "",
}: GroupActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Dismiss on click outside or Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  const handlePauseResumeClick = useCallback(() => {
    closeDropdown();
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  }, [isPaused, onPause, onResume, closeDropdown]);

  const handleLeaveClick = useCallback(() => {
    closeDropdown();
    onLeave?.();
  }, [onLeave, closeDropdown]);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`.trim()}>
      {/* ── Trigger Button ────────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Group options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`
          p-1.5 -mr-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100
          rounded-full transition-colors cursor-pointer border-none bg-transparent
          focus:outline-none
          ${buttonClassName}
        `.trim()}
      >
        <EllipsisVertical className="w-6 h-6 text-slate-900" />
      </button>

      {/* ── Messenger-Style Dropdown Menu ─────────────────────────── */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="
            absolute right-0 top-full mt-2 w-48
            bg-white rounded-2xl shadow-xl border border-slate-100
            p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right
            focus:outline-none select-none
          "
        >
          {/* Pause / Resume Option */}
          <button
            type="button"
            role="menuitem"
            onClick={handlePauseResumeClick}
            className="
              w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900
              transition-colors cursor-pointer text-left border-none bg-transparent
            "
          >
            {isPaused ? (
              <CirclePlay className="w-4 h-4 text-slate-700 shrink-0" />
            ) : (
              <CirclePause className="w-4 h-4 text-slate-700 shrink-0" />
            )}
            <span>{isPaused ? resumeLabel : pauseLabel}</span>
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Leave Option */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLeaveClick}
            className="
              w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              text-[14px] font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700
              transition-colors cursor-pointer text-left border-none bg-transparent
            "
          >
            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{leaveLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupAction;