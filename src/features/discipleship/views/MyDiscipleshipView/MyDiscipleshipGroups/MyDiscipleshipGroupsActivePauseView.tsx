import { useState } from "react";
import { Badge } from "../../../../../shared/components/Badge/Badge";
import { Button } from "../../../../../shared/components/Button/Button";
import { ActionConfirmationModal } from "../../../components/ActionConfirmationModal";
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
  const [hasCopied, setHasCopied] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  // Icons from constant
  const {
    back: BackIcon,
    pausedBanner: PausedBannerIcon,
    calendar: CalendarIcon,
    clock: ClockIcon,
    location: LocationIcon,
    video: VideoIcon,
    copy: CopyIcon,
    copied: CopiedIcon,
    quote: QuoteIcon,
    lock: LockIcon,
    study: StudyIcon,
    openReading: OpenReadingIcon,
    pauseMembership: PauseMembershipIcon,
    leaveGroup: LeaveGroupIcon,
  } = MY_DISCIPLESHIP_GROUPS_ACTIVE_PAUSE_VIEW_ICONS;

  // Group Details (Dynamic Data)
  const activeGroupId = group?.id ?? groupId ?? "";
  const groupName = group?.name ?? "";
  const churchName = group?.church_name ?? "";
  const leaderName = group?.leader_name ?? "";
  const membersCount = group?.members_count ?? 0;
  const isPaused = group?.status === "paused";

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
  const studySubtitle = group?.current_study?.lesson_subtitle ?? "";

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(gatheringLink).catch(() => { });
    }
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-4 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button Only ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-slate-900 hover:text-navy-hover transition-colors cursor-pointer border-none bg-transparent p-0"
          aria-label={config.buttonBackLabel}
        >
          <BackIcon className="w-5 h-5 -ml-1 text-slate-900" />
          <span>{config.buttonBackLabel}</span>
        </button>
      </div>

      {/* ── Header Card: Group Name, Badge, Subtitle ────────────────── */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-1.5 shadow-xs">
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

      {/* ── Paused Notice Banner (Only shown when group is paused) ──── */}
      {isPaused && (
        <div className="w-full bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <PausedBannerIcon className="w-5 h-5 text-slate-600 shrink-0" />
            <span className="text-[12.5px] text-slate-700 font-normal truncate">
              {config.takingBreakNotice}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onResumeGroup?.(activeGroupId)}
            className="h-8 px-3.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer shrink-0 shadow-none"
          >
            {config.resumeButtonLabel}
          </Button>
        </div>
      )}

      {/* ── Card 1: Next Gathering ─────────────────────────────────── */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
              {config.nextGatheringHeader}
            </span>
          </div>
          <Badge
            label={gatheringType}
            variant="default"
            dotVisible={false}
            size="sm"
            className="rounded-md font-medium text-[11px] bg-slate-100 text-slate-600 tracking-wide"
          />
        </div>

        <div className="space-y-2.5 pt-0.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <ClockIcon className="w-4 h-4 text-slate-600" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-[15px] text-slate-900 leading-tight">
                {gatheringTiming}
              </p>
              {gatheringSubtitle && (
                <p className="text-[12.5px] text-slate-500">
                  {gatheringSubtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <LocationIcon className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-[13.5px] font-medium text-slate-700">
              {gatheringLocation}
            </span>
          </div>
        </div>

        {/* Virtual Link Box with Copy Button */}
        <div className="w-full bg-slate-50 rounded-xl border border-slate-100 px-3.5 py-2.5 flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <VideoIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="font-mono text-[12.5px] text-slate-700 truncate select-all">
              {gatheringLink}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-7 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            {hasCopied ? (
              <>
                <CopiedIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">
                  {config.copiedButtonLabel}
                </span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>{config.copyButtonLabel}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Card 2: This Week's Question ───────────────────────────── */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <QuoteIcon className="w-4 h-4 text-slate-600 rotate-180" />
          <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
            {config.thisWeekQuestionHeader}
          </span>
        </div>

        <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-4 flex gap-3">
          <div className="w-1 bg-slate-300 rounded-full shrink-0 self-stretch my-0.5" />
          <p className="italic text-[13.5px] text-slate-800 leading-relaxed">
            {reflectionQuestion}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-500 px-0.5">
          <LockIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{config.questionFootnoteText}</span>
        </div>
      </div>

      {/* ── Card 3: Current Study ──────────────────────────────────── */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StudyIcon className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase select-none">
              {config.currentStudyHeader}
            </span>
          </div>
          {studyModuleBadge && (
            <Badge
              label={studyModuleBadge}
              variant="default"
              dotVisible={false}
              size="sm"
              className="rounded-md font-medium text-[11px] bg-slate-100 text-slate-600 tracking-wide"
            />
          )}
        </div>

        <div className="space-y-0.5">
          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">
            {studyTitle}
          </h3>
          {studySubtitle && (
            <p className="text-[12.5px] text-slate-500">
              {studySubtitle}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onOpenJourneyReading?.(studyTitle)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl py-3 px-3.5 !justify-between text-[13px] font-semibold text-slate-900 transition-all shadow-2xs mt-1"
        >
          <div className="flex items-center gap-2">
            <StudyIcon className="w-4 h-4 text-slate-600" />
            <span>{config.openJourneyButtonLabel}</span>
          </div>
          <OpenReadingIcon className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      {/* ── Bottom Section: Active vs Paused Actions ───────────────── */}
      {isPaused ? (
        <div className="pt-2 pb-6 space-y-2">
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={() => setIsLeaveModalOpen(true)}
            className="w-full h-12 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-2xl flex items-center justify-center gap-2 font-semibold text-[14.5px] transition-all cursor-pointer shadow-xs"
          >
            <LeaveGroupIcon className="w-4 h-4" />
            <span>{config.leaveGroupPermanentlyButtonLabel}</span>
          </Button>
          <p className="text-xs text-slate-500 text-center px-4 leading-normal">
            {config.leaveGroupPermanentlyHint}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-2 pb-6">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase select-none px-1">
            {config.membershipSettingsHeader}
          </h3>

          <div className="space-y-1.5">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsPauseModalOpen(true)}
              className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center gap-2 font-semibold text-[14.5px] text-slate-900 transition-all cursor-pointer shadow-xs"
            >
              <PauseMembershipIcon className="w-4 h-4 text-slate-900" />
              <span>{config.pauseMembershipButtonLabel}</span>
            </Button>
            <p className="text-xs text-slate-500 text-center px-4 leading-normal">
              {config.pauseMembershipHint}
            </p>
          </div>

          <div className="pt-1.5">
            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => setIsLeaveModalOpen(true)}
              className="w-full h-12 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded-2xl flex items-center justify-center gap-2 font-semibold text-[14.5px] transition-all cursor-pointer shadow-xs"
            >
              <LeaveGroupIcon className="w-4 h-4" />
              <span>{config.leaveGroupButtonLabel}</span>
            </Button>
          </div>
        </div>
      )}

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