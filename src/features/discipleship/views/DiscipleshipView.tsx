import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { GroupsTabSwitcher, type DiscipleshipTab } from "../components/GroupsTabSwitcher";
import { myDiscipleshipEmptyStateConst } from "../models/constants/myDiscipleshipEmptyState.constant";
import MyDiscipleshipView from "./MyDiscipleshipView/MyDiscipleshipView";
import MyDiscipleshipLeadView from "./MyDiscipleshipLeadView/MyDiscipleshipLeadView";
import DiscipleshipProcessChurchList from "./DiscipleshipProcess/DiscipleshipProcessChurchList";
import DiscipleshipProcessIntro from "./DiscipleshipProcess/DiscipleshipProcessIntro";
import DiscipleshipProcessChurchApply from "./DiscipleshipProcess/DiscipleshipProcessChurchApply";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyState.types";

export type DiscipleshipViewMode =
  | "dashboard"
  | "church-list"
  | "church-intro"
  | "church-apply";

export function DiscipleshipView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<DiscipleshipTab>("my-discipleship");

  const isInitialChurchList =
    location.pathname.startsWith("/discipleship/church") ||
    location.pathname.startsWith("/discipleship/process");

  const [viewMode, setViewMode] = useState<DiscipleshipViewMode>(
    isInitialChurchList ? "church-list" : "dashboard"
  );
  const [selectedChurchId, setSelectedChurchId] = useState<number | undefined>(undefined);

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
  // Targets the scrollable container (ref/overflow-y-auto parent), #dashboard-content-area, and window
  const scrollToTop = useCallback(() => {
    // 1. Direct containerRef scrolling if container itself has scroll
    if (containerRef.current) {
      containerRef.current.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollIntoView?.({ behavior: "instant", block: "start" });
    }

    // 2. Target scrollable container in DOM (inspecting overflow-y-auto / scrollable parents)
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

    // 3. Target #dashboard-content-area explicitly (AppShell main container)
    const dashboardArea = document.getElementById("dashboard-content-area");
    if (dashboardArea) {
      dashboardArea.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
      dashboardArea.scrollTop = 0;
    }

    // 4. Target window and root document scrolling
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, []);

  // ── Scroll to Top on View Switch ─────────────────────────────
  // Resets scrollable container and window instantly before/after DOM renders
  useLayoutEffect(() => {
    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 0);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [viewMode, selectedChurchId, activeTab, location.pathname, scrollToTop]);

  useEffect(() => {
    scrollToTop();
  }, [viewMode, selectedChurchId, activeTab, location.pathname, scrollToTop]);

  const handleSelectChurch = (church: DiscipleshipChurch) => {
    setSelectedChurchId(church.church_id);
    setViewMode("church-intro");
    scrollToTop();
  };

  const handleNavigateToChurchList = () => {
    setViewMode("church-list");
    scrollToTop();
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    scrollToTop();
  };

  const handleBackToChurchList = () => {
    setViewMode("church-list");
    scrollToTop();
  };

  const handleBackToIntro = () => {
    setViewMode("church-intro");
    scrollToTop();
  };

  const handleApply = () => {
    setViewMode("church-apply");
    scrollToTop();
  };

  const handleSubmitApplication = () => {
    setViewMode("dashboard");
    scrollToTop();
  };

  return (
    <div ref={containerRef} className="w-full">
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
          onBack={handleBackToDashboard}
          onSelectChurch={handleSelectChurch}
        />
      )}

      {/* ── 4. Main Groups Dashboard ───────────────────────────────── */}
      {viewMode === "dashboard" && (
        <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
              {myDiscipleshipEmptyStateConst.titleHeader}
            </h1>
          </div>

          {/* ── Tab Switcher ────────────────────────────────────────── */}
          <GroupsTabSwitcher
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              scrollToTop();
            }}
          />

          {/* ── Dynamic Tab Content ─────────────────────────────────── */}
          {activeTab === "my-discipleship" ? (
            <MyDiscipleshipView
              onSelectChurch={handleSelectChurch}
              onNavigateToChurchList={handleNavigateToChurchList}
            />
          ) : (
            <MyDiscipleshipLeadView />
          )}
        </div>
      )}
    </div>
  );
}

export default DiscipleshipView;

