import { useState } from "react";
import { GroupsTabSwitcher } from "../components/groups/GroupsTabSwitcher";
import MyDiscipleshipView from "./MyDiscipleshipView/MyDiscipleshipView";
import MyDiscipleshipLeadView from "./MyDiscipleshipLeadView/MyDiscipleshipLeadView";
import MyDiscipleshipGroupsLeadCardView from "./MyDiscipleshipLeadView/MyDiscipleshipGroupsLead/MyDiscipleshipGroupsLeadCardView";
import MyDiscipleshipGroupsPendingView from "./MyDiscipleshipView/MyDiscipleshipGroups/MyDiscipleshipGroupsPendingView";
import MyDiscipleshipGroupsActivePauseView from "./MyDiscipleshipView/MyDiscipleshipGroups/MyDiscipleshipGroupsActivePauseView";
import DiscipleshipProcessChurchList from "./DiscipleshipProcess/DiscipleshipProcessChurchList";
import DiscipleshipProcessIntro from "./DiscipleshipProcess/DiscipleshipProcessIntro";
import DiscipleshipProcessChurchApply from "./DiscipleshipProcess/DiscipleshipProcessChurchApply";
import { LeadSelectChurchModal } from "../components/modals/LeadSelectChurchModal";
import { GroupsDashboardSkeleton } from "../components/skeletons/GroupsDashboardSkeleton";
import { ChurchListSkeleton } from "../components/skeletons/ChurchListSkeleton";
import { MemberListSkeleton } from "../components/skeletons/MemberListSkeleton";
import { ModuleSkeleton } from "../components/skeletons/ModuleSkeleton";
import { ModuleListSkeleton } from "../components/skeletons/ModuleListSkeleton";
import { QuestionSkeleton } from "../components/skeletons/QuestionSkeleton";
import { ScheduleSkeleton } from "../components/skeletons/ScheduleSkeleton";
import { TimelineStatusSkeleton } from "../components/skeletons/TimelineStatusSkeleton";
import { NetworkErrorState } from "../components/network/NetworkErrorState";
import DiscipleshipUserGuestView from "./DiscipleshipUserGuestView/DiscipleshipUserGuestView";
import {
  useDiscipleshipView,
  type DiscipleshipViewMode,
  type DiscipleshipDemoPersona,
} from "../viewmodels/useDiscipleshipView";

export type { DiscipleshipViewMode, DiscipleshipDemoPersona };

export function DiscipleshipView() {
  const {
    containerRef,
    activeTab,
    setActiveTab,
    viewMode,
    persona,
    setPersona,
    isLeader,
    selectedChurchId,
    selectedApplicationId,
    selectedGroupId,
    selectedLeadGroupId,
    dashboardData,
    activeChurchIds,
    isLeadSelectChurchModalOpen,
    leadSelectChurchData,
    handleCloseLeadSelectChurchModal,
    handleSelectLeadChurchGroup,
    handleSelectChurch,
    handleNavigateToChurchList,
    handleBackToDashboard,
    handleBackToChurchList,
    handleBackToIntro,
    handleApply,
    handleSubmitApplication,
    handleTrackApplication,
    handleWithdrawApplication,
    handleResumeGroup,
    handleOpenGroupRoom,
    handleLeaveGroup,
    handlePauseMembership,
    handleManageLeadGroup,
    handleBackFromLeadGroup,
  } = useDiscipleshipView();

  const [skeletonTab, setSkeletonTab] = useState<
    | "dashboard"
    | "churches"
    | "members"
    | "module"
    | "curricula"
    | "schedule"
    | "question"
    | "timeline"
  >("dashboard");

  return (
    <div ref={containerRef} className="w-full">
      {/* ── Demo Persona Switcher (For Presentation / Live Demo) ── */}
      <div className="w-full max-w-md mx-auto px-4 pt-3 pb-1 flex items-center justify-between gap-2 select-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Demo:
        </span>
        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setPersona("guest")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "guest"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Guest POV
          </button>
          <button
            type="button"
            onClick={() => setPersona("empty")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "empty"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            New Member
          </button>
          <button
            type="button"
            onClick={() => setPersona("member")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "member"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Member
          </button>
          <button
            type="button"
            onClick={() => setPersona("lead")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "lead"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Lead POV
          </button>
          <button
            type="button"
            onClick={() => setPersona("skeleton")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "skeleton"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Skeleton
          </button>
          <button
            type="button"
            onClick={() => setPersona("offline")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              persona === "offline"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* ── -1.5. Lead Group Detail Card Sub-View (No Tab Switcher) ── */}
      {viewMode === "lead-group-card" && (
        <MyDiscipleshipGroupsLeadCardView
          groupId={selectedLeadGroupId}
          onBack={handleBackFromLeadGroup}
        />
      )}

      {/* ── -1. Group Active / Room Sub-View ──────────────────────── */}
      {viewMode === "group-active" && (
        <MyDiscipleshipGroupsActivePauseView
          groupId={selectedGroupId}
          group={dashboardData.groups.find((g) => g.id === selectedGroupId)}
          onBack={handleBackToDashboard}
          onLeaveGroup={handleLeaveGroup}
          onPauseMembership={handlePauseMembership}
          onResumeGroup={handleResumeGroup}
        />
      )}

      {/* ── 0. Application Status Sub-View ─────────────────────────── */}
      {viewMode === "application-status" && (
        <MyDiscipleshipGroupsPendingView
          applicationId={selectedApplicationId}
          application={dashboardData.applications.find(
            (app) => app.id === selectedApplicationId
          )}
          onBack={handleBackToDashboard}
          onWithdrawApplication={handleWithdrawApplication}
        />
      )}

      {/* ── 1. Church Apply Form Sub-View ──────────────────────────── */}
      {viewMode === "church-apply" && (
        <DiscipleshipProcessChurchApply
          churchId={selectedChurchId}
          onBack={handleBackToIntro}
          onSubmit={handleSubmitApplication}
        />
      )}

      {/* ── 2. Church Intro Sub-View ───────────────────────────────── */}
      {viewMode === "church-intro" && (
        <DiscipleshipProcessIntro
          churchId={selectedChurchId}
          onBack={handleBackToChurchList}
          onApply={handleApply}
        />
      )}

      {/* ── 3. Church List Sub-View ────────────────────────────────── */}
      {viewMode === "church-list" && (
        <DiscipleshipProcessChurchList
          pendingChurchIds={dashboardData.applications
            .filter((app) => app.status === "pending")
            .map((app) => app.church_id)}
          activeChurchIds={activeChurchIds}
          onBack={handleBackToDashboard}
          onSelectChurch={handleSelectChurch}
        />
      )}

      {/* ── 4. Main Groups Dashboard ───────────────────────────────── */}
      {viewMode === "dashboard" && (
        <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
          {persona === "guest" ? (
            <DiscipleshipUserGuestView />
          ) : persona === "offline" ? (
            <div className="py-6">
              <NetworkErrorState
                onRetry={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 800));
                  setPersona("member");
                }}
              />
            </div>
          ) : persona === "skeleton" ? (
            <div className="space-y-4">
              {/* Skeleton Component Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
                <button
                  type="button"
                  onClick={() => setSkeletonTab("dashboard")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "dashboard"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("churches")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "churches"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Church List
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("members")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "members"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Member List
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("module")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "module"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Current Study
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("curricula")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "curricula"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Curricula List
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("schedule")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "schedule"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Next Gathering
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("question")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "question"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Question
                </button>
                <button
                  type="button"
                  onClick={() => setSkeletonTab("timeline")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    skeletonTab === "timeline"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Review Timeline
                </button>
              </div>

              {/* Render Selected Skeleton */}
              {skeletonTab === "dashboard" && <GroupsDashboardSkeleton />}
              {skeletonTab === "churches" && <ChurchListSkeleton />}
              {skeletonTab === "members" && <MemberListSkeleton count={3} />}
              {skeletonTab === "module" && <ModuleSkeleton />}
              {skeletonTab === "curricula" && <ModuleListSkeleton count={1} />}
              {skeletonTab === "schedule" && <ScheduleSkeleton />}
              {skeletonTab === "question" && <QuestionSkeleton />}
              {skeletonTab === "timeline" && <TimelineStatusSkeleton />}
            </div>
          ) : (
            <>
              {/* ── Tab Switcher (Only visible for Leader POV) ──────────── */}
              {isLeader && (
                <GroupsTabSwitcher
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
              )}

              {/* ── Dynamic Tab Content ─────────────────────────────────── */}
              {activeTab === "my-discipleship" || !isLeader ? (
                <MyDiscipleshipView
                  dashboardData={dashboardData}
                  onSelectChurch={handleSelectChurch}
                  onNavigateToChurchList={handleNavigateToChurchList}
                  onTrackApplication={handleTrackApplication}
                  onOpenGroupRoom={handleOpenGroupRoom}
                  onResumeGroup={handleResumeGroup}
                />
              ) : (
                <MyDiscipleshipLeadView
                  onManageGroup={handleManageLeadGroup}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ── Lead Select Church Modal ───────────────────────────────── */}
      <LeadSelectChurchModal
        isOpen={isLeadSelectChurchModalOpen}
        churchName={leadSelectChurchData?.churchName}
        groups={leadSelectChurchData?.groups}
        onClose={handleCloseLeadSelectChurchModal}
        onSelectGroup={handleSelectLeadChurchGroup}
      />
    </div>
  );
}

export default DiscipleshipView;
