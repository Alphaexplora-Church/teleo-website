// src/features/discipleship/models/mocks/discipleshipDashboard.mock.ts

import { mockDiscipleshipProgramDetails } from './discipleshipProgramIntro.mocks';
import { mockDiscipleshipChurches } from './discipleshipChurches.mocks';


export type DiscipleshipApplicationStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'withdrawn';

export type DiscipleshipGroupStatus = 'active' | 'paused' | 'archived';
export type DiscipleshipMemberRole = 'leader' | 'member';

export interface DiscipleshipApplicationMock {
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

export interface DiscipleshipGroupGatheringMock {
  timing: string;
  subtitle?: string;
  location: string;
  virtual_link: string;
  gathering_type: string;
}

export interface DiscipleshipGroupStudyMock {
  module_badge?: string;
  title: string;
  lesson_subtitle: string;
}

export interface DiscipleshipGroupMock {
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
  next_gathering?: DiscipleshipGroupGatheringMock;
  this_week_question?: string;
  current_study?: DiscipleshipGroupStudyMock;
}

export interface DiscipleshipDashboardMock {
  applications: DiscipleshipApplicationMock[];
  groups: DiscipleshipGroupMock[];
}


export function createPendingApplicationMock(
  churchId: number,
  formResponse: Record<string, string> = {}
): DiscipleshipApplicationMock {
  const church = mockDiscipleshipChurches.find((c) => c.church_id === churchId);
  const churchDetail = mockDiscipleshipProgramDetails[churchId];

  return {
    id: `app-${churchId}-${Date.now()}`,
    church_id: churchId,
    church_name: church?.name ?? 'Unknown Church',
    image_url: null,
    user_id: 'usr-current-user',
    status: 'pending',
    form_response: formResponse,
    created_at: new Date().toISOString(),
    review_timing_days: churchDetail?.review_timing_days ?? '2–3 days',
  };
}

export const mockEmptyDiscipleshipDashboard: DiscipleshipDashboardMock = {
  applications: [],
  groups: [],
};

export const mockPopulatedDiscipleshipDashboard: DiscipleshipDashboardMock = {
  // GET /discipleship-applications/me
  applications: [
    {
      id: 'app-102-001',
      church_id: 102,
      church_name: 'Riverside Fellowship',
      image_url: null,
      user_id: 'usr-current-user',
      status: 'pending',
      form_response: {
        q1: 'Seeking spiritual guidance and fellowship.',
        q2: 'Biblical discipleship and prayer accountability.',
      },
      created_at: '2026-10-02T08:30:00.000Z',
      review_timing_days: mockDiscipleshipProgramDetails[102]?.review_timing_days ?? '3–5 days',
    },
  ],

  // GET /discipleship/my-groups
  groups: [
    {
      id: 'grp-101-001',
      church_id: 101,
      church_name: 'Grace Community Church',
      name: 'The Fig Tree Group',
      leader_id: 'usr-leader-01',
      leader_name: 'Mark Reyes',
      members_count: 7,
      image_url: null,
      status: 'active',
      role: 'member',
      next_gathering: {
        timing: 'Tomorrow at 7:00 PM',
        subtitle: 'Weekly fellowship & study',
        location: '123 Acacia St. Room 204',
        virtual_link: 'meet.google.com/xyz-abc',
        gathering_type: 'HYBRID',
      },
      this_week_question:
        '“Where have you experienced God’s peace amidst challenges this week?”',
      current_study: {
        module_badge: 'Module 2',
        title: 'Romans 8: Life in the Spirit',
        lesson_subtitle:
          'This Week: Lesson 3 of 6 · The Flesh vs. The Spirit',
      },
    },
    {
      id: 'grp-lead-002',
      church_id: 101,
      church_name: 'Grace Community Church',
      name: 'Berean Fellowship Cohort',
      leader_id: 'usr-current-user',
      leader_name: 'You',
      members_count: 5,
      image_url: null,
      status: 'active',
      role: 'leader',
      next_gathering: undefined,
      this_week_question:
        '“What does it mean for you to examine the Scriptures daily with fellow believers?”',
      current_study: {
        module_badge: 'Module 1',
        title: 'Foundations of Discipleship',
        lesson_subtitle:
          'This Week: Lesson 2 of 5 · Living as Christ’s Disciple',
      },
    },
    {
      id: 'grp-102-002',
      church_id: 102,
      church_name: 'Riverside Fellowship',
      name: 'Overcomers Group',
      leader_id: 'usr-leader-02',
      leader_name: 'Ana Villar',
      members_count: 5,
      image_url: null,
      status: 'paused',
      role: 'member',
      next_gathering: {
        timing: 'Tomorrow at 7:00 PM',
        subtitle: 'Weekly fellowship & study',
        location: '123 Acacia St. Room 204',
        virtual_link: 'meet.google.com/xyz-abc',
        gathering_type: 'Hybrid',
      },
      this_week_question:
        '“Where have you experienced God’s peace amidst challenges this week?”',
      current_study: {
        module_badge: 'Module 2',
        title: 'Romans 8: Life in the Spirit',
        lesson_subtitle:
          'This Week: Lesson 3 of 6 · The Flesh vs. The Spirit',
      },
    },
    {
      id: 'grp-lead-003',
      church_id: 2,
      church_name: 'Metro East City Church',
      name: 'Living Water Fellowship',
      leader_id: 'usr-current-user',
      leader_name: 'You',
      members_count: 6,
      image_url: null,
      status: 'paused',
      role: 'leader',
      next_gathering: undefined,
      this_week_question:
        '“How can we pursue godly wisdom in our daily decisions and relationships?”',
      current_study: {
        module_badge: 'Module 3',
        title: 'Walking in Wisdom',
        lesson_subtitle: 'Lesson 1 of 4 · Proverbs Introduction',
      },
    },
  ],
};

// ── Active Mock for Testing ──────────────────────────────────────────────────
// Kasalukuyang naka-point sa populated state para sa active group testing.
export const mockDiscipleshipDashboard: DiscipleshipDashboardMock = mockPopulatedDiscipleshipDashboard;
export const mockDefaultActiveGroup: DiscipleshipGroupMock = mockPopulatedDiscipleshipDashboard.groups[0];