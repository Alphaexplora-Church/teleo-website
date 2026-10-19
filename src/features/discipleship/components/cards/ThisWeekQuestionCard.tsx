import { Quote } from "lucide-react";

export interface ThisWeekQuestionCardProps {
  /** The reflection question text */
  question?: string;
  /** Card header title */
  headerTitle?: string;
  /** Footnote text displayed below question */
  footnoteText?: string;
  /** Custom wrapper styling */
  className?: string;
}

export function ThisWeekQuestionCard({
  question = "Where have you experienced God’s peace amidst challenges this week?",
  headerTitle = "THIS WEEK'S QUESTION",
  className = "",
}: ThisWeekQuestionCardProps) {
  // Format with curly quotes if not already enclosed
  const formattedQuestion =
    question.startsWith("“") || question.startsWith('"')
      ? question
      : `“${question}”`;

  return (
    <div
      className={`w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs select-none ${className}`.trim()}
    >
      {/* ── Card Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Quote className="w-4 h-4 text-slate-600 rotate-180" />
        <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
          {headerTitle}
        </span>
      </div>

      {/* ── Quote Block ─────────────────────────────────────────── */}
      <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-4 flex gap-3">
        <div className="w-1 bg-slate-300 rounded-full shrink-0 self-stretch my-0.5" />
        <p className="italic text-[13.5px] text-slate-800 leading-relaxed font-normal">
          {formattedQuestion}
        </p>
      </div>

    </div>
  );
}

export default ThisWeekQuestionCard;