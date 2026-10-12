import { useState } from "react";
import { Calendar, Clock, MapPin, Video, Copy, Check } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import { Button } from "../../../shared/components/Button/Button";

export interface NextGatheringData {
  timing?: string;
  subtitle?: string;
  location?: string;
  virtual_link?: string;
  gathering_type?: string;
}

export interface NextGatheringCardProps {
  /** Optional nested gathering object */
  gathering?: NextGatheringData;
  /** Primary meeting timing, e.g. "Tomorrow at 7:00 PM" */
  timing?: string;
  /** Subtitle under timing, e.g. "Weekly fellowship & study" */
  subtitle?: string;
  /** In-person meeting location/room */
  location?: string;
  /** Video meeting link */
  virtualLink?: string;
  /** Meeting type badge text, e.g. "HYBRID" */
  gatheringType?: string;
  /** Card header title */
  headerTitle?: string;
  /** Whether to show calendar icon in header (defaults to !isLead) */
  showHeaderIcon?: boolean;
  /** Copy button label */
  copyButtonLabel?: string;
  /** Copied state button label */
  copiedButtonLabel?: string;
  /** Optional custom copy link callback */
  onCopyLink?: (link: string) => void;
  /** Whether the card is in lead view mode and shows the edit action button */
  isLead?: boolean;
  /** Callback fired when clicking the edit schedule & location button */
  onEditSchedule?: () => void;
  /** Edit button label, defaults to "Edit Schedule & Location" */
  editButtonLabel?: string;
  /** Custom wrapper class */
  className?: string;
}

function CalendarEditIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M21 11V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
      <path d="M3 10h18" />
      <path d="M18.4 13.6a1.4 1.4 0 0 1 2 2L15 21l-3 1 1-3 5.4-5.4z" />
    </svg>
  );
}

export function NextGatheringCard({
  gathering,
  timing = gathering?.timing ?? "Tomorrow at 7:00 PM",
  subtitle = gathering?.subtitle ?? "Weekly fellowship & study",
  location = gathering?.location ?? "123 Acacia St. Room 204",
  virtualLink = gathering?.virtual_link ?? "meet.google.com/xyz-abc",
  gatheringType = gathering?.gathering_type ?? "HYBRID",
  headerTitle = "NEXT GATHERING",
  showHeaderIcon,
  copyButtonLabel = "Copy",
  copiedButtonLabel = "Copied!",
  onCopyLink,
  isLead = false,
  onEditSchedule,
  editButtonLabel = "Edit Schedule & Location",
  className = "",
}: NextGatheringCardProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const shouldShowHeaderIcon = showHeaderIcon ?? !isLead;

  const handleCopy = () => {
    if (onCopyLink) {
      onCopyLink(virtualLink);
    } else if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(virtualLink).catch(() => {});
    }
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3.5 shadow-xs select-none ${className}`.trim()}
    >
      {/* ── Card Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {shouldShowHeaderIcon && (
            <Calendar className="w-4 h-4 text-slate-600" />
          )}
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase select-none">
            {headerTitle}
          </span>
        </div>
        {gatheringType && (
          <Badge
            label={gatheringType}
            variant="default"
            dotVisible={false}
            size="sm"
            className="rounded-md font-semibold text-[10.5px] bg-[#E2E8F0]/70 text-slate-800 tracking-wider uppercase px-2 py-0.5"
          />
        )}
      </div>

      {/* ── Gathering Details ───────────────────────────────────── */}
      {isLead ? (
        <>
          <div className="space-y-0.5 pt-0.5">
            <h3 className="font-bold text-[18px] text-slate-900 leading-snug">
              {timing}
            </h3>
            {subtitle && (
              <p className="text-[13px] text-slate-500 leading-normal">
                {subtitle}
              </p>
            )}
          </div>

          {(location || virtualLink) && (
            <div className="w-full bg-[#F1F3F6]/80 rounded-2xl p-3.5 space-y-2.5">
              {location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-[13.5px] font-medium text-slate-800">
                    {location}
                  </span>
                </div>
              )}
              {virtualLink && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Video className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono text-[13px] text-slate-600 truncate select-all">
                      {virtualLink}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent shrink-0"
                    title={hasCopied ? copiedButtonLabel : copyButtonLabel}
                    aria-label={hasCopied ? copiedButtonLabel : copyButtonLabel}
                  >
                    {hasCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2.5 pt-0.5">
            {timing && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-[15px] text-slate-900 leading-tight">
                    {timing}
                  </p>
                  {subtitle && (
                    <p className="text-[12.5px] text-slate-500">{subtitle}</p>
                  )}
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-[13.5px] font-medium text-slate-700">
                  {location}
                </span>
              </div>
            )}
          </div>

          {virtualLink && (
            <div className="w-full bg-slate-50 rounded-xl border border-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Video className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-mono text-[12.5px] text-slate-700 truncate select-all">
                  {virtualLink}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">
                      {copiedButtonLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copyButtonLabel}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* ── Edit Schedule & Location Action Button (Lead view) ── */}
      {(isLead || onEditSchedule) && (
        <button
          type="button"
          onClick={onEditSchedule}
          className="w-full bg-[#F1F3F6] hover:bg-slate-200 active:scale-[0.99] text-[#0E172A] font-semibold text-[14px] py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer border-none select-none mt-1"
        >
          <CalendarEditIcon className="w-4 h-4 text-[#0E172A] shrink-0" />
          <span>{editButtonLabel}</span>
        </button>
      )}
    </div>
  );
}

export default NextGatheringCard;