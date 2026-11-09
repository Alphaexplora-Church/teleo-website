// src/features/discipleship/models/utils/discipleship.mappers.ts
// Pure mapper functions transforming raw Backend DTOs into existing UI models.
// Ensures 100% backward-compatibility with existing views and component props.

import type {
  ChurchDiscipleshipProgramDTO,
  DiscipleshipApplicationDTO,
  MemberDiscipleshipItemDTO,
  DiscipleshipGroupDetailDTO,
  DiscipleshipMeetingDTO,
  LedDiscipleshipGroupDTO,
  IntakeFormFieldDTO,
  DiscipleshipMemberDTO,
  CreateMeetingRequestDTO,
} from '../types/discipleship.dto';
import type { GatheringScheduleFormData } from '../types/myDiscipleshipGroupsLeadCardView.types';

import type { DiscipleshipChurch } from '../types/myDiscipleshipEmptyStateView.types';
import type {
  DiscipleshipApplicationMock,
  DiscipleshipGroupMock,
  DiscipleshipGroupGatheringMock,
  DiscipleshipGroupStudyMock,
  DiscipleshipApplicationStatus,
} from '../types/discipleshipDashboard.types';
import type {
  ChurchLeadGroupData,
  LeadGroupItem,
  GroupMemberItem,
} from '../types/discipleshipLead.types';
import type { DiscipleshipIntakeQuestion } from '../types/discipleshipIntakeQuestion.types';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Format 24-hr time string (e.g. "19:00" or "19:00:00") into friendly 12-hr format (e.g. "7:00 PM").
 */
export function formatTime12Hr(timeStr?: string | null): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  if (isNaN(hour)) return timeStr;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

/**
 * Formats meeting schedule into human-readable timing string.
 */
export function formatMeetingTiming(meeting?: DiscipleshipMeetingDTO | null): string {
  if (!meeting) return '';
  const dayName =
    typeof meeting.day_of_week === 'number' && meeting.day_of_week >= 0 && meeting.day_of_week <= 6
      ? DAYS_OF_WEEK[meeting.day_of_week]
      : '';
  const timeFormatted = formatTime12Hr(meeting.meeting_time);

  if (dayName && timeFormatted) {
    const recurrencePrefix =
      meeting.recurrence_type === 'biweekly'
        ? 'Every other '
        : meeting.recurrence_type === 'monthly'
        ? 'Monthly on '
        : 'Every ';
    return `${recurrencePrefix}${dayName} at ${timeFormatted}`;
  }

  if (timeFormatted) return `At ${timeFormatted}`;
  return 'Schedule TBA';
}

/**
 * Maps a single ChurchDiscipleshipProgramDTO to UI DiscipleshipChurch model.
 */
export function mapChurchProgramDTOToDiscipleshipChurch(
  dto: ChurchDiscipleshipProgramDTO
): DiscipleshipChurch {
  return {
    church_id: dto.church_id,
    name: dto.church_name,
    is_home_church: Boolean(dto.is_home_church),
    active_groups_count: dto.active_groups_count ?? 0,
    city: dto.city || undefined,
  };
}

/**
 * Maps list of ChurchDiscipleshipProgramDTO to UI DiscipleshipChurch[].
 */
export function mapChurchProgramsDTOToDiscipleshipChurches(
  dtos: ChurchDiscipleshipProgramDTO[]
): DiscipleshipChurch[] {
  return dtos.map(mapChurchProgramDTOToDiscipleshipChurch);
}

/**
 * Maps a DiscipleshipApplicationDTO to UI DiscipleshipApplicationMock.
 */
export function mapApplicationDTOToMock(
  dto: DiscipleshipApplicationDTO
): DiscipleshipApplicationMock {
  let mappedStatus: DiscipleshipApplicationStatus = 'pending';
  if (dto.status === 'approved') mappedStatus = 'approved';
  else if (dto.status === 'rejected') mappedStatus = 'declined';
  else if (dto.status === 'withdrawn') mappedStatus = 'withdrawn';

  return {
    id: dto.id,
    church_id: dto.church_id,
    church_name: dto.church_name || 'Church Discipleship',
    image_url: null,
    user_id: '',
    status: mappedStatus,
    form_response: dto.form_response || {},
    created_at: dto.created_at || new Date().toISOString(),
    review_timing_days: 'Typically reviewed within 2-3 business days',
  };
}

/**
 * Maps list of DiscipleshipApplicationDTO to UI DiscipleshipApplicationMock[].
 */
export function mapApplicationsDTOToMocks(
  dtos: DiscipleshipApplicationDTO[]
): DiscipleshipApplicationMock[] {
  return dtos.map(mapApplicationDTOToMock);
}

/**
 * Maps a member's list item from GET /api/me/discipleships into DiscipleshipGroupMock.
 */
export function mapMemberDiscipleshipItemToGroupMock(
  item: MemberDiscipleshipItemDTO
): DiscipleshipGroupMock {
  const isPaused = item.status === 'paused';
  const isLeft = item.status === 'left';
  const role = item.role === 'leader' || item.role === 'co_leader' ? 'leader' : 'member';

  return {
    id: item.discipleship?.id || item.discipleship_id,
    church_id: item.discipleship?.church_id ?? 1,
    church_name: item.discipleship?.church_name || 'My Church',
    name: item.discipleship?.name || 'Discipleship Group',
    leader_id: '',
    leader_name: 'Discipler',
    members_count: item.discipleship?.active_member_count ?? 1,
    image_url: item.discipleship?.image_url ?? null,
    status: isLeft ? 'archived' : isPaused ? 'paused' : 'active',
    role,
    membership_id: item.membership_id,
  };
}

/**
 * Maps full group detail response (GET /api/me/discipleships/:id) to DiscipleshipGroupMock.
 */
export function mapGroupDetailDTOToGroupMock(
  detail: DiscipleshipGroupDetailDTO,
  fallbackMembershipId?: string
): DiscipleshipGroupMock {
  const nextMeeting = detail.next_meeting;
  let nextGathering: DiscipleshipGroupGatheringMock | undefined = undefined;

  if (nextMeeting) {
    const gatheringTypeUpper = (nextMeeting.meeting_type || 'HYBRID').toUpperCase();
    const recurrence = nextMeeting.recurrence_type || 'weekly';
    const subtitle = `${recurrence.charAt(0).toUpperCase() + recurrence.slice(1)} fellowship & study`;

    nextGathering = {
      id: nextMeeting.id,
      meeting_id: nextMeeting.id,
      timing: formatMeetingTiming(nextMeeting),
      subtitle,
      location: nextMeeting.location_address || 'Church Campus',
      virtual_link: nextMeeting.meeting_link || '',
      gathering_type: gatheringTypeUpper,
    };
  }

  let currentStudy: DiscipleshipGroupStudyMock | undefined = undefined;
  if (detail.current_journey?.journey) {
    currentStudy = {
      module_badge: detail.current_journey.journey.module_badge || 'Active Study',
      title: detail.current_journey.journey.title || 'Discipleship Foundations',
      lesson_subtitle: detail.current_journey.journey.lesson_subtitle || 'Current Chapter',
    };
  }

  const disciplerName = detail.discipler
    ? `${detail.discipler.first_name} ${detail.discipler.last_name}`.trim()
    : 'Discipler';

  const myStatus = detail.my_membership?.status;
  const isPaused = myStatus === 'paused';
  const isArchived = myStatus === 'left';

  const membershipId =
    detail.membership_id || detail.my_membership?.id || fallbackMembershipId;

  return {
    id: detail.group.id,
    church_id: detail.group.church_id ?? 1,
    church_name: detail.group.church_name || 'Grace Community Church',
    name: detail.group.name,
    leader_id: detail.discipler?.uid || detail.discipler?.user_id || '',
    leader_name: disciplerName,
    members_count: detail.members?.length ?? 1,
    image_url: null,
    status: isArchived ? 'archived' : isPaused ? 'paused' : 'active',
    role: detail.my_membership?.role === 'leader' ? 'leader' : 'member',
    next_gathering: nextGathering,
    this_week_question: detail.discussion_question || undefined,
    current_study: currentStudy,
    membership_id: membershipId,
  };
}

/**
 * Maps roster member DTO to GroupMemberItem.
 */
export function mapMemberDTOToGroupMemberItem(member: DiscipleshipMemberDTO): GroupMemberItem {
  const firstName = member.user?.first_name || '';
  const lastName = member.user?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Church Member';

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'CM';

  return {
    id: member.membership_id || member.user_id,
    name: fullName,
    initials,
    avatar_url: member.user?.avatar_url || undefined,
    joined_date: member.joined_at ? `Joined ${new Date(member.joined_at).toLocaleDateString()}` : 'Joined recently',
    status: member.status === 'paused' ? 'Paused' : 'Active',
    note: member.role === 'leader' ? 'Leader' : undefined,
  };
}

/**
 * Maps led discipleship DTOs from GET /api/me/discipleships/led to ChurchLeadGroupData[].
 */
export function mapLedDiscipleshipDTOsToLeadChurchGroups(
  groups: LedDiscipleshipGroupDTO[]
): ChurchLeadGroupData[] {
  const churchMap = new Map<number, { church_name: string; groups: LeadGroupItem[] }>();

  for (const g of groups) {
    const churchId = g.church_id ?? 101;
    const churchName = g.church_name || 'Local Church';

    if (!churchMap.has(churchId)) {
      churchMap.set(churchId, { church_name: churchName, groups: [] });
    }

    const meetingPreview = formatMeetingTiming(g.next_meeting);
    const leadGroupItem: LeadGroupItem = {
      id: g.id || g.discipleship_id || '',
      name: g.name,
      church_name: churchName,
      leader_name: 'You (Discipler)',
      members_count: g.active_member_count ?? g.members_count ?? 0,
      max_members: g.capacity_limit ?? 10,
      role: 'Discipler (Lead)',
      next_gathering_preview: meetingPreview || 'Schedule TBA',
      status: g.status === 'paused' ? 'Paused' : 'Active',
      next_gathering: g.next_meeting
        ? {
            id: g.next_meeting.id,
            meeting_id: g.next_meeting.id,
            timing: meetingPreview,
            subtitle: `${g.next_meeting.recurrence_type || 'Weekly'} fellowship`,
            location: g.next_meeting.location_address || '',
            virtual_link: g.next_meeting.meeting_link || '',
            gathering_type: (g.next_meeting.meeting_type || 'HYBRID').toUpperCase(),
          }
        : null,
      current_study: g.current_journey?.journey
        ? {
            module_badge: g.current_journey.journey.module_badge || 'Module',
            title: g.current_journey.journey.title,
          }
        : undefined,
      members: (g.members || []).map(mapMemberDTOToGroupMemberItem),
    };

    churchMap.get(churchId)!.groups.push(leadGroupItem);
  }

  const result: ChurchLeadGroupData[] = [];
  churchMap.forEach((val, churchId) => {
    result.push({
      church_id: churchId,
      church_name: val.church_name,
      groups_count: val.groups.length,
      groups: val.groups,
    });
  });

  return result;
}

/**
 * Maps IntakeFormFieldDTO from backend schema to UI DiscipleshipIntakeQuestion.
 */
export function mapIntakeFormFieldToQuestion(
  field: IntakeFormFieldDTO
): DiscipleshipIntakeQuestion {
  return {
    id: field.id,
    label: field.label,
    placeholder: field.placeholder || 'Write your response here...',
    field_type: field.type === 'text' ? 'text' : 'textarea',
    required: field.required !== false,
    max_length: 500,
  };
}

/**
 * Converts weekday name to 0 (Sun) - 6 (Sat) for POST /api/discipleship-meetings
 */
export function convertDayNameToNumber(dayName?: string): number {
  if (!dayName) return 3; // Wednesday fallback
  const days: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return days[dayName.trim().toLowerCase()] ?? 3;
}

/**
 * Converts 12-hour AM/PM string (e.g. "7:00 PM") to 24-hour "HH:MM:SS" for backend
 */
export function convert12HrTo24Hr(time12Hr?: string): string {
  if (!time12Hr) return '19:00:00';
  const trimmed = time12Hr.trim();
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    const parts = trimmed.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1]}:00`;
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '19:00:00';
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const ampm = (match[3] || '').toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}:00`;
}

/**
 * Calculates next occurrence date YYYY-MM-DD for starting a recurring schedule
 */
export function getNextOccurrenceDate(dayOfWeekNum: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  let diff = (dayOfWeekNum - currentDay + 7) % 7;
  if (diff === 0) diff = 7;
  const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  return nextDate.toISOString().split('T')[0];
}

/**
 * Maps GatheringScheduleFormData into CreateMeetingRequestDTO matching backend contract
 */
export function mapScheduleFormDataToCreateMeetingDTO(
  groupId: string,
  data: GatheringScheduleFormData
): CreateMeetingRequestDTO {
  const dayNum = convertDayNameToNumber(data.dayOfWeek);
  const time24 = convert12HrTo24Hr(data.startTime);
  const startDate = getNextOccurrenceDate(dayNum);

  let recurrenceType: 'weekly' | 'biweekly' | 'monthly' | 'one_time' = 'weekly';
  if (/bi-?weekly/i.test(data.recurrence)) recurrenceType = 'biweekly';
  else if (/monthly/i.test(data.recurrence)) recurrenceType = 'monthly';

  return {
    discipleship_id: groupId,
    meeting_type: data.format,
    location_address: data.location || (data.format === 'virtual' ? undefined : 'Church Campus'),
    meeting_link: data.virtualLink || (data.format === 'physical' ? undefined : 'https://teleo.church/meet'),
    recurrence_type: recurrenceType,
    day_of_week: dayNum,
    meeting_time: time24,
    start_date: startDate,
  };
}


