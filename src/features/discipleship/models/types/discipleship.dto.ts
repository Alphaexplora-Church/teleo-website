// src/features/discipleship/models/types/discipleship.dto.ts
// Pure DTO interfaces mirroring the Teleo Backend V3 Discipleship API contract (DISCIPLESHIP_API.md)

export interface ChurchDiscipleshipProgramDTO {
  church_id: number;
  church_name: string;
  discipleship_enabled: boolean;
  is_home_church?: boolean;
  active_groups_count?: number;
  city?: string;
  image_url?: string | null;
}

export interface ChurchDiscipleshipProgramsResponseDTO {
  churches: ChurchDiscipleshipProgramDTO[];
}

export interface ChurchDiscipleshipProgramDetailDTO {
  church_id: number;
  church_name: string;
  discipleship_enabled: boolean;
  active_groups_count: number;
  has_active_intake_template: boolean;
  description?: string;
}

export interface ChurchDiscipleshipProgramResponseDTO {
  program: ChurchDiscipleshipProgramDetailDTO;
}

export interface IntakeFormFieldDTO {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface IntakeFormTemplateDTO {
  id: string;
  church_id: number;
  form_schema: IntakeFormFieldDTO[];
  is_active: boolean;
  created_at?: string;
}

export interface IntakeFormTemplateResponseDTO {
  template?: IntakeFormTemplateDTO;
  // Fallbacks if returned unnested
  id?: string;
  church_id?: number;
  form_schema?: IntakeFormFieldDTO[];
}

export interface SubmitApplicationRequestDTO {
  church_id: number;
  form_response: Record<string, string | number | boolean | string[]>;
}

export interface SubmitApplicationResponseDTO {
  application_id: string;
  id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  is_home_church?: boolean;
  church_id?: number;
  created_at?: string;
}

export interface DiscipleshipApplicationDTO {
  id: string;
  church_id: number;
  church_name?: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  is_home_church?: boolean;
  form_response?: Record<string, string>;
  created_at: string;
  reviewed_at?: string | null;
  admin_notes?: string | null;
  assigned_discipleship_id?: string | null;
}

export interface MyDiscipleshipApplicationsResponseDTO {
  applications: DiscipleshipApplicationDTO[];
}

export interface DiscipleshipMeetingDTO {
  id: string;
  discipleship_id?: string;
  meeting_type: 'physical' | 'virtual' | 'hybrid';
  location_address?: string | null;
  meeting_link?: string | null;
  recurrence_type?: 'weekly' | 'biweekly' | 'monthly' | 'one_time';
  day_of_week?: number | null; // 0 (Sun) to 6 (Sat)
  meeting_time: string; // "HH:MM" or "HH:MM:SS"
  start_date?: string;
  status?: 'active' | 'cancelled';
}

export interface DiscipleshipUserSummaryDTO {
  uid?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string | null;
}

export interface DiscipleshipMemberDTO {
  membership_id: string;
  user_id: string;
  role: 'leader' | 'co_leader' | 'member';
  status: 'active' | 'paused' | 'left' | 'removed';
  joined_at?: string;
  user?: DiscipleshipUserSummaryDTO;
}

export interface DiscipleshipJourneyAssignmentDTO {
  journey_id: string;
  assigned_at?: string;
  journey?: {
    id?: string;
    title: string;
    thumbnail_url?: string | null;
    lesson_subtitle?: string;
    module_badge?: string;
  };
}

export interface MemberDiscipleshipItemDTO {
  membership_id: string;
  discipleship_id: string;
  role: 'leader' | 'co_leader' | 'member';
  status: 'active' | 'paused' | 'left' | 'removed';
  joined_at?: string;
  discipleship?: {
    id: string;
    name: string;
    description?: string;
    church_id: number;
    church_name?: string;
    capacity_limit?: number;
    active_member_count?: number;
    image_url?: string | null;
  };
}

export interface MyDiscipleshipsResponseDTO {
  discipleships?: MemberDiscipleshipItemDTO[];
  groups?: MemberDiscipleshipItemDTO[];
}

export interface DiscipleshipGroupDetailDTO {
  group: {
    id: string;
    name: string;
    description?: string | null;
    church_id?: number;
    church_name?: string;
    capacity_limit?: number;
  };
  discipler?: DiscipleshipUserSummaryDTO;
  members?: DiscipleshipMemberDTO[];
  next_meeting?: DiscipleshipMeetingDTO | null;
  discussion_question?: string | null;
  current_journey?: DiscipleshipJourneyAssignmentDTO | null;
  membership_id?: string;
  my_membership?: {
    id: string;
    status: 'active' | 'paused' | 'left';
    role: 'leader' | 'co_leader' | 'member';
  };
}

export interface UpdateMembershipStatusRequestDTO {
  status: 'active' | 'paused' | 'left' | 'removed';
}

export interface UpdateMembershipStatusResponseDTO {
  status: string;
  membership_id?: string;
}

// ── Leader Flow DTOs ──────────────────────────────────────────

export interface LedDiscipleshipGroupDTO {
  discipleship_id?: string;
  id: string;
  church_id: number;
  church_name?: string;
  name: string;
  description?: string;
  capacity_limit?: number;
  active_member_count?: number;
  members_count?: number;
  status: 'active' | 'inactive' | 'archived' | 'paused';
  next_meeting?: DiscipleshipMeetingDTO | null;
  current_journey?: DiscipleshipJourneyAssignmentDTO | null;
  members?: DiscipleshipMemberDTO[];
}

export interface MyLedDiscipleshipsResponseDTO {
  groups: LedDiscipleshipGroupDTO[];
}

export interface DiscipleshipCalendarMeetingDTO {
  meeting_id: string;
  discipleship_id: string;
  discipleship_name: string;
  meeting_type: 'physical' | 'virtual' | 'hybrid';
  meeting_time: string;
  day_of_week?: number;
  start_date: string;
  location_address?: string;
  meeting_link?: string;
}

export interface MyLedDiscipleshipsCalendarResponseDTO {
  meetings: DiscipleshipCalendarMeetingDTO[];
}

export interface DiscipleshipRosterResponseDTO {
  members: DiscipleshipMemberDTO[];
}

export interface CreateMeetingRequestDTO {
  discipleship_id: string;
  meeting_type: 'physical' | 'virtual' | 'hybrid';
  location_address?: string;
  meeting_link?: string;
  recurrence_type?: 'weekly' | 'biweekly' | 'monthly' | 'one_time';
  day_of_week?: number;
  meeting_time: string;
  start_date: string;
}

export interface CreateMeetingResponseDTO {
  meeting_id: string;
  discipleship_id: string;
  meeting_type: string;
  meeting_time: string;
  recurrence_type: string;
  status: string;
}

export interface UpdateMeetingRequestDTO {
  meeting_type?: 'physical' | 'virtual' | 'hybrid';
  location_address?: string;
  meeting_link?: string;
  recurrence_type?: 'weekly' | 'biweekly' | 'monthly' | 'one_time';
  day_of_week?: number;
  meeting_time?: string;
  start_date?: string;
  status?: 'active' | 'cancelled';
}

export interface AssignJourneyRequestDTO {
  discipleship_id: string;
  journey_id: string;
}

export interface AssignJourneyResponseDTO {
  assignment_id: string;
  journey_id: string;
}

export interface DiscipleshipJourneyProgressDTO {
  journey_id: string;
  avg_completion_percentage: number;
  members_enrolled_count: number;
}

