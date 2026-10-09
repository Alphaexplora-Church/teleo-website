import { useState, useEffect, useCallback, useMemo } from "react";
import {
  findLeadGroupById,
  mockLeadChurchGroups,
  type GroupMemberItem,
  type NextGatheringData,
  type LeadGroupItem,
} from "../models/mocks/discipleshipLead.mocks";
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
}: UseLeadGroupCardOptions = {}) {
  // Resolve group data: passed prop -> looked up by ID -> fallback
  const lookupResult = useMemo(
    () => (groupId ? findLeadGroupById(groupId) : null),
    [groupId]
  );

  const activeGroup =
    group ?? lookupResult?.group ?? mockLeadChurchGroups[0]?.groups[1];

  const resolvedChurchName =
    churchName ??
    activeGroup?.church_name ??
    lookupResult?.churchName ??
    mockLeadChurchGroups[0]?.church_name ??
    "";

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

  const handleUpdateStatus = useCallback((statusId: string) => {
    const newStatus: "Active" | "Paused" =
      statusId === "paused" ? "Paused" : "Active";
    setGroupStatus(newStatus);
    setIsChangeStatusModalOpen(false);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

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

  const handleRemoveSchedule = useCallback(() => {
    setScheduledGathering(null);
    setIsScheduleModalOpen(false);
    onRemoveSchedule?.();
    onScheduleRemoved?.();
  }, [onRemoveSchedule, onScheduleRemoved]);

  const handleSaveSchedule = useCallback((data: GatheringScheduleFormData) => {
    const gatheringType =
      data.format === "physical"
        ? "IN-PERSON"
        : data.format === "virtual"
        ? "VIRTUAL"
        : "HYBRID";

    const newGathering: NextGatheringData = {
      timing: `${data.dayOfWeek}s at ${data.startTime}`,
      subtitle: `Repeats ${data.recurrence.toLowerCase()} · 90 minutes`,
      location: data.location,
      virtual_link: data.virtualLink,
      gathering_type: gatheringType,
    };

    setScheduledGathering(newGathering);
    setIsScheduleModalOpen(false);
    onScheduleSaved?.(data, newGathering);
  }, [onScheduleSaved]);

  const handleMemberAction = useCallback((member: GroupMemberItem) => {
    setSelectedMember(member);
    setIsMemberActionSheetOpen(true);
    onMemberAction?.(member);
  }, [onMemberAction]);

  const handleCloseMemberActionSheet = useCallback(() => {
    setIsMemberActionSheetOpen(false);
  }, []);

  const handleOpenChangeStatusModal = useCallback(() => {
    setIsChangeStatusModalOpen(true);
  }, []);

  const handleCloseChangeStatusModal = useCallback(() => {
    setIsChangeStatusModalOpen(false);
  }, []);

  return {
    activeGroup,
    resolvedChurchName,
    groupStatus,
    isActive,
    membersCount,
    activeGathering,
    hasSchedule,
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
    handleCloseMemberActionSheet,
    handleOpenChangeStatusModal,
    handleCloseChangeStatusModal,
  };
}
