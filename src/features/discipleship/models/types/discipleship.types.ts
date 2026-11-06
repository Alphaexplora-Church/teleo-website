// src/features/discipleship/models/types/discipleship.types.ts
// Consolidated domain types for the Discipleship feature.
// Replaces fragmented type files with a single, cohesive domain model.

/* ─── Member Dashboard & Groups ────────────────────────────────────── */

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

export type DiscipleshipGroupItem = DiscipleshipGroup;
export type DiscipleshipApplicationMock = DiscipleshipApplication;
export type DiscipleshipGroupMock = DiscipleshipGroup;
export type DiscipleshipGroupGatheringMock = DiscipleshipGroupGathering;
export type DiscipleshipGroupStudyMock = DiscipleshipGroupStudy;

export type ProgramMeetingFormat =
  | 'Hybrid (In-Person & Online)'
  | 'In-Person Only'
  | 'Virtual / Online Only';

export interface DiscipleshipProgramDetail {
  church_id: number;
  church_name: string;
  city?: string;
  is_home_church?: boolean;
  active_groups_count: number;
  format?: ProgramMeetingFormat;
  description?: string;
  review_timing_days?: string;
}

export type ChurchDiscipleshipProgramIntro = DiscipleshipProgramDetail;

export interface DiscipleshipDashboardData {
  applications: DiscipleshipApplication[];
  groups: DiscipleshipGroup[];
}

/* ─── Churches & Process ───────────────────────────────────────────── */

export interface DiscipleshipChurch {
  church_id: number;
  name: string;
  is_home_church: boolean;
  active_groups_count: number;
  city?: string;
}

export interface DiscipleshipChurchItem extends DiscipleshipChurch {
  city?: string;
}

export type IntakeQuestionFieldType = 'textarea' | 'text';

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



/* ─── Leader (Discipler) Domain Types ──────────────────────────────── */

export type LeadGroupStatus = 'Active' | 'Paused';
export type MemberStatus = 'Active' | 'Paused';

export interface GroupMemberItem {
  id: string;
  name: string;
  initials?: string;
  avatar_url?: string;
  joined_date: string;
  note?: string;
  status: MemberStatus;
}

export interface NextGatheringData {
  timing?: string;
  subtitle?: string;
  location?: string;
  virtual_link?: string;
  gathering_type?: string;
}

export interface CurrentStudyData {
  module_badge?: string;
  title?: string;
}

export interface JourneyStudyModule {
  id: string;
  module_badge: string;
  module_number?: number;
  title: string;
  description: string;
  sessions?: string;
  image_url?: string;
}

export interface LeadGroupItem {
  id: string;
  name: string;
  church_name?: string;
  leader_name?: string;
  members_count: number;
  max_members?: number;
  role?: string;
  next_gathering_preview: string;
  status: LeadGroupStatus;
  next_gathering?: NextGatheringData | null;
  current_study?: CurrentStudyData;
  members: GroupMemberItem[];
}

export interface ChurchLeadGroupData {
  church_id: number;
  church_name: string;
  groups_count: number;
  groups: LeadGroupItem[];
}

export type ChurchLeadGroupSection = ChurchLeadGroupData;

/* ─── Meeting Schedules ────────────────────────────────────────────── */

export type MeetingFormat = 'physical' | 'virtual' | 'hybrid';

export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type RecurrenceType = 'Weekly' | 'Bi-weekly' | 'Monthly';

export interface GatheringScheduleFormData {
  format: MeetingFormat;
  dayOfWeek: string;
  recurrence: string;
  startTime: string;
  location?: string;
  virtualLink?: string;
}
