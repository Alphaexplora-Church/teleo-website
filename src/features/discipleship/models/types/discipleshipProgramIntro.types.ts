// src/features/discipleship/models/types/discipleshipProgramIntro.types.ts
// Core domain types for Discipleship Program Intro / Overview

export type ProgramMeetingFormat =
  | 'Hybrid (In-Person & Online)'
  | 'In-Person Only'
  | 'Virtual / Online Only';

export interface DiscipleshipProgramDetail {
  church_id: number;
  church_name: string;
  city: string;
  is_home_church: boolean;
  active_groups_count: number;
  format: ProgramMeetingFormat;
  description: string;
  review_timing_days: string;
}

