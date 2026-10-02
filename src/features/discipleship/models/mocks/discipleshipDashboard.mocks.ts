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

export interface DiscipleshipGroupMock {
  id: string;
  church_id: number;
  church_name: string;
  name: string;
  leader_id: string;
  leader_name: string;
  image_url?: string | null;
  status: DiscipleshipGroupStatus;
  role: DiscipleshipMemberRole;
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
      image_url: null,
      status: 'active',
      role: 'member',
    },
    {
      id: 'grp-102-002',
      church_id: 102,
      church_name: 'Riverside Fellowship',
      name: 'Overcomers Group',
      leader_id: 'usr-leader-02',
      leader_name: 'Ana Villar',
      image_url: null,
      status: 'paused',
      role: 'member',
    },
  ],
};

// ── Active Mock for Testing ──────────────────────────────────────────────────
// Kasalukuyang naka-point sa empty state para ma-test.
// Palitan lang ng `mockPopulatedDiscipleshipDashboard` para ibalik ang may laman.
export const mockDiscipleshipDashboard: DiscipleshipDashboardMock = mockEmptyDiscipleshipDashboard;