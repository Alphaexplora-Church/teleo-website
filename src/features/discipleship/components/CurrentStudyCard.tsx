import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import { Button } from "../../../shared/components/Button/Button";

export interface CurrentStudyData {
  module_badge?: string;
  title?: string;
  lesson_subtitle?: string;
}

export interface CurrentStudyCardProps {
  /** Optional nested study object */
  study?: CurrentStudyData;
  /** Study module title, e.g. "Romans 8: Life in the Spirit" */
  title?: string;
  /** @deprecated Lesson details/subtitle - no longer displayed */
  subtitle?: string;
  /** Badge label, e.g. "Module 2" */
  moduleBadge?: string;
  /** Card header title */
  headerTitle?: string;
  /** Action button CTA text */
  actionLabel?: string;
  /** Callback fired when the reading action button is clicked */
  onOpenReading?: (studyTitle: string) => void;
  /** Custom wrapper styling */
  className?: string;
}

export function CurrentStudyCard({
  study,
  title = study?.title ?? "Romans 8: Life in the Spirit",
  moduleBadge = study?.module_badge ?? "Module 2",
  headerTitle = "CURRENT STUDY",
  actionLabel = "Open Reading in Journey Tab",
  onOpenReading,
  className = "",
}: CurrentStudyCardProps) {
  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs select-none ${className}`.trim()}
    >
      {/* ── Card Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-600" />
          <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
            {headerTitle}
          </span>
        </div>
        {moduleBadge && (
          <Badge
            label={moduleBadge}
            variant="default"
            dotVisible={false}
            size="sm"
            className="rounded-md font-medium text-[11px] bg-slate-100 text-slate-600 tracking-wide"
          />
        )}
      </div>

      {/* ── Study Title ─────────────────────────────────────────── */}
      <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
        {title}
      </h3>

      {/* ── Action Button ───────────────────────────────────────── */}
      <Button
        variant="outline"
        size="md"
        fullWidth
        onClick={() => onOpenReading?.(title)}
        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl py-3 px-3.5 !justify-between text-[13px] font-semibold text-slate-900 transition-all shadow-2xs mt-1 cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-4 h-4 text-slate-600" />
      </Button>
    </div>
  );
}

export default CurrentStudyCard;
