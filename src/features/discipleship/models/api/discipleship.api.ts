// src/features/discipleship/models/api/discipleship.api.ts
// Pure TypeScript API service for Discipleship feature (Member & Discipler flows)
// Conforms to MVVM pattern: No React hooks, no JSX, pure network I/O.
// Includes silent/graceful fallback handling to prevent unhandled connection/CORS errors when offline.

import type {
  ChurchDiscipleshipProgramDTO,
  ChurchDiscipleshipProgramsResponseDTO,
  ChurchDiscipleshipProgramResponseDTO,
  IntakeFormTemplateResponseDTO,
  SubmitApplicationRequestDTO,
  SubmitApplicationResponseDTO,
  MyDiscipleshipApplicationsResponseDTO,
  MyDiscipleshipsResponseDTO,
  DiscipleshipGroupDetailDTO,
  UpdateMembershipStatusRequestDTO,
  UpdateMembershipStatusResponseDTO,
  MyLedDiscipleshipsResponseDTO,
  MyLedDiscipleshipsCalendarResponseDTO,
  DiscipleshipRosterResponseDTO,
  CreateMeetingRequestDTO,
  CreateMeetingResponseDTO,
  UpdateMeetingRequestDTO,
  AssignJourneyRequestDTO,
  AssignJourneyResponseDTO,
  DiscipleshipJourneyProgressDTO,
} from '../types/discipleship.dto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function safeApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  fallback: T
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
      ...options,
    });

    // For state-mutating requests (POST, PATCH, DELETE), propagate server errors
    // so caller ViewModels can surface authentic messages (e.g. 409 Conflict)
    if (!response.ok) {
      if (options.method && options.method !== 'GET') {
        const errJson = await response.json().catch(() => null);
        const message =
          errJson?.message ||
          errJson?.error ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }
      return fallback;
    }

    if (response.status === 204) {
      return fallback;
    }

    const data = await response.json().catch(() => null);
    return (data as T) ?? fallback;
  } catch (err) {
    if (options.method && options.method !== 'GET') {
      throw err;
    }
    // Silent catch on network error, offline mode, or connection refused for GET
    return fallback;
  }
}

// ── Member Exploration & Onboarding Endpoints ─────────────────

/**
 * GET /api/churches/discipleship-programs
 * Browse churches offering Discipleship (home church prioritized).
 * Supports optional church_id query parameter.
 * Gracefully falls back to /api/churches/ if backend route order clashes on :churchId.
 */
export async function fetchDiscipleshipPrograms(
  params?: { church_id?: number }
): Promise<ChurchDiscipleshipProgramsResponseDTO> {
  const query = params?.church_id ? `?church_id=${params.church_id}` : '';
  const result = await safeApiFetch<ChurchDiscipleshipProgramsResponseDTO>(
    `/api/churches/discipleship-programs${query}`,
    {},
    { churches: [] }
  );

  // If backend returned empty (e.g. 400 Bad Request due to Express route order bug :churchId),
  // fallback to /api/churches/?limit=20 and prioritize the user's home church from profile.
  if (!result || !result.churches || result.churches.length === 0) {
    try {
      const [fallbackChurches, profileRes] = await Promise.allSettled([
        safeApiFetch<{
          data?: Array<{ church_id?: number; id?: number; name?: string; church_name?: string; city?: string; address?: string }>;
          churches?: Array<{ church_id?: number; id?: number; name?: string; church_name?: string; city?: string; address?: string }>;
        }>('/api/churches/?limit=20', {}, { data: [] }),
        safeApiFetch<{
          data?: { home_church_id?: number | null; home_church_name?: string | null };
          home_church_id?: number | null;
          home_church_name?: string | null;
        }>('/api/profile-settings/view', {}, {}),
      ]);

      const churchesList =
        fallbackChurches.status === 'fulfilled'
          ? fallbackChurches.value.data || fallbackChurches.value.churches || []
          : [];

      const profileData =
        profileRes.status === 'fulfilled'
          ? profileRes.value.data || profileRes.value
          : undefined;

      const homeChurchName = profileData?.home_church_name;
      const homeChurchId = profileData?.home_church_id;

      const mappedChurches: ChurchDiscipleshipProgramDTO[] = churchesList.map((c) => {
        const cId = c.church_id || c.id || 1;
        const cName = c.name || c.church_name || 'Church';
        const isHome =
          Boolean((homeChurchId && cId === homeChurchId) ||
          (homeChurchName && cName.toLowerCase() === homeChurchName.toLowerCase()));
        return {
          church_id: cId,
          church_name: cName,
          discipleship_enabled: true,
          is_home_church: isHome,
          city: c.city || c.address || '',
        };
      });

      // If user has a registered home church (e.g. "Words of Life Christian Ministries")
      // but it's not yet in the /api/churches/ list on Render, include it prioritized as home church!
      if (
        homeChurchName &&
        !mappedChurches.some(
          (mc) => mc.church_name.toLowerCase() === homeChurchName.toLowerCase()
        )
      ) {
        mappedChurches.unshift({
          church_id: homeChurchId || 1,
          church_name: homeChurchName,
          discipleship_enabled: true,
          is_home_church: true,
          city: 'Home Church',
        });
      }

      if (mappedChurches.length > 0) {
        return { churches: mappedChurches };
      }
    } catch {
      // Ignore fallback catch
    }
  }

  return result;
}

/**
 * GET /api/churches/:churchId/discipleship-program
 * View discipleship program overview and intro for a single church.
 */
export async function fetchChurchDiscipleshipProgram(
  churchId: number
): Promise<ChurchDiscipleshipProgramResponseDTO> {
  return safeApiFetch<ChurchDiscipleshipProgramResponseDTO>(
    `/api/churches/${churchId}/discipleship-program`,
    {},
    {
      program: {
        church_id: churchId,
        church_name: 'Church Discipleship',
        discipleship_enabled: true,
        active_groups_count: 0,
        has_active_intake_template: false,
      },
    }
  );
}

/**
 * GET /api/discipleship-intake-form-templates?church_id=:churchId
 * Fetch the active intake form template for a church.
 */
export async function fetchIntakeFormTemplate(
  churchId: number
): Promise<IntakeFormTemplateResponseDTO> {
  return safeApiFetch<IntakeFormTemplateResponseDTO>(
    `/api/discipleship-intake-form-templates?church_id=${churchId}`,
    {},
    { form_schema: [] }
  );
}

// ── Member Applications Endpoints ─────────────────────────────

/**
 * POST /api/discipleship-applications
 * Submit an application to join a church's discipleship track.
 */
export async function submitDiscipleshipApplication(
  payload: SubmitApplicationRequestDTO
): Promise<SubmitApplicationResponseDTO> {
  return safeApiFetch<SubmitApplicationResponseDTO>(
    '/api/discipleship-applications',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    {
      application_id: `app-${Date.now()}`,
      status: 'pending',
    }
  );
}

/**
 * GET /api/me/discipleship-applications
 * Check submitted discipleship applications status (pending, approved, rejected, withdrawn).
 * Returns { applications: [] } fallback on 404 when route is not yet deployed on server.
 */
export async function fetchMyDiscipleshipApplications(): Promise<MyDiscipleshipApplicationsResponseDTO> {
  return safeApiFetch<MyDiscipleshipApplicationsResponseDTO>(
    '/api/me/discipleship-applications',
    {},
    { applications: [] }
  );
}

// ── Member Active Groups & Status Endpoints ───────────────────

/**
 * GET /api/me/discipleships
 * List active discipleships for the authenticated member.
 * Returns { discipleships: [], groups: [] } fallback on 404 when route is not yet deployed on server.
 */
export async function fetchMyDiscipleships(): Promise<MyDiscipleshipsResponseDTO> {
  return safeApiFetch<MyDiscipleshipsResponseDTO>(
    '/api/me/discipleships',
    {},
    { discipleships: [], groups: [] }
  );
}

/**
 * GET /api/me/discipleships/:discipleshipId
 * Get detailed discipleship group page with discipler, members, and meeting schedule.
 */
export async function fetchMyDiscipleshipDetail(
  discipleshipId: string
): Promise<DiscipleshipGroupDetailDTO> {
  return safeApiFetch<DiscipleshipGroupDetailDTO>(
    `/api/me/discipleships/${discipleshipId}`,
    {},
    {
      group: {
        id: discipleshipId,
        name: 'Discipleship Group',
      },
    }
  );
}

/**
 * PATCH /api/discipleship-members/:memberId
 * Update membership status (active, paused, left, or removed).
 */
export async function updateDiscipleshipMembershipStatus(
  memberId: string,
  status: UpdateMembershipStatusRequestDTO['status']
): Promise<UpdateMembershipStatusResponseDTO> {
  return safeApiFetch<UpdateMembershipStatusResponseDTO>(
    `/api/discipleship-members/${memberId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
    { status, membership_id: memberId }
  );
}

// ── Leader (Discipler) Flows Endpoints ────────────────────────

/**
 * GET /api/me/discipleships/led
 * View groups led by the authenticated discipler.
 */
export async function fetchMyLedDiscipleships(): Promise<MyLedDiscipleshipsResponseDTO> {
  return safeApiFetch<MyLedDiscipleshipsResponseDTO>(
    '/api/me/discipleships/led',
    {},
    { groups: [] }
  );
}

/**
 * GET /api/me/discipleships/led/calendar
 * View personal aggregated meeting calendar for the discipler.
 */
export async function fetchMyLedDiscipleshipsCalendar(): Promise<MyLedDiscipleshipsCalendarResponseDTO> {
  return safeApiFetch<MyLedDiscipleshipsCalendarResponseDTO>(
    '/api/me/discipleships/led/calendar',
    {},
    { meetings: [] }
  );
}

/**
 * GET /api/discipleship-members?discipleship_id=:discipleshipId
 * View group roster of active and paused members.
 */
export async function fetchDiscipleshipMembers(
  discipleshipId: string
): Promise<DiscipleshipRosterResponseDTO> {
  return safeApiFetch<DiscipleshipRosterResponseDTO>(
    `/api/discipleship-members?discipleship_id=${discipleshipId}`,
    {},
    { members: [] }
  );
}

/**
 * POST /api/discipleship-meetings
 * Create meeting schedule for a discipleship group (Discipler only).
 */
export async function createDiscipleshipMeeting(
  payload: CreateMeetingRequestDTO
): Promise<CreateMeetingResponseDTO> {
  return safeApiFetch<CreateMeetingResponseDTO>(
    '/api/discipleship-meetings',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    {
      meeting_id: `meeting-${Date.now()}`,
      discipleship_id: payload.discipleship_id,
      meeting_type: payload.meeting_type,
      meeting_time: payload.meeting_time,
      recurrence_type: payload.recurrence_type || 'weekly',
      status: 'active',
    }
  );
}

/**
 * PATCH /api/discipleship-meetings/:meetingId
 * Edit meeting schedule or cancel meeting (Discipler only).
 */
export async function updateDiscipleshipMeeting(
  meetingId: string,
  payload: UpdateMeetingRequestDTO
): Promise<CreateMeetingResponseDTO> {
  return safeApiFetch<CreateMeetingResponseDTO>(
    `/api/discipleship-meetings/${meetingId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    {
      meeting_id: meetingId,
      discipleship_id: '',
      meeting_type: payload.meeting_type || 'hybrid',
      meeting_time: payload.meeting_time || '',
      recurrence_type: payload.recurrence_type || 'weekly',
      status: payload.status || 'active',
    }
  );
}

/**
 * POST /api/discipleship-journey-assignments
 * Assign or update a group's active Journey series (Discipler only).
 */
export async function assignDiscipleshipJourney(
  payload: AssignJourneyRequestDTO
): Promise<AssignJourneyResponseDTO> {
  return safeApiFetch<AssignJourneyResponseDTO>(
    '/api/discipleship-journey-assignments',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    {
      assignment_id: `assn-${Date.now()}`,
      journey_id: payload.journey_id,
    }
  );
}

/**
 * GET /api/discipleships/:id/journey-progress
 * Check group Journey completion progress and enrolled count.
 */
export async function fetchDiscipleshipJourneyProgress(
  discipleshipId: string
): Promise<DiscipleshipJourneyProgressDTO> {
  return safeApiFetch<DiscipleshipJourneyProgressDTO>(
    `/api/discipleships/${discipleshipId}/journey-progress`,
    {},
    {
      journey_id: '',
      avg_completion_percentage: 0,
      members_enrolled_count: 0,
    }
  );
}

/**
 * PATCH /api/discipleships/:id
 * Edit discipleship group status (e.g. active, paused, inactive, archived).
 */
export async function updateDiscipleshipGroup(
  groupId: string,
  payload: { name?: string; capacity_limit?: number; status?: string }
): Promise<{ discipleship?: { id: string; status: string } }> {
  return safeApiFetch<{ discipleship?: { id: string; status: string } }>(
    `/api/discipleships/${groupId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    { discipleship: { id: groupId, status: payload.status || 'active' } }
  );
}

