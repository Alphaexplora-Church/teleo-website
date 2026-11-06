// src/features/discipleship/models/types/discipleshipDashboard.types.ts
// Core domain types for Member Discipleship Dashboard

export type DiscipleshipApplicationStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'withdrawn';

export type DiscipleshipGroupStatus = 'active' | 'paused' | 'archived';
export type DiscipleshipMemberRole = 'leader' | 'member';

export interface DiscipleshipApplication {
  id: string;
  church_id: number;
  church_name: string;
  image_url?: string | null;
  user_id: string;
  status: DiscipleshipApplicationStatus;
  form_response: Record<string, string>;
  created_at: string;
  review_timing_days: string;
}

export interface DiscipleshipGroupGathering {
  timing: string;
  subtitle?: string;
  location: string;
  virtual_link: string;
  gathering_type: string;
}

export interface DiscipleshipGroupStudy {
  module_badge?: string;
  title: string;
  lesson_subtitle?: string;
}

export interface DiscipleshipGroup {
  id: string;
  church_id: number;
  church_name: string;
  name: string;
  leader_id: string;
  leader_name: string;
  members_count?: number;
  image_url?: string | null;
  status: DiscipleshipGroupStatus;
  role: DiscipleshipMemberRole;
  membership_id?: string;
  next_gathering?: DiscipleshipGroupGathering;
  this_week_question?: string;
  current_study?: DiscipleshipGroupStudy;
}

export interface DiscipleshipDashboardData {
  applications: DiscipleshipApplication[];
  groups: DiscipleshipGroup[];
}

// Aliases for backward compatibility
export type DiscipleshipApplicationMock = DiscipleshipApplication;
export type DiscipleshipGroupGatheringMock = DiscipleshipGroupGathering;
export type DiscipleshipGroupStudyMock = DiscipleshipGroupStudy;
export type DiscipleshipGroupMock = DiscipleshipGroup;
export type DiscipleshipDashboardMock = DiscipleshipDashboardData;

