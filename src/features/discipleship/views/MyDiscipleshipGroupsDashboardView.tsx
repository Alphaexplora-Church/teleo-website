import { useMemo } from "react";
import { Clock, Hourglass, PauseCircle } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import { DiscipleshipDashboardCard } from "../components/cards/DiscipleshipDashboardCard";
import type { DiscipleshipDashboardData } from "../models/types/discipleship.types";

const EMPTY_DASHBOARD: DiscipleshipDashboardData = {
  groups: [],
  applications: [],
};

export interface MyDiscipleshipGroupsDashboardViewProps {
  dashboardData?: DiscipleshipDashboardData;
  onNavigateToChurchList?: () => void;
  onOpenGroupRoom?: (groupId: string) => void;
  onTrackApplication?: (applicationId: string) => void;
  onResumeGroup?: (groupId: string) => void;
  className?: string;
}

export function MyDiscipleshipGroupsDashboardView({
  dashboardData = EMPTY_DASHBOARD,
  onNavigateToChurchList,
  onOpenGroupRoom,
  onTrackApplication,
  className = "",
}: MyDiscipleshipGroupsDashboardViewProps) {
  const activeGroups = useMemo(
    () => dashboardData.groups.filter((group) => group.status === "active"),
    [dashboardData.groups]
  );

  const pendingApplications = useMemo(
    () => dashboardData.applications.filter((app) => app.status === "pending"),
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
            My Discipleships
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Groups you are part of
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNavigateToChurchList}
          className="rounded-full px-3.5 py-1 text-xs font-semibold border-slate-300 text-slate-900 hover:bg-slate-50 transition-colors"
        >
          + Explore
        </Button>
      </div>

      {/* ── Active Groups Section ──────────────────────────────── */}
      {activeGroups.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase select-none">
            ACTIVE GROUPS ({activeGroups.length})
          </h3>
          <div className="space-y-3">
            {activeGroups.map((group) => {
              const hasMeetingTime = Boolean(group.next_gathering?.timing);
              const infoTitle = hasMeetingTime
                ? group.next_gathering!.timing
                : "No upcoming gathering set";
              const infoSubtitle =
                group.current_study?.title ??
                (hasMeetingTime ? "Romans 8: Life in the Spirit" : undefined);

              return (
                <DiscipleshipDashboardCard
                  key={group.id}
                  imageUrl={group.image_url}
                  title={group.name}
                  subtitle={`${group.church_name} · Led by ${group.leader_name}`}
                  badgeLabel="Active"
                  badgeVariant="success"
                  infoIcon={<Clock className="w-4 h-4" />}
                  infoTitle={infoTitle}
                  infoSubtitle={infoSubtitle}
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
            PENDING APPLICATIONS ({pendingApplications.length})
          </h3>
          <div className="space-y-3">
            {pendingApplications.map((app) => (
              <DiscipleshipDashboardCard
                key={app.id}
                imageUrl={app.image_url}
                title={app.church_name}
                subtitle="Discipleship Application · Submitted today"
                badgeLabel="Pending"
                badgeVariant="warning"
                badgeDotVisible={false}
                infoIcon={<Hourglass className="w-4 h-4" />}
                infoTitle="Church leadership is reviewing your answers"
                infoSubtitle={`Estimated response in ${app.review_timing_days}`}
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
            PAUSED GROUPS ({pausedGroups.length})
          </h3>
          <div className="space-y-3">
            {pausedGroups.map((group) => (
              <DiscipleshipDashboardCard
                key={group.id}
                imageUrl={group.image_url}
                title={group.name}
                subtitle={`${group.church_name} · Led by ${group.leader_name}`}
                badgeLabel="Paused"
                badgeVariant="outline"
                infoIcon={<PauseCircle className="w-4 h-4" />}
                infoTitle="Meeting reminders and notifications paused"
                onAction={() => onOpenGroupRoom?.(group.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MyDiscipleshipGroupsDashboardView;

