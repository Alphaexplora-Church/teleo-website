import { discipleshipProcessChurchApplyConst } from "../../models/constants/discipleshipProcessChurchApply.constant";
import type {
  DiscipleshipProcessChurchApplyConfig,
  DiscipleshipProcessChurchApplyProps,
} from "../../models/types/discipleshipProcessChurchApply.types";
import { ChurchQuestionIntake } from "../../components/ChurchQuestionIntake";
import { useDiscipleshipChurchApply } from "../../viewmodels/useDiscipleshipChurchApply";

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

  const {
    resolvedChurch,
    questions,
    answers,
    isFormValid,
    handleAnswerChange,
    handleSubmit,
  } = useDiscipleshipChurchApply({
    churchId,
    church,
    questions: userQuestions,
    onSubmit,
  });

  // Icons are injected exclusively from Model/Constant layer
  const BackIcon = resolvedConfig.buttonBack.icon;
  const SubmitIcon = resolvedConfig.buttonSubmit.icon;

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button (Icon Only) ──────────────── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#0E172A] hover:text-[#042C58] hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          aria-label={resolvedConfig.buttonBack.label || "Back"}
        >
          {BackIcon && <BackIcon className="w-6 h-6 text-[#0E172A]" />}
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
            placeholder={question.placeholder || resolvedConfig.inputPlaceholder}
            value={answers[question.id] || ""}
            onChange={(val) => handleAnswerChange(question.id, val)}
          />
        ))}
      </div>

      {/* ── Bottom Action Button ─────────────────────────────────── */}
      <div className="pt-2 pb-6">
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
      </div>
    </div>
  );
}

export default DiscipleshipProcessChurchApply;
