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
  /** Copy button label */
  copyButtonLabel?: string;
  /** Copied state button label */
  copiedButtonLabel?: string;
  /** Optional custom copy link callback */
  onCopyLink?: (link: string) => void;
  /** Custom wrapper class */
  className?: string;
}

export function NextGatheringCard({
  gathering,
  timing = gathering?.timing ?? "Tomorrow at 7:00 PM",
  subtitle = gathering?.subtitle ?? "Weekly fellowship & study",
  location = gathering?.location ?? "123 Acacia St. Room 204",
  virtualLink = gathering?.virtual_link ?? "meet.google.com/xyz-abc",
  gatheringType = gathering?.gathering_type ?? "HYBRID",
  headerTitle = "NEXT GATHERING",
  copyButtonLabel = "Copy",
  copiedButtonLabel = "Copied!",
  onCopyLink,
  className = "",
}: NextGatheringCardProps) {
  const [hasCopied, setHasCopied] = useState(false);

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
          <Calendar className="w-4 h-4 text-slate-600" />
          <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
            {headerTitle}
          </span>
        </div>
        {gatheringType && (
          <Badge
            label={gatheringType}
            variant="default"
            dotVisible={false}
            size="sm"
            className="rounded-md font-medium text-[11px] bg-slate-100 text-slate-600 tracking-wide uppercase"
          />
        )}
      </div>

      {/* ── Gathering Details ───────────────────────────────────── */}
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
                <p className="text-[12.5px] text-slate-500">
                  {subtitle}
                </p>
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

      {/* ── Virtual Link Box ────────────────────────────────────── */}
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
    </div>
  );
}

export default NextGatheringCard;