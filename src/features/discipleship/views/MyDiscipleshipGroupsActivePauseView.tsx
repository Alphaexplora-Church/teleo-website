import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import { ActionConfirmationModal } from "../components/modals/ActionConfirmationModal";
import { CurrentStudyCard } from "../components/cards/CurrentStudyCard";
import { NextGatheringCard } from "../components/cards/NextGatheringCard";
import { ThisWeekQuestionCard } from "../components/cards/ThisWeekQuestionCard";
import { GroupAction } from "../components/groups/GroupAction";
import type { DiscipleshipGroup } from "../models/types/discipleship.types";

const FALLBACK_EMPTY_GROUP: DiscipleshipGroup = {
  id: "",
  church_id: 0,
  church_name: "",
  name: "Discipleship Group",
  leader_id: "",
  leader_name: "Discipler",
  status: "active",
  role: "member",
};

export interface MyDiscipleshipGroupsActivePauseViewProps {
  groupId?: string;
  group?: DiscipleshipGroup;
  onBack?: () => void;
  onOpenJourneyReading?: () => void;
  onPauseMembership?: (groupId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  onLeaveGroup?: (groupId: string) => void;
  className?: string;
}

export function MyDiscipleshipGroupsActivePauseView({
  groupId,
  group = FALLBACK_EMPTY_GROUP,
  onBack,
  onOpenJourneyReading,
  onPauseMembership,
  onResumeGroup,
  onLeaveGroup,
  className = "",
}: MyDiscipleshipGroupsActivePauseViewProps) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

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
  const gatheringType = group?.next_gathering?.gathering_type ?? "Hybrid";

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
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
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
              label="Paused"
              variant="outline"
              dotVisible={false}
              size="sm"
              className="font-semibold text-[11px] tracking-wider uppercase shrink-0 border-slate-300 text-slate-600"
            />
          ) : (
            <Badge
              label="Active"
              variant="success"
              dotVisible={false}
              size="sm"
              className="font-bold text-[11px] px-2.5 py-0.5 tracking-wider uppercase shrink-0"
            />
          )}
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {churchName} · Led by {leaderName} · {membersCount} members
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
          headerTitle="NEXT GATHERING"
          copyButtonLabel="Copy Link"
          copiedButtonLabel="Copied"
        />
      ) : (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase select-none">
            NEXT GATHERING
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
        headerTitle="THIS WEEK'S QUESTION"
      />

      {/* ── Card 3: Current Study Component ─────────────────────────── */}
      <CurrentStudyCard
        study={group?.current_study}
        title={studyTitle}
        moduleBadge={studyModuleBadge}
        headerTitle="CURRENT STUDY"
        actionLabel="Open Journey Reading"
        onOpenReading={onOpenJourneyReading}
      />

      {/* ── Leave Group Confirmation Modal ──────────────────────────── */}
      <ActionConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Discipleship Group"
        description={`Are you sure you want to leave ${groupName}? You will lose access to group meetings, reminders, and materials.`}
        confirmLabel="Leave Group"
        cancelLabel="Cancel"
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
        title="Pause Discipleship Membership"
        description="Pausing your membership stops meeting notifications and reminders. You can resume anytime."
        confirmLabel="Pause Membership"
        cancelLabel="Cancel"
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

