import { useState, useEffect } from "react";
import { CurrentStudyCard } from "../../../components/CurrentStudyCard";
import { GroupMemberActionSheet } from "../../../components/GroupMemberActionSheet";
import { GroupRosterList } from "../../../components/GroupRosterList";
import { NextGatheringCard } from "../../../components/NextGatheringCard";
import { SetGatheringScheduleModal } from "../../../components/SetGatheringScheduleModal";
import { ChangeGroupStatusModal } from "../../../components/ChangeGroupStatusModal";
import {
  myDiscipleshipGroupsLeadCardViewConst,
  MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import {
  findLeadGroupById,
  mockLeadChurchGroups,
  type GroupMemberItem,
  type NextGatheringData,
} from "../../../models/mocks/discipleshipLead.mocks";
import type {
  MyDiscipleshipGroupsLeadCardViewProps,
  GatheringScheduleFormData,
  MeetingFormat,
} from "../../../models/types/myDiscipleshipGroupsLeadCardView.types";
import { MyDiscipleshipGroupsLeadScheduleEmptyState } from "./MyDiscipleshipGroupsLeadScheduleEmptyState";

function parseGatheringToFormData(
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

export function MyDiscipleshipGroupsLeadCardView({
  groupId,
  group,
  churchName,
  config = myDiscipleshipGroupsLeadCardViewConst,
  onBack,
  onSetSchedule,
  onEditSchedule,
  onRemoveSchedule,
  onScheduleSaved,
  onScheduleRemoved,
  onStatusChange,
  onOpenJourneyReading,
  onMemberAction,
  onViewMemberDetails,
  onRemoveMember,
  className = "",
}: MyDiscipleshipGroupsLeadCardViewProps) {
  const {
    back: BackIcon,
    chevronDown: ChevronDownIcon,
  } = MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS;

  // Resolve group data: passed prop -> looked up by ID -> default active group without schedule (grp-lead-002)
  const lookupResult = groupId ? findLeadGroupById(groupId) : null;
  const activeGroup =
    group ?? lookupResult?.group ?? mockLeadChurchGroups[0]?.groups[1];

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
  const [scheduledGathering, setScheduledGathering] = useState<
    NextGatheringData | null
  >(activeGroup?.next_gathering ?? null);

  useEffect(() => {
    setScheduledGathering(activeGroup?.next_gathering ?? null);
  }, [activeGroup?.id, activeGroup?.next_gathering]);

  // Member action sheet state
  const [selectedMember, setSelectedMember] = useState<GroupMemberItem | null>(null);
  const [isMemberActionSheetOpen, setIsMemberActionSheetOpen] = useState(false);

  const resolvedChurchName =
    churchName ??
    activeGroup?.church_name ??
    lookupResult?.churchName ??
    mockLeadChurchGroups[0]?.church_name ??
    "";

  if (!activeGroup) {
    return null;
  }

  const isActive = groupStatus === "Active";
  const membersCount =
    activeGroup.members_count ?? activeGroup.members?.length ?? 0;

  const activeGathering = scheduledGathering;
  const hasSchedule = Boolean(activeGathering && activeGathering.timing);

  const handleUpdateStatus = (statusId: string) => {
    const newStatus: "Active" | "Paused" =
      statusId === "paused" ? "Paused" : "Active";
    setGroupStatus(newStatus);
    setIsChangeStatusModalOpen(false);
    onStatusChange?.(newStatus);
  };

  const handleOpenSetSchedule = () => {
    setScheduleModalMode("create");
    setIsScheduleModalOpen(true);
    onSetSchedule?.();
  };

  const handleOpenEditSchedule = () => {
    setScheduleModalMode("edit");
    setIsScheduleModalOpen(true);
    onEditSchedule?.();
  };

  const handleRemoveSchedule = () => {
    setScheduledGathering(null);
    setIsScheduleModalOpen(false);
    onRemoveSchedule?.();
    onScheduleRemoved?.();
  };

  const handleSaveSchedule = (data: GatheringScheduleFormData) => {
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
  };

  const handleMemberAction = (member: GroupMemberItem) => {
    setSelectedMember(member);
    setIsMemberActionSheetOpen(true);
    onMemberAction?.(member);
  };

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-5 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-slate-900 hover:text-navy-hover transition-colors cursor-pointer border-none bg-transparent p-0 select-none"
          aria-label={config.buttonBackLabel}
        >
          {BackIcon && <BackIcon className="w-5 h-5 -ml-1 text-slate-900" />}
          <span>{config.buttonBackLabel}</span>
        </button>
      </div>

      {/* ── Group Header Card (Clickable Status Badge on top right, no group icon) ─ */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-1.5 shadow-xs select-none">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
            {activeGroup.name}
          </h1>

          {/* Clickable Status Badge Button (on top right) */}
          <button
            type="button"
            onClick={() => setIsChangeStatusModalOpen(true)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer shadow-2xs transition-all active:scale-95 focus:outline-none focus:ring-2 shrink-0
              ${
                isActive
                  ? "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-300/80 focus:ring-emerald-500/30"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-400/30"
              }
            `.trim()}
            aria-label={`Change status: currently ${groupStatus}`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
              aria-hidden="true"
            />
            <span>
              {isActive ? config.activeBadgeLabel : config.pausedBadgeLabel}
            </span>
            {ChevronDownIcon && (
              <ChevronDownIcon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? "text-emerald-700" : "text-slate-500"
                }`}
              />
            )}
          </button>
        </div>

        <p className="text-[13px] text-slate-500 leading-relaxed truncate">
          {resolvedChurchName} · {membersCount} {config.membersSuffix}
        </p>
      </div>

      {/* ── Meeting Schedule Section: Active with schedule vs Empty State ── */}
      {hasSchedule && activeGathering ? (
        <NextGatheringCard
          gathering={activeGathering}
          timing={activeGathering.timing}
          subtitle={activeGathering.subtitle}
          location={activeGathering.location}
          virtualLink={activeGathering.virtual_link}
          gatheringType={activeGathering.gathering_type}
          headerTitle={config.scheduleSectionHeaderTitle}
          editButtonLabel={config.editScheduleButtonLabel}
          isLead
          onEditSchedule={handleOpenEditSchedule}
        />
      ) : (
        <MyDiscipleshipGroupsLeadScheduleEmptyState
          onSetSchedule={handleOpenSetSchedule}
        />
      )}

      {/* ── Current Study Section (Current Journey) ──────────────────── */}
      {activeGroup.current_study && (
        <CurrentStudyCard
          study={activeGroup.current_study}
          title={activeGroup.current_study.title}
          subtitle={activeGroup.current_study.lesson_subtitle}
          moduleBadge={activeGroup.current_study.module_badge}
          headerTitle={config.currentStudyHeaderTitle}
          actionLabel={config.openJourneyButtonLabel}
          onOpenReading={onOpenJourneyReading}
        />
      )}

      {/* ── Group Roster Section ────────────────────────────────────── */}
      <GroupRosterList
        members={activeGroup.members}
        headerTitle={config.groupRosterHeaderTitle}
        totalCount={membersCount}
        onMemberAction={handleMemberAction}
      />

      {/* ── Set Gathering Schedule Modal ────────────────────────────── */}
      <SetGatheringScheduleModal
        isOpen={isScheduleModalOpen}
        mode={scheduleModalMode}
        initialData={
          scheduleModalMode === "edit" && activeGathering
            ? parseGatheringToFormData(activeGathering)
            : undefined
        }
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveSchedule}
        onRemoveSchedule={handleRemoveSchedule}
      />

      {/* ── Group Member Action Sheet Modal ──────────────────────────── */}
      <GroupMemberActionSheet
        isOpen={isMemberActionSheetOpen}
        member={selectedMember}
        config={config.memberActionSheet}
        onClose={() => setIsMemberActionSheetOpen(false)}
        onViewDetails={onViewMemberDetails}
        onRemoveMember={onRemoveMember}
      />

      {/* ── Change Group Status Modal ───────────────────────────────── */}
      <ChangeGroupStatusModal
        isOpen={isChangeStatusModalOpen}
        currentStatusId={isActive ? "active" : "paused"}
        onClose={() => setIsChangeStatusModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default MyDiscipleshipGroupsLeadCardView;
