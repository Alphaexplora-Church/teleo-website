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
import type { MyDiscipleshipGroupsLeadCardViewProps } from "../../../models/types/myDiscipleshipGroupsLeadCardView.types";
import { MyDiscipleshipGroupsLeadScheduleEmptyState } from "./MyDiscipleshipGroupsLeadScheduleEmptyState";
import { useLeadGroupCard } from "../../../viewmodels/useLeadGroupCard";

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

  const {
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
  } = useLeadGroupCard({
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
  });

  if (!activeGroup) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-5 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button (Icon Only) ─────────────────── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-slate-900 hover:text-navy-hover hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent select-none"
          aria-label={config.buttonBackLabel || "Back"}
        >
          {BackIcon && <BackIcon className="w-6 h-6 text-slate-900" />}
        </button>
      </div>

      {/* ── Group Header (Clickable Status Badge on top right) ──────── */}
      <div className="w-full space-y-1.5 select-none">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
            {activeGroup.name}
          </h1>

          {/* Clickable Status Badge Button (on top right) */}
          <button
            type="button"
            onClick={handleOpenChangeStatusModal}
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
        initialData={initialScheduleFormData}
        onClose={handleCloseScheduleModal}
        onSave={handleSaveSchedule}
        onRemoveSchedule={handleRemoveSchedule}
      />

      {/* ── Group Member Action Sheet Modal ──────────────────────────── */}
      <GroupMemberActionSheet
        isOpen={isMemberActionSheetOpen}
        member={selectedMember}
        config={config.memberActionSheet}
        onClose={handleCloseMemberActionSheet}
        onViewDetails={onViewMemberDetails}
        onRemoveMember={onRemoveMember}
      />

      {/* ── Change Group Status Modal ───────────────────────────────── */}
      <ChangeGroupStatusModal
        isOpen={isChangeStatusModalOpen}
        currentStatusId={isActive ? "active" : "paused"}
        onClose={handleCloseChangeStatusModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default MyDiscipleshipGroupsLeadCardView;
