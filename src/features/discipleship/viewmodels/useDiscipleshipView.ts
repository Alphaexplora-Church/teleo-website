import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { DiscipleshipTab } from "../components/GroupsTabSwitcher";
import {
  createPendingApplicationMock,
  mockDiscipleshipDashboard,
  type DiscipleshipDashboardMock,
} from "../models/mocks/discipleshipDashboard.mocks";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";

export type DiscipleshipViewMode =
  | "dashboard"
  | "church-list"
  | "church-intro"
  | "church-apply"
  | "application-status"
  | "group-active"
  | "lead-group-card";

export interface UseDiscipleshipViewOptions {
  initialDashboardData?: DiscipleshipDashboardMock;
  initialTab?: DiscipleshipTab;
}

export function useDiscipleshipView(options?: UseDiscipleshipViewOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<DiscipleshipTab>(
    options?.initialTab ?? "my-discipleship"
  );

  const [dashboardData, setDashboardData] = useState<DiscipleshipDashboardMock>(
    () => options?.initialDashboardData ?? mockDiscipleshipDashboard
  );

  const isInitialChurchList =
    location.pathname.startsWith("/discipleship/church") ||
    location.pathname.startsWith("/discipleship/process");

  const [viewMode, setViewMode] = useState<DiscipleshipViewMode>(
    isInitialChurchList ? "church-list" : "dashboard"
  );

  const [selectedChurchId, setSelectedChurchId] = useState<number | undefined>(undefined);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | undefined>(undefined);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [selectedLeadGroupId, setSelectedLeadGroupId] = useState<string | undefined>(undefined);

  // Sync with route changes (e.g., when clicking Join a Discipleship / More Churches links)
  useEffect(() => {
    if (
      location.pathname.startsWith("/discipleship/church") ||
      location.pathname.startsWith("/discipleship/process")
    ) {
      setViewMode("church-list");
    }
  }, [location.pathname]);

  // Prevent browser history navigation from retaining stale scroll offsets
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // ── Scroll to Top Handler ────────────────────────────────────
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollIntoView?.({ behavior: "instant", block: "start" });
    }

    let parent = containerRef.current?.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflowY === "auto" ||
        style.overflowY === "scroll" ||
        parent.id === "dashboard-content-area"
      ) {
        parent.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
        parent.scrollTop = 0;
      }
      parent = parent.parentElement;
    }

    const dashboardArea = document.getElementById("dashboard-content-area");
    if (dashboardArea) {
      dashboardArea.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
      dashboardArea.scrollTop = 0;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, []);

  // ── Scroll to Top on View Switch ─────────────────────────────
  useLayoutEffect(() => {
    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [viewMode, selectedChurchId, selectedLeadGroupId, activeTab, location.pathname, scrollToTop]);

  useEffect(() => {
    scrollToTop();
  }, [viewMode, selectedChurchId, selectedLeadGroupId, activeTab, location.pathname, scrollToTop]);

  // ── Navigation & Action Handlers ─────────────────────────────
  const handleSelectChurch = useCallback((church: DiscipleshipChurch) => {
    setSelectedChurchId(church.church_id);
    setViewMode("church-intro");
    scrollToTop();
  }, [scrollToTop]);

  const handleNavigateToChurchList = useCallback(() => {
    setViewMode("church-list");
    scrollToTop();
  }, [scrollToTop]);

  const handleBackToDashboard = useCallback(() => {
    setViewMode("dashboard");
    scrollToTop();
  }, [scrollToTop]);

  const handleBackToChurchList = useCallback(() => {
    setViewMode("church-list");
    scrollToTop();
  }, [scrollToTop]);

  const handleBackToIntro = useCallback(() => {
    setViewMode("church-intro");
    scrollToTop();
  }, [scrollToTop]);

  const handleApply = useCallback(() => {
    setViewMode("church-apply");
    scrollToTop();
  }, [scrollToTop]);

  const handleSubmitApplication = useCallback((answers: Record<string, string> = {}) => {
    const newApp = createPendingApplicationMock(selectedChurchId ?? 101, answers);
    setDashboardData((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications],
    }));
    setViewMode("dashboard");
    scrollToTop();
  }, [selectedChurchId, scrollToTop]);

  const handleTrackApplication = useCallback((applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setViewMode("application-status");
    scrollToTop();
  }, [scrollToTop]);

  const handleWithdrawApplication = useCallback((applicationId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      applications: prev.applications.filter((app) => app.id !== applicationId),
    }));
    setViewMode("dashboard");
    scrollToTop();
  }, [scrollToTop]);

  const handleResumeGroup = useCallback((groupId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId ? { ...g, status: "active" } : g
      ),
    }));
    setSelectedGroupId(groupId);
    setViewMode("group-active");
    scrollToTop();
  }, [scrollToTop]);

  const handleOpenGroupRoom = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
    setViewMode("group-active");
    scrollToTop();
  }, [scrollToTop]);

  const handleLeaveGroup = useCallback((groupId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      groups: prev.groups.filter((g) => g.id !== groupId),
    }));
    setViewMode("dashboard");
    scrollToTop();
  }, [scrollToTop]);

  const handlePauseMembership = useCallback((groupId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId ? { ...g, status: "paused" } : g
      ),
    }));
    setViewMode("dashboard");
    scrollToTop();
  }, [scrollToTop]);

  const handleManageLeadGroup = useCallback((groupId: string) => {
    setSelectedLeadGroupId(groupId);
    setViewMode("lead-group-card");
    scrollToTop();
  }, [scrollToTop]);

  const handleBackFromLeadGroup = useCallback(() => {
    setViewMode("dashboard");
    setSelectedLeadGroupId(undefined);
    scrollToTop();
  }, [scrollToTop]);

  const handleTabChange = useCallback((tab: DiscipleshipTab) => {
    setActiveTab(tab);
    scrollToTop();
  }, [scrollToTop]);

  return {
    containerRef,
    activeTab,
    setActiveTab: handleTabChange,
    viewMode,
    selectedChurchId,
    selectedApplicationId,
    selectedGroupId,
    selectedLeadGroupId,
    dashboardData,
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
    scrollToTop,
  };
}
