import { Badge } from "../../../../../shared/components/Badge/Badge";
import { CurrentStudyCard } from "../../../components/CurrentStudyCard";
import { GroupRosterList } from "../../../components/GroupRosterList";
import { NextGatheringCard } from "../../../components/NextGatheringCard";
import {
  myDiscipleshipGroupsLeadCardViewConst,
  MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import {
  findLeadGroupById,
  mockLeadChurchGroups,
} from "../../../models/mocks/discipleshipLead.mocks";
import type { MyDiscipleshipGroupsLeadCardViewProps } from "../../../models/types/myDiscipleshipGroupsLeadCardView.types";
import { MyDiscipleshipGroupsLeadScheduleEmptyState } from "./MyDiscipleshipGroupsLeadScheduleEmptyState";

export function MyDiscipleshipGroupsLeadCardView({
  groupId,
  group,
  churchName,
  config = myDiscipleshipGroupsLeadCardViewConst,
  onBack,
  onSetSchedule,
  onOpenJourneyReading,
  onMemberAction,
  className = "",
}: MyDiscipleshipGroupsLeadCardViewProps) {
  const { back: BackIcon } = MY_DISCIPLESHIP_GROUPS_LEAD_CARD_VIEW_ICONS;

  // Resolve group data: passed prop -> looked up by ID -> default active group without schedule (grp-lead-002)
  const lookupResult = groupId ? findLeadGroupById(groupId) : null;
  const activeGroup =
    group ?? lookupResult?.group ?? mockLeadChurchGroups[0]?.groups[1];

  const resolvedChurchName =
    churchName ??
    activeGroup?.church_name ??
    lookupResult?.churchName ??
    mockLeadChurchGroups[0]?.church_name ??
    "";

  if (!activeGroup) {
    return null;
  }

  const isActive = activeGroup.status === "Active";
  const membersCount =
    activeGroup.members_count ?? activeGroup.members?.length ?? 0;
  const hasSchedule = Boolean(
    activeGroup.next_gathering && activeGroup.next_gathering.timing
  );

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
          <BackIcon className="w-5 h-5 -ml-1 text-slate-900" />
          <span>{config.buttonBackLabel}</span>
        </button>
      </div>

      {/* ── Group Header Card (No Group Icon) ───────────────────────── */}
      <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-1.5 shadow-xs select-none">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
            {activeGroup.name}
          </h1>
          {isActive ? (
            <Badge
              label={config.activeBadgeLabel}
              variant="success"
              dotVisible={false}
              size="sm"
              className="font-bold text-[11px] px-2.5 py-0.5 tracking-wider uppercase shrink-0"
            />
          ) : (
            <Badge
              label={config.pausedBadgeLabel}
              variant="outline"
              dotVisible={false}
              size="sm"
              className="font-semibold text-[11px] tracking-wider uppercase shrink-0 border-slate-300 text-slate-600"
            />
          )}
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed truncate">
          {resolvedChurchName} · {membersCount} {config.membersSuffix}
        </p>
      </div>

      {/* ── Meeting Schedule Section: Active with schedule vs Empty State ── */}
      {hasSchedule && activeGroup.next_gathering ? (
        <NextGatheringCard
          gathering={activeGroup.next_gathering}
          timing={activeGroup.next_gathering.timing}
          subtitle={activeGroup.next_gathering.subtitle}
          location={activeGroup.next_gathering.location}
          virtualLink={activeGroup.next_gathering.virtual_link}
          gatheringType={activeGroup.next_gathering.gathering_type}
          headerTitle={config.scheduleSectionHeaderTitle}
        />
      ) : (
        <MyDiscipleshipGroupsLeadScheduleEmptyState
          onSetSchedule={onSetSchedule}
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
        onMemberAction={onMemberAction}
      />
    </div>
  );
}

export default MyDiscipleshipGroupsLeadCardView;
