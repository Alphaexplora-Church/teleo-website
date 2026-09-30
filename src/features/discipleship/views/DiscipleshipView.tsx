import { useState } from "react";
import { GroupsTabSwitcher, type DiscipleshipTab } from "../components/GroupsTabSwitcher";
import { myDiscipleshipEmptyStateConst } from "../models/myDiscipleshipEmptyState.constant";
import MyDiscipleshipView from "./MyDiscipleshipView/MyDiscipleshipView";
import MyDiscipleshipLeadView from "./MyDiscipleshipLeadView/MyDiscipleshipLeadView";

export function DiscipleshipView() {
  const [activeTab, setActiveTab] = useState<DiscipleshipTab>("my-discipleship");

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
        <MyDiscipleshipView />
      ) : (
        <MyDiscipleshipLeadView />
      )}
    </div>
  );
}

export default DiscipleshipView;
