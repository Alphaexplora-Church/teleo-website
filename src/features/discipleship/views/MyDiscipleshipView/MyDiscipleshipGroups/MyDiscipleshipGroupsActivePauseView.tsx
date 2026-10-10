import { useState } from "react";
import { Badge } from "../../../../../shared/components/Badge/Badge";
import { ActionConfirmationModal } from "../../../components/ActionConfirmationModal";
import { CurrentStudyCard } from "../../../components/CurrentStudyCard";
import { NextGatheringCard } from "../../../components/NextGatheringCard";
import { ThisWeekQuestionCard } from "../../../components/ThisWeekQuestionCard";
import { GroupAction } from "../../../components/GroupAction";
import {
  myDiscipleshipGroupsActivePauseViewConst,
  MY_DISCIPLESHIP_GROUPS_ACTIVE_PAUSE_VIEW_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsActivePauseView.constant";
import { mockDefaultActiveGroup } from "../../../models/mocks/discipleshipDashboard.mocks";
import type { MyDiscipleshipGroupsActivePauseViewProps } from "../../../models/types/myDiscipleshipGroupsActivePauseView.types";

export function MyDiscipleshipGroupsActivePauseView({
  groupId,
  group = mockDefaultActiveGroup,
  config = myDiscipleshipGroupsActivePauseViewConst,
  onBack,
  onOpenJourneyReading,
  onPauseMembership,
  onResumeGroup,
  onLeaveGroup,
  className = "",
}: MyDiscipleshipGroupsActivePauseViewProps) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  // Icons from constant
  const {
    back: BackIcon,
  } = MY_DISCIPLESHIP_GROUPS_ACTIVE_PAUSE_VIEW_ICONS;

  // Group Details (Dynamic Data)
  const activeGroupId = group?.id ?? groupId ?? "";
  const groupName = group?.name ?? "";
  const churchName = group?.church_name ?? "";
  const leaderName = group?.leader_name ?? "";
  const membersCount = group?.members_count ?? 0;
  const isPaused = group?.status?.toLowerCase() === "paused";

  // Gathering Details (Dynamic Data)
  const gatheringTiming = group?.next_gathering?.timing ?? "";
  const gatheringSubtitle = group?.next_gathering?.subtitle ?? "";
  const gatheringLocation = group?.next_gathering?.location ?? "";
  const gatheringLink = group?.next_gathering?.virtual_link ?? "";
  const gatheringType = group?.next_gathering?.gathering_type ?? config.hybridBadgeLabel;

  // Reflection Question (Dynamic Data)
  const reflectionQuestion = group?.this_week_question ?? "";

  // Current Study (Dynamic Data)
  const studyModuleBadge = group?.current_study?.module_badge;
  const studyTitle = group?.current_study?.title ?? "";

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-4 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button & Group Action Dropdown ─────── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-slate-900 hover:text-navy-hover hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          aria-label={config.buttonBackLabel || "Back"}
        >
          <BackIcon className="w-6 h-6 text-slate-900" />
        </button>

        <GroupAction
          isPaused={isPaused}
          onPause={() => setIsPauseModalOpen(true)}
          onResume={() => onResumeGroup?.(activeGroupId)}
          onLeave={() => setIsLeaveModalOpen(true)}
        />
      </div>

      {/* ── Group Header: Group Name, Badge, Subtitle ───────────────── */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {groupName}
          </h1>
          {isPaused ? (
            <Badge
              label={config.pausedBadgeLabel}
              variant="outline"
              dotVisible={false}
              size="sm"
              className="font-semibold text-[11px] tracking-wider uppercase shrink-0 border-slate-300 text-slate-600"
            />
          ) : (
            <Badge
              label={config.activeBadgeLabel}
              variant="success"
              dotVisible={false}
              size="sm"
              className="font-bold text-[11px] px-2.5 py-0.5 tracking-wider uppercase shrink-0"
            />
          )}
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {churchName} · Led by {leaderName} · {membersCount} {config.membersSuffix}
        </p>
      </div>

      {/* ── Card 1: Next Gathering Component or Empty Notice ────────── */}
      {gatheringTiming ? (
        <NextGatheringCard
          gathering={group?.next_gathering}
          timing={gatheringTiming}
          subtitle={gatheringSubtitle}
          location={gatheringLocation}
          virtualLink={gatheringLink}
          gatheringType={gatheringType}
          headerTitle={config.nextGatheringHeader}
          copyButtonLabel={config.copyButtonLabel}
          copiedButtonLabel={config.copiedButtonLabel}
        />
      ) : (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase select-none">
            {config.nextGatheringHeader}
          </span>
          <p className="text-[15px] font-semibold text-slate-800">
            No upcoming gathering set
          </p>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            The next meeting schedule has not been set yet. Check back soon.
          </p>
        </div>
      )}

      {/* ── Card 2: This Week's Question Component ──────────────────── */}
      <ThisWeekQuestionCard
        question={reflectionQuestion}
        headerTitle={config.thisWeekQuestionHeader}
      />

      {/* ── Card 3: Current Study Component ─────────────────────────── */}
      <CurrentStudyCard
        study={group?.current_study}
        title={studyTitle}
        moduleBadge={studyModuleBadge}
        headerTitle={config.currentStudyHeader}
        actionLabel={config.openJourneyButtonLabel}
        onOpenReading={onOpenJourneyReading}
      />



      {/* ── Leave Group Confirmation Modal ──────────────────────────── */}
      <ActionConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title={config.leaveGroupModalTitle}
        description={`${config.leaveGroupModalDescriptionPrefix}${groupName}${config.leaveGroupModalDescriptionSuffix}`}
        confirmLabel={config.leaveGroupModalConfirmLabel}
        cancelLabel={config.leaveGroupModalCancelLabel}
        confirmVariant="danger"
        onConfirm={() => {
          setIsLeaveModalOpen(false);
          onLeaveGroup?.(activeGroupId);
        }}
      />

      {/* ── Pause Membership Confirmation Modal ────────────────────── */}
      <ActionConfirmationModal
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        title={config.pauseMembershipModalTitle}
        description={config.pauseMembershipModalDescription}
        confirmLabel={config.pauseMembershipModalConfirmLabel}
        cancelLabel={config.pauseMembershipModalCancelLabel}
        confirmVariant="warning"
        onConfirm={() => {
          setIsPauseModalOpen(false);
          onPauseMembership?.(activeGroupId);
        }}
      />
    </div>
  );
}

export default MyDiscipleshipGroupsActivePauseView;