import { useState, type ChangeEvent } from "react";
import {
  mockDiscipleshipIntakeQuestions,
  type DiscipleshipIntakeQuestion,
} from "../models/mocks/discipleshipIntakeQuestion.mocks";

export interface ChurchQuestionIntakeProps {
  question?: DiscipleshipIntakeQuestion;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_MOCK_QUESTION: DiscipleshipIntakeQuestion =
  mockDiscipleshipIntakeQuestions[101]?.questions[0] ?? {
    id: "q1",
    label: "Where are you in your walk with God?",
    placeholder: "",
    field_type: "textarea",
    required: true,
    max_length: 500,
  };

export function ChurchQuestionIntake({
  question = DEFAULT_MOCK_QUESTION,
  value,
  defaultValue = "",
  onChange,
  maxLength,
  disabled = false,
  className = "",
}: ChurchQuestionIntakeProps = {}) {
  const activeQuestion = question ?? DEFAULT_MOCK_QUESTION;
  const maxLen = maxLength ?? activeQuestion.max_length ?? 500;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const textValue = value !== undefined ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    if (value === undefined) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`.trim()}>
      {/* ── Question Header & Character Counter ───────────── */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <label
          htmlFor={activeQuestion.id}
          className="text-[15px] font-bold text-[#0E172A] leading-snug"
        >
          <span>{activeQuestion.label}</span>
          {activeQuestion.required !== false && (
            <span className="text-red-500 ml-1 select-none" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <span
          className="text-xs font-medium text-[#62718A] tabular-nums shrink-0 select-none"
          aria-live="polite"
        >
          {textValue.length}/{maxLen}
        </span>
      </div>

      {/* ── Input Card (No Placeholder) ────────────────── */}
      <div className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 transition-all duration-200 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100">
        {activeQuestion.field_type === "text" ? (
          <input
            type="text"
            id={activeQuestion.id}
            value={textValue}
            onChange={(e) => {
              const nextVal = e.target.value;
              if (value === undefined) {
                setInternalValue(nextVal);
              }
              onChange?.(nextVal);
            }}
            maxLength={maxLen}
            disabled={disabled}
            className="w-full bg-transparent border-none outline-none text-[15px] text-[#0E172A] leading-normal p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        ) : (
          <textarea
            id={activeQuestion.id}
            value={textValue}
            onChange={handleChange}
            maxLength={maxLen}
            disabled={disabled}
            rows={4}
            className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-[#0E172A] leading-relaxed p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
}

export default ChurchQuestionIntake;
