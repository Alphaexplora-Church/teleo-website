// src/features/discipleship/viewmodels/useDiscipleshipChurchApply.ts
// ViewModel for Discipleship intake questionnaire application.

import { useState, useMemo, useCallback, useEffect } from "react";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";
import type { DiscipleshipIntakeQuestion } from "../models/types/discipleshipIntakeQuestion.types";
import { fetchIntakeFormTemplate, fetchChurchDiscipleshipProgram } from "../models/api/discipleship.api";
import { mapIntakeFormFieldToQuestion } from "../models/utils/discipleship.mappers";

export interface UseDiscipleshipChurchApplyOptions {
  churchId?: number;
  church?: DiscipleshipChurch;
  questions?: DiscipleshipIntakeQuestion[];
  onSubmit?: (answers: Record<string, string>) => void;
}

const DEFAULT_INTAKE_QUESTIONS: DiscipleshipIntakeQuestion[] = [
  {
    id: "q1",
    label: "Where are you in your walk with God?",
    placeholder: "Write your response here...",
    field_type: "textarea",
    required: true,
    max_length: 500,
  },
  {
    id: "q2",
    label: "What are you hoping to find in a discipleship group?",
    placeholder: "Write your response here...",
    field_type: "textarea",
    required: true,
    max_length: 500,
  },
  {
    id: "q3",
    label: "Preferred meeting time / schedule",
    placeholder: "Write your response here...",
    field_type: "textarea",
    required: true,
    max_length: 500,
  },
];

export function useDiscipleshipChurchApply({
  churchId,
  church,
  questions: userQuestions,
  onSubmit,
}: UseDiscipleshipChurchApplyOptions = {}) {
  const targetChurchId = churchId ?? church?.church_id ?? 101;
  const [apiQuestions, setApiQuestions] = useState<DiscipleshipIntakeQuestion[] | null>(null);
  const [fetchedChurch, setFetchedChurch] = useState<DiscipleshipChurch | null>(null);

  // Fetch dynamic template from backend
  useEffect(() => {
    if (userQuestions && userQuestions.length > 0) return;

    fetchIntakeFormTemplate(targetChurchId)
      .then((res) => {
        const schema = res.template?.form_schema || res.form_schema;
        if (Array.isArray(schema) && schema.length > 0) {
          setApiQuestions(schema.map(mapIntakeFormFieldToQuestion));
        } else {
          setApiQuestions(DEFAULT_INTAKE_QUESTIONS);
        }
      })
      .catch(() => {
        setApiQuestions(DEFAULT_INTAKE_QUESTIONS);
      });
  }, [targetChurchId, userQuestions]);

  // Fetch church info if not provided in props
  useEffect(() => {
    if (church) return;

    fetchChurchDiscipleshipProgram(targetChurchId)
      .then((res) => {
        if (res?.program) {
          setFetchedChurch({
            church_id: res.program.church_id,
            name: res.program.church_name,
            is_home_church: false,
            active_groups_count: res.program.active_groups_count ?? 0,
          });
        }
      })
      .catch(() => {
        // Fallback
      });
  }, [church, targetChurchId]);

  const resolvedChurch = useMemo(() => {
    if (church) return church;
    if (fetchedChurch) return fetchedChurch;
    return {
      church_id: targetChurchId,
      name: "Discipleship Church",
      is_home_church: false,
      active_groups_count: 0,
    };
  }, [church, fetchedChurch, targetChurchId]);

  const questions = useMemo(() => {
    if (userQuestions && userQuestions.length > 0) return userQuestions;
    return apiQuestions ?? DEFAULT_INTAKE_QUESTIONS;
  }, [userQuestions, apiQuestions]);

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
