// src/features/discipleship/views/DiscipleshipView.tsx
// Main coordinator view for Discipleship feature with production Auth & Guest handling.

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
import DiscipleshipUserGuestView from "./DiscipleshipUserGuestView/DiscipleshipUserGuestView";
import {
  useDiscipleshipView,
  type DiscipleshipViewMode,
} from "../viewmodels/useDiscipleshipView";

export type { DiscipleshipViewMode };

export function DiscipleshipView() {
  const {
    containerRef,
    isGuest,
    activeTab,
    setActiveTab,
    viewMode,
    isLeader,
    selectedChurchId,
    selectedApplicationId,
    selectedGroupId,
    selectedLeadGroupId,
    dashboardData,
    ledChurchGroups,
    activeChurchIds,
    isLeadSelectChurchModalOpen,
    leadSelectChurchData,
    isLoading,
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

  return (
    <div ref={containerRef} className="w-full">
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
          {isLoading ? (
            <GroupsDashboardSkeleton />
          ) : isGuest ? (
            <DiscipleshipUserGuestView />
          ) : (
            <>
              {/* ── Tab Switcher (Only visible if authenticated user leads groups) ──── */}
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
                  churchSections={ledChurchGroups}
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
