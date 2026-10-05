import type React from "react";
import { Check } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import type { BadgeVariant } from "../../../shared/components/Badge/badge.style";

export type ReviewTimelineStepStatus = "completed" | "in_progress" | "upcoming";

export interface ReviewTimelineStep {
  id?: string | number;
  title: string;
  description?: string;
  status: ReviewTimelineStepStatus;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  customIcon?: React.ReactNode;
}

export interface StatusReviewTimeLineProps {
  title?: string;
  steps?: ReviewTimelineStep[];
  className?: string;
}

export function StatusReviewTimeLine({
  title,
  steps = [],
  className = "",
}: StatusReviewTimeLineProps) {
  const renderIcon = (step: ReviewTimelineStep) => {
    if (step.customIcon) {
      return (
        <div className="shrink-0 flex items-center justify-center">
          {step.customIcon}
        </div>
      );
    }

    switch (step.status) {
      case "completed":
        return (
          <div
            className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs"
            aria-hidden="true"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        );

      case "in_progress":
        return (
          <div
            className="w-5 h-5 rounded-full border-2 border-amber-500 bg-white flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
        );

      case "upcoming":
      default:
        return (
          <div
            className="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>
        );
    }
  };

  return (
    <div className={`w-full select-none ${className}`.trim()}>
      {/* ── Section Title (Optional) ───────────────────────────── */}
      {title && (
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4">
          {title}
        </h3>
      )}

      {/* ── Timeline Track List ─────────────────────────────────── */}
      <div className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isUpcoming = step.status === "upcoming";

          return (
            <div
              key={step.id ?? `${step.title}-${index}`}
              className="flex gap-3.5 items-start"
            >
              {/* Left Column: Icon and Vertical Track */}
              <div className="flex flex-col items-center shrink-0 self-stretch">
                {renderIcon(step)}
                {!isLast && (
                  <div
                    className={`w-[1.5px] flex-1 my-1 min-h-[28px] transition-colors ${
                      step.status === "completed" ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Right Column: Title, Badge, Description */}
              <div className={`flex-1 min-w-0 ${!isLast ? "pb-5" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap min-h-5">
                  <h4
                    className={`text-[15px] leading-tight ${
                      isUpcoming
                        ? "font-medium text-slate-400"
                        : "font-semibold text-slate-900"
                    }`}
                  >
                    {step.title}
                  </h4>

                  {step.badgeLabel && (
                    <Badge
                      label={step.badgeLabel}
                      variant={step.badgeVariant ?? "default"}
                      size="sm"
                      dotVisible={false}
                    />
                  )}
                </div>

                {step.description && (
                  <p
                    className={`text-[13px] leading-relaxed mt-0.5 ${
                      isUpcoming ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusReviewTimeLine;