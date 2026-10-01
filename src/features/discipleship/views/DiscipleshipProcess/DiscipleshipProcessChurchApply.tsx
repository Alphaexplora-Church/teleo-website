import { useMemo, useState } from "react";
import { discipleshipProcessChurchApplyConst } from "../../models/constants/discipleshipProcessChurchApply.constant";
import { getIntakeQuestionsByChurchId } from "../../models/mocks/discipleshipIntakeQuestion";
import { mockDiscipleshipChurches } from "../../models/mocks/discipleshipChurches.mocks";
import type {
  DiscipleshipProcessChurchApplyConfig,
  DiscipleshipProcessChurchApplyProps,
} from "../../models/types/discipleshipProcessChurchApply.types";
import { ChurchQuestionIntake } from "../../components/ChurchQuestionIntake";

export function DiscipleshipProcessChurchApply({
  churchId,
  church,
  questions: userQuestions,
  config: userConfig,
  onBack,
  onSubmit,
  className = "",
}: DiscipleshipProcessChurchApplyProps = {}) {
  const resolvedConfig: DiscipleshipProcessChurchApplyConfig = {
    ...discipleshipProcessChurchApplyConst,
    ...userConfig,
    buttonBack: {
      ...discipleshipProcessChurchApplyConst.buttonBack,
      ...userConfig?.buttonBack,
    },
    buttonSubmit: {
      ...discipleshipProcessChurchApplyConst.buttonSubmit,
      ...userConfig?.buttonSubmit,
    },
    icons: {
      ...discipleshipProcessChurchApplyConst.icons,
      ...userConfig?.icons,
    },
  };

  const targetChurchId = churchId ?? church?.church_id ?? 102;

  const resolvedChurch = useMemo(() => {
    if (church) return church;
    return (
      mockDiscipleshipChurches.find((c) => c.church_id === targetChurchId) ??
      mockDiscipleshipChurches[0]
    );
  }, [church, targetChurchId]);

  const questions = useMemo(() => {
    if (userQuestions && userQuestions.length > 0) return userQuestions;
    return getIntakeQuestionsByChurchId(targetChurchId).questions;
  }, [userQuestions, targetChurchId]);

  // Answers state for all questions
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit button is disabled if required questions are not answered
  // Basta may laman ang bawat input/textarea (trimmed length > 0), valid na agad!
  const isFormValid = useMemo(() => {
    if (questions.length === 0) return false;
    return questions.every((q) => {
      if (q.required === false) return true;
      const answer = (answers[q.id] || "").trim();
      return answer.length > 0;
    });
  }, [questions, answers]);

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit?.(answers);
  };

  // Icons are injected exclusively from Model/Constant layer
  const BackIcon = resolvedConfig.buttonBack.icon;
  const SubmitIcon = resolvedConfig.buttonSubmit.icon;
  const FootnoteIcon = resolvedConfig.icons.footnote;

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back to Church Button Only (No profile avatar) ── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[17px] font-semibold text-[#0E172A] hover:text-[#042C58] transition-colors cursor-pointer border-none bg-transparent p-0"
          aria-label={resolvedConfig.buttonBack.label}
        >
          {BackIcon && <BackIcon className="w-5 h-5 -ml-1 text-[#0E172A]" />}
          <span>{resolvedConfig.buttonBack.label}</span>
        </button>
      </div>

      {/* ── Header: Church Name & Apply Title ───────────────────── */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-[#62718A] tracking-wider uppercase">
          {resolvedChurch?.name || "RIVERSIDE FELLOWSHIP"}
        </span>
        <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
          {resolvedConfig.titleHeader}
        </h1>
        <p className="text-[14px] text-[#62718A] leading-relaxed">
          {resolvedConfig.subtitle}
        </p>
      </div>

      {/* ── Questions Intake Form ──────────────────────────────── */}
      <div className="space-y-6 pt-1">
        {questions.map((question) => (
          <ChurchQuestionIntake
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        ))}
      </div>

      {/* ── Bottom Action Button & Footnote ─────────────────────── */}
      <div className="pt-2 space-y-3 pb-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          aria-disabled={!isFormValid}
          className={`w-full h-12 font-semibold text-[15px] rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            isFormValid
              ? "bg-[#0E172A] hover:bg-black text-white cursor-pointer active:scale-[0.99]"
              : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
          }`}
        >
          <span>{resolvedConfig.buttonSubmit.label}</span>
          {SubmitIcon && <SubmitIcon className="w-4 h-4" />}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#62718A]">
          {FootnoteIcon && (
            <FootnoteIcon className="w-3.5 h-3.5 text-[#62718A] shrink-0" />
          )}
          <span>{resolvedConfig.footnoteText}</span>
        </div>
      </div>
    </div>
  );
}

export default DiscipleshipProcessChurchApply;