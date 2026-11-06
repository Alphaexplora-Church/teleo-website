// src/features/discipleship/models/types/discipleshipIntakeQuestion.types.ts
// Core domain types for Discipleship intake questions

export type IntakeQuestionFieldType = "textarea" | "text";

export interface DiscipleshipIntakeQuestion {
  id: string;
  label: string;
  placeholder: string;
  field_type: IntakeQuestionFieldType;
  required: boolean;
  min_length?: number;
  max_length: number;
}

export interface ChurchIntakeFormTemplate {
  church_id: number;
  questions: DiscipleshipIntakeQuestion[];
}

