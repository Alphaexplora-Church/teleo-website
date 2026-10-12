import { useState, useMemo, useCallback } from "react";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";
import {
  mockDiscipleshipChurches,
  type DiscipleshipChurchMock,
} from "../models/mocks/discipleshipChurches.mocks";
import {
  getIntakeQuestionsByChurchId,
  type DiscipleshipIntakeQuestion,
} from "../models/mocks/discipleshipIntakeQuestion.mocks";

export interface UseDiscipleshipChurchApplyOptions {
  churchId?: number;
  church?: DiscipleshipChurch | DiscipleshipChurchMock;
  questions?: DiscipleshipIntakeQuestion[];
  onSubmit?: (answers: Record<string, string>) => void;
}

export function useDiscipleshipChurchApply({
  churchId,
  church,
  questions: userQuestions,
  onSubmit,
}: UseDiscipleshipChurchApplyOptions = {}) {
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

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const isFormValid = useMemo(() => {
    if (questions.length === 0) return false;
    return questions.every((q) => {
      if (q.required === false) return true;
      const answer = (answers[q.id] || "").trim();
      return answer.length > 0;
    });
  }, [questions, answers]);

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    onSubmit?.(answers);
  }, [isFormValid, onSubmit, answers]);

  return {
    resolvedChurch,
    questions,
    answers,
    isFormValid,
    handleAnswerChange,
    handleSubmit,
  };
}
