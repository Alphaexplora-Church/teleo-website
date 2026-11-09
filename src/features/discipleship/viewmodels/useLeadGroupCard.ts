import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  GroupMemberItem,
  NextGatheringData,
  LeadGroupItem,
  CurrentStudyData,
  JourneyStudyModule,
} from "../models/types/discipleshipLead.types";
import {
  fetchDiscipleshipMembers,
  createDiscipleshipMeeting,
  updateDiscipleshipMeeting,
  assignDiscipleshipJourney,
  updateDiscipleshipGroup,
  updateDiscipleshipMembershipStatus,
} from "../models/api/discipleship.api";
import {
  mapMemberDTOToGroupMemberItem,
  mapScheduleFormDataToCreateMeetingDTO,
} from "../models/utils/discipleship.mappers";
import type {
  GatheringScheduleFormData,
  MeetingFormat,
} from "../models/types/myDiscipleshipGroupsLeadCardView.types";

export function parseGatheringToFormData(
  gathering: NextGatheringData
): Partial<GatheringScheduleFormData> {
  const format: MeetingFormat =
    gathering.gathering_type?.toUpperCase() === "IN-PERSON"
      ? "physical"
      : gathering.gathering_type?.toUpperCase() === "VIRTUAL"
      ? "virtual"
      : "hybrid";

  let dayOfWeek = "";
  let startTime = "";
  if (gathering.timing) {
    const dayMatch = gathering.timing.match(
      /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)s?\s+at\s+(.+)$/i
    );
    if (dayMatch) {
      dayOfWeek =
        dayMatch[1].charAt(0).toUpperCase() +
        dayMatch[1].slice(1).toLowerCase();
      startTime = dayMatch[2].trim();
    } else {
      const atMatch = gathering.timing.match(/at\s+(.+)$/i);
      if (atMatch) {
        startTime = atMatch[1].trim();
      }
      dayOfWeek = "Wednesday";
    }
  }

  let recurrence = "Weekly";
  if (gathering.subtitle) {
    if (/bi-?weekly/i.test(gathering.subtitle)) {
      recurrence = "Bi-weekly";
    } else if (/monthly/i.test(gathering.subtitle)) {
      recurrence = "Monthly";
    } else if (/weekly/i.test(gathering.subtitle)) {
      recurrence = "Weekly";
    }
  }

  return {
    format,
    dayOfWeek: dayOfWeek || "Wednesday",
    recurrence,
    startTime: startTime || undefined,
    location: gathering.location,
    virtualLink: gathering.virtual_link,
  };
}

export interface UseLeadGroupCardOptions {
  groupId?: string;
  group?: LeadGroupItem;
  churchName?: string;
  onStatusChange?: (status: "Active" | "Paused") => void;
  onSetSchedule?: () => void;
  onEditSchedule?: () => void;
  onRemoveSchedule?: () => void;
  onScheduleSaved?: (data: GatheringScheduleFormData, newGathering: NextGatheringData) => void;
  onScheduleRemoved?: () => void;
  onMemberAction?: (member: GroupMemberItem) => void;
  onRemoveMember?: (member: GroupMemberItem) => void;
  onStudyUpdated?: (module: JourneyStudyModule) => void;
}

export function useLeadGroupCard({
  groupId,
  group,
  churchName,
  onStatusChange,
  onSetSchedule,
  onEditSchedule,
  onRemoveSchedule,
  onScheduleSaved,
  onScheduleRemoved,
  onMemberAction,
  onRemoveMember,
  onStudyUpdated,
}: UseLeadGroupCardOptions = {}) {
  const fallbackEmptyGroup: LeadGroupItem = useMemo(() => ({
    id: groupId || "",
    name: "Discipleship Group",
    members_count: 0,
    next_gathering_preview: "No upcoming gathering scheduled",
    status: "Active" as const,
    members: [],
  }), [groupId]);

  const [liveMembers, setLiveMembers] = useState<GroupMemberItem[] | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchDiscipleshipMembers(groupId)
        .then((res) => {
          if (res && Array.isArray(res.members)) {
            setLiveMembers(res.members.map(mapMemberDTOToGroupMemberItem));
          }
        })
        .catch(() => {
          // Graceful fallback
        });
    }
  }, [groupId]);

  const rawActiveGroup = group ?? fallbackEmptyGroup;

  const activeGroup: LeadGroupItem = useMemo(() => {
    if (liveMembers) {
      return {
        ...rawActiveGroup,
        members: liveMembers,
        members_count: liveMembers.length,
      };
    }
    return rawActiveGroup;
  }, [rawActiveGroup, liveMembers]);

  const resolvedChurchName =
    churchName ??
    activeGroup?.church_name ??
    "";

  // Current Study modal state & dynamic study module
  const [isChangeStudyModalOpen, setIsChangeStudyModalOpen] = useState(false);
  const [activeStudy, setActiveStudy] = useState<CurrentStudyData | undefined>(
    activeGroup?.current_study
  );

  useEffect(() => {
    setActiveStudy(activeGroup?.current_study);
  }, [activeGroup?.id, activeGroup?.current_study]);

  // Group status state (Active vs Paused) & change status modal
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [groupStatus, setGroupStatus] = useState<"Active" | "Paused">(
    activeGroup?.status === "Paused" ? "Paused" : "Active"
  );

  useEffect(() => {
    setGroupStatus(activeGroup?.status === "Paused" ? "Paused" : "Active");
  }, [activeGroup?.id, activeGroup?.status]);

  // Schedule modal state & dynamic scheduled gathering state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalMode, setScheduleModalMode] = useState<"create" | "edit">("create");
  const [scheduledGathering, setScheduledGathering] = useState<NextGatheringData | null>(
    activeGroup?.next_gathering ?? null
  );

  useEffect(() => {
    setScheduledGathering(activeGroup?.next_gathering ?? null);
  }, [activeGroup?.id, activeGroup?.next_gathering]);

  // Member action sheet state
  const [selectedMember, setSelectedMember] = useState<GroupMemberItem | null>(null);
  const [isMemberActionSheetOpen, setIsMemberActionSheetOpen] = useState(false);

  const isActive = groupStatus === "Active";
  const membersCount =
    activeGroup?.members_count ?? activeGroup?.members?.length ?? 0;
  const activeGathering = scheduledGathering;
  const hasSchedule = Boolean(activeGathering && activeGathering.timing);

  const initialScheduleFormData = useMemo(() => {
    return scheduleModalMode === "edit" && activeGathering
      ? parseGatheringToFormData(activeGathering)
      : undefined;
  }, [scheduleModalMode, activeGathering]);

  const handleUpdateStatus = useCallback(
    async (statusId: string) => {
      const newStatus: "Active" | "Paused" =
        statusId === "paused" ? "Paused" : "Active";
      setGroupStatus(newStatus);
      setIsChangeStatusModalOpen(false);
      onStatusChange?.(newStatus);

      if (groupId) {
        try {
          await updateDiscipleshipGroup(groupId, {
            status: newStatus.toLowerCase(),
          });
        } catch (err) {
          console.error("Failed to update discipleship group status:", err);
        }
      }
    },
    [groupId, onStatusChange]
  );

  const handleOpenSetSchedule = useCallback(() => {
    setScheduleModalMode("create");
    setIsScheduleModalOpen(true);
    onSetSchedule?.();
  }, [onSetSchedule]);

  const handleOpenEditSchedule = useCallback(() => {
    setScheduleModalMode("edit");
    setIsScheduleModalOpen(true);
    onEditSchedule?.();
  }, [onEditSchedule]);

  const handleCloseScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(false);
  }, []);

  const handleRemoveSchedule = useCallback(async () => {
    const meetingId = scheduledGathering?.meeting_id || scheduledGathering?.id;
    setScheduledGathering(null);
    setIsScheduleModalOpen(false);
    onRemoveSchedule?.();
    onScheduleRemoved?.();

    if (meetingId) {
      try {
        await updateDiscipleshipMeeting(meetingId, { status: "cancelled" });
      } catch (err) {
        console.error("Failed to cancel discipleship meeting:", err);
      }
    }
  }, [scheduledGathering, onRemoveSchedule, onScheduleRemoved]);

  const handleSaveSchedule = useCallback(
    async (data: GatheringScheduleFormData) => {
      const gatheringType =
        data.format === "physical"
          ? "IN-PERSON"
          : data.format === "virtual"
          ? "VIRTUAL"
          : "HYBRID";

      const existingMeetingId = scheduledGathering?.meeting_id || scheduledGathering?.id;

      const newGathering: NextGatheringData = {
        id: existingMeetingId,
        meeting_id: existingMeetingId,
        timing: `${data.dayOfWeek}s at ${data.startTime}`,
        subtitle: `Repeats ${data.recurrence.toLowerCase()} · 90 minutes`,
        location: data.location,
        virtual_link: data.virtualLink,
        gathering_type: gatheringType,
      };

      setScheduledGathering(newGathering);
      setIsScheduleModalOpen(false);
      onScheduleSaved?.(data, newGathering);

      if (groupId) {
        try {
          const payload = mapScheduleFormDataToCreateMeetingDTO(groupId, data);
          if (existingMeetingId) {
            await updateDiscipleshipMeeting(existingMeetingId, {
              meeting_type: payload.meeting_type,
              location_address: payload.location_address,
              meeting_link: payload.meeting_link,
              recurrence_type: payload.recurrence_type,
              day_of_week: payload.day_of_week,
              meeting_time: payload.meeting_time,
              start_date: payload.start_date,
              status: "active",
            });
          } else {
            const res = await createDiscipleshipMeeting(payload);
            if (res?.meeting_id) {
              setScheduledGathering((prev) =>
                prev ? { ...prev, id: res.meeting_id, meeting_id: res.meeting_id } : prev
              );
            }
          }
        } catch (err) {
          console.error("Failed to persist gathering schedule:", err);
        }
      }
    },
    [groupId, scheduledGathering, onScheduleSaved]
  );

  const handleMemberAction = useCallback((member: GroupMemberItem) => {
    setSelectedMember(member);
    setIsMemberActionSheetOpen(true);
    onMemberAction?.(member);
  }, [onMemberAction]);

  const handleRemoveMember = useCallback(
    async (member: GroupMemberItem) => {
      setLiveMembers((prev) => prev?.filter((m) => m.id !== member.id) ?? []);
      setIsMemberActionSheetOpen(false);
      onRemoveMember?.(member);

      const membershipId = member.id;
      if (membershipId) {
        try {
          await updateDiscipleshipMembershipStatus(membershipId, "removed");
        } catch (err) {
          console.error("Failed to remove member:", err);
        }
      }
    },
    [onRemoveMember]
  );

  const handleCloseMemberActionSheet = useCallback(() => {
    setIsMemberActionSheetOpen(false);
  }, []);

  const handleOpenChangeStatusModal = useCallback(() => {
    setIsChangeStatusModalOpen(true);
  }, []);

  const handleCloseChangeStatusModal = useCallback(() => {
    setIsChangeStatusModalOpen(false);
  }, []);

  const handleOpenChangeStudyModal = useCallback(() => {
    setIsChangeStudyModalOpen(true);
  }, []);

  const handleCloseChangeStudyModal = useCallback(() => {
    setIsChangeStudyModalOpen(false);
  }, []);

  const handleUpdateStudy = useCallback(
    async (module: JourneyStudyModule) => {
      const updated: CurrentStudyData = {
        module_badge: module.module_badge,
        title: module.title,
      };
      setActiveStudy(updated);
      setIsChangeStudyModalOpen(false);
      onStudyUpdated?.(module);

      if (groupId && module.id) {
        try {
          await assignDiscipleshipJourney({
            discipleship_id: groupId,
            journey_id: module.id,
          });
        } catch (err) {
          console.error("Failed to assign discipleship journey:", err);
        }
      }
    },
    [groupId, onStudyUpdated]
  );

  return {
    activeGroup,
    resolvedChurchName,
    groupStatus,
    isActive,
    membersCount,
    activeGathering,
    hasSchedule,
    activeStudy,
    isChangeStudyModalOpen,
    isChangeStatusModalOpen,
    isScheduleModalOpen,
    scheduleModalMode,
    selectedMember,
    isMemberActionSheetOpen,
    initialScheduleFormData,
    handleUpdateStatus,
    handleOpenSetSchedule,
    handleOpenEditSchedule,
    handleCloseScheduleModal,
    handleRemoveSchedule,
    handleSaveSchedule,
    handleMemberAction,
    handleRemoveMember,
    handleCloseMemberActionSheet,
    handleOpenChangeStatusModal,
    handleCloseChangeStatusModal,
    handleOpenChangeStudyModal,
    handleCloseChangeStudyModal,
    handleUpdateStudy,
  };
}
