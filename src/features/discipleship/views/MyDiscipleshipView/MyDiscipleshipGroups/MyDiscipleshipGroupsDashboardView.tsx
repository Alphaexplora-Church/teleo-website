import { useMemo } from "react";
import { Button } from "../../../../../shared/components/Button/Button";
import { DiscipleshipDashboardCard } from "../../../components/DiscipleshipDashboardCard";
import {
  myDiscipleshipGroupsDashboardConst,
  MY_DISCIPLESHIP_GROUPS_DASHBOARD_VIEW_ICONS,
} from "../../../models/constants/myDiscipleshipGroupsDashboardView.constant";
import { mockDiscipleshipDashboard } from "../../../models/mocks/discipleshipDashboard.mocks";
import type { MyDiscipleshipGroupsDashboardProps } from "../../../models/types/myDiscipleshipGroupsDashboardView.types";

export function MyDiscipleshipGroupsDashboardView({
  config = myDiscipleshipGroupsDashboardConst,
  dashboardData = mockDiscipleshipDashboard,
  onNavigateToChurchList,
  onOpenGroupRoom,
  onTrackApplication,
  onResumeGroup,
  className = "",
}: MyDiscipleshipGroupsDashboardProps) {
  const {
    actionChevron: ActionChevronIcon,
    activeClock: ActiveClockIcon,
    pendingHourglass: PendingHourglassIcon,
    pausedCircle: PausedCircleIcon,
  } = MY_DISCIPLESHIP_GROUPS_DASHBOARD_VIEW_ICONS;
  // ── Filter Groups and Applications from Mock / API ───────────
  const activeGroups = useMemo(
    () => dashboardData.groups.filter((group) => group.status === "active"),
    [dashboardData.groups]
  );

  const pendingApplications = useMemo(
    () =>
      dashboardData.applications.filter(
        (app) => app.status === "pending"
      ),
    [dashboardData.applications]
  );

  const pausedGroups = useMemo(
    () => dashboardData.groups.filter((group) => group.status === "paused"),
    [dashboardData.groups]
  );

  return (
    <div className={`w-full space-y-6 ${className}`.trim()}>
      {/* ── Dashboard Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 leading-tight">
            {config.headerTitle}
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            {config.headerSubtitle}
          </p>
        </div>

        {/* Explore Button (Reusable Global Button) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNavigateToChurchList}
          className="rounded-full px-3.5 py-1 text-xs font-semibold border-slate-300 text-slate-900 hover:bg-slate-50 transition-colors"
        >
          {config.exploreButtonLabel}
        </Button>
      </div>

      {/* ── Active Groups Section ──────────────────────────────── */}
      {activeGroups.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
            {config.activeGroupsHeader} ({activeGroups.length})
          </h3>
          <div className="space-y-3">
            {activeGroups.map((group) => {
              const hasMeetingTime = Boolean(group.next_gathering?.timing);
              const infoTitle = hasMeetingTime
                ? group.next_gathering!.timing
                : "No upcoming gathering set";
              const infoSubtitle =
                group.current_study?.title ??
                (hasMeetingTime ? config.defaultActiveMeetingTopic : undefined);

              return (
                <DiscipleshipDashboardCard
                  key={group.id}
                  imageUrl={group.image_url}
                  title={group.name}
                  subtitle={`${group.church_name} · Led by ${group.leader_name}`}
                  badgeLabel={config.activeBadgeLabel}
                  badgeVariant="success"
                  infoIcon={<ActiveClockIcon className="w-4 h-4" />}
                  infoTitle={infoTitle}
                  infoSubtitle={infoSubtitle}
                  actionLabel={config.openGroupRoomActionLabel}
                  actionIcon={<ActionChevronIcon className="w-4 h-4" />}
                  onAction={() => onOpenGroupRoom?.(group.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── Pending Applications Section ───────────────────────── */}
      {pendingApplications.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
            {config.pendingApplicationsHeader} ({pendingApplications.length})
          </h3>
          <div className="space-y-3">
            {pendingApplications.map((app) => (
              <DiscipleshipDashboardCard
                key={app.id}
                imageUrl={app.image_url}
                title={app.church_name}
                subtitle={config.pendingApplicationSubtitle}
                badgeLabel={config.pendingBadgeLabel}
                badgeVariant="warning"
                badgeDotVisible={false}
                infoIcon={<PendingHourglassIcon className="w-4 h-4" />}
                infoTitle={config.pendingStatusTitle}
                infoSubtitle={`${config.pendingResponseEstimatePrefix}${app.review_timing_days}`}
                actionLabel={config.trackApplicationActionLabel}
                actionIcon={<ActionChevronIcon className="w-4 h-4" />}
                onAction={() => onTrackApplication?.(app.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Paused Groups Section ──────────────────────────────── */}
      {pausedGroups.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
            {config.pausedGroupsHeader} ({pausedGroups.length})
          </h3>
          <div className="space-y-3">
            {pausedGroups.map((group) => (
              <DiscipleshipDashboardCard
                key={group.id}
                imageUrl={group.image_url}
                title={group.name}
                subtitle={`${group.church_name} · Led by ${group.leader_name}`}
                badgeLabel={config.pausedBadgeLabel}
                badgeVariant="outline"
                infoIcon={<PausedCircleIcon className="w-4 h-4" />}
                infoTitle={config.pausedMeetingNotice}
                actionLabel={config.resumeGroupActionLabel}
                actionIcon={<ActionChevronIcon className="w-4 h-4" />}
                onAction={() => onResumeGroup?.(group.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyDiscipleshipGroupsDashboardView;
