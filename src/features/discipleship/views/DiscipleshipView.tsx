import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GroupsTabSwitcher, type DiscipleshipTab } from "../components/GroupsTabSwitcher";
import { myDiscipleshipEmptyStateConst } from "../models/constants/myDiscipleshipEmptyState.constant";
import MyDiscipleshipView from "./MyDiscipleshipView/MyDiscipleshipView";
import MyDiscipleshipLeadView from "./MyDiscipleshipLeadView/MyDiscipleshipLeadView";
import DiscipleshipProcessChurchList from "./DiscipleshipProcess/DiscipleshipProcessChurchList";
import DiscipleshipProcessIntro from "./DiscipleshipProcess/DiscipleshipProcessIntro";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyState.types";

export type DiscipleshipViewMode = "dashboard" | "church-list" | "church-intro";

export function DiscipleshipView() {
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

  const handleSelectChurch = (church: DiscipleshipChurch) => {
    setSelectedChurchId(church.church_id);
    setViewMode("church-intro");
  };

  // ── 1. Church Intro Sub-View ─────────────────────────────────
  if (viewMode === "church-intro") {
    return (
      <DiscipleshipProcessIntro
        churchId={selectedChurchId}
        onBack={() => setViewMode("church-list")}
      />
    );
  }

  // ── 2. Church List Sub-View ──────────────────────────────────
  if (viewMode === "church-list") {
    return (
      <DiscipleshipProcessChurchList
        onBack={() => setViewMode("dashboard")}
        onSelectChurch={handleSelectChurch}
      />
    );
  }

  // ── 3. Main Groups Dashboard ─────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
          {myDiscipleshipEmptyStateConst.titleHeader}
        </h1>
      </div>

      {/* ── Tab Switcher ────────────────────────────────────────── */}
      <GroupsTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      {/* ── Dynamic Tab Content ─────────────────────────────────── */}
      {activeTab === "my-discipleship" ? (
        <MyDiscipleshipView
          onSelectChurch={handleSelectChurch}
          onNavigateToChurchList={() => setViewMode("church-list")}
        />
      ) : (
        <MyDiscipleshipLeadView />
      )}
    </div>
  );
}

export default DiscipleshipView;
