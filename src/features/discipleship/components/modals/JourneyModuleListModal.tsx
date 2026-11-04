import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { Badge } from "../../../../shared/components/Badge/Badge";
import { Button } from "../../../../shared/components/Button/Button";
import {
  mockDiscipleshipJourneyModules,
  type JourneyStudyModule,
} from "../../models/mocks/discipleshipJourneyModules.mocks";
import {
  journeyModuleListModalConst,
} from "../../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import type { JourneyModuleListModalConfig } from "../../models/types/myDiscipleshipGroupsLeadCardView.types";
import { useSwipeDownDismiss } from "../../viewmodels/useSwipeDownDismiss";

export type { JourneyStudyModule };

export interface JourneyModuleListModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback fired to close / dismiss the modal */
  onClose: () => void;
  /** Callback fired when a new module is confirmed and submitted */
  onUpdateModule?: (module: JourneyStudyModule) => void;
  /** Current active module ID or title to display 'Current' badge */
  currentModuleId?: string;
  currentModuleTitle?: string;
  /** List of selectable journey modules (defaults to mock modules) */
  modules?: JourneyStudyModule[];
  /** UI text configuration */
  config?: JourneyModuleListModalConfig;
  /** Optional custom CSS classes for the modal sheet */
  className?: string;
}

export function JourneyModuleListModal({
  isOpen,
  onClose,
  onUpdateModule,
  currentModuleId,
  currentModuleTitle,
  modules = mockDiscipleshipJourneyModules,
  config = journeyModuleListModalConst,
  className = "",
}: JourneyModuleListModalProps) {
  // Find current active module by ID or title match
  const resolvedCurrentModule = useMemo(() => {
    if (currentModuleId) {
      const match = modules.find((m) => m.id === currentModuleId);
      if (match) return match;
    }
    if (currentModuleTitle) {
      const match = modules.find(
        (m) => m.title.toLowerCase() === currentModuleTitle.toLowerCase()
      );
      if (match) return match;
    }
    return modules[0];
  }, [currentModuleId, currentModuleTitle, modules]);

  // Sort modules by module number (Module 1 -> 7)
  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => {
      const numA =
        a.module_number ??
        parseInt(a.module_badge.replace(/\D/g, "") || "0", 10);
      const numB =
        b.module_number ??
        parseInt(b.module_badge.replace(/\D/g, "") || "0", 10);
      return numA - numB;
    });
  }, [modules]);

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    resolvedCurrentModule?.id ?? ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
  } = useSwipeDownDismiss({
    isOpen,
    onClose,
  });

  // Sync selection and reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedModuleId(resolvedCurrentModule?.id ?? "");
      setSearchQuery("");
    }
  }, [isOpen, resolvedCurrentModule]);

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return sortedModules;
    const q = searchQuery.toLowerCase().trim();
    return sortedModules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.module_badge.toLowerCase().includes(q) ||
        (m.sessions && m.sessions.toLowerCase().includes(q)) ||
        m.description.toLowerCase().includes(q)
    );
  }, [sortedModules, searchQuery]);

  // Whether current active study matches search
  const isCurrentActiveMatchingSearch = useMemo(() => {
    if (!resolvedCurrentModule) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      resolvedCurrentModule.title.toLowerCase().includes(q) ||
      resolvedCurrentModule.module_badge.toLowerCase().includes(q) ||
      (resolvedCurrentModule.sessions &&
        resolvedCurrentModule.sessions.toLowerCase().includes(q))
    );
  }, [resolvedCurrentModule, searchQuery]);

  // Available curricula excluding current active study
  const availableCurricula = useMemo(() => {
    return filteredModules.filter((m) => m.id !== resolvedCurrentModule?.id);
  }, [filteredModules, resolvedCurrentModule]);

  const handleUpdate = () => {
    const chosen = modules.find((m) => m.id === selectedModuleId);
    if (chosen) {
      onUpdateModule?.(chosen);
    }
    onClose();
  };

  if (!isOpen) return null;

  const SubmitArrowIcon = config.icons?.submitArrow ?? ArrowRight;
  const SearchIcon = config.icons?.search ?? Search;
  const CloseIcon = config.icons?.close ?? X;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* ── Background Blur Backdrop (Tap to Dismiss) ─────────── */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* ── Bottom Sheet Container ────────────────────────────── */}
      <div
        style={sheetStyle}
        className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[32px] shadow-2xl
          flex flex-col max-h-[90dvh] overflow-hidden select-none animate-in slide-in-from-bottom duration-300
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-module-list-modal-title"
      >
        {/* Pull / Drag Handle Bar Area (Touch swipe down to dismiss ONLY from here) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="pt-3.5 pb-2 shrink-0 bg-white cursor-grab active:cursor-grabbing touch-none select-none"
          aria-hidden="true"
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 shrink-0 mx-auto hover:bg-slate-400 transition-colors" />
        </div>

        {/* ── Scrollable Body Area (Title, search, and modules all scroll together) ── */}
        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-5 space-y-4.5 min-h-0 overscroll-contain">
          {/* Modal Title (Part of scrollable content, not a fixed header) */}
          <div className="pt-1">
            <h2
              id="journey-module-list-modal-title"
              className="text-[20px] font-bold text-[#0E172A] tracking-tight leading-tight"
            >
              {config.title}
            </h2>
          </div>

          {/* 🔍 Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                config.searchPlaceholder ?? "Search study by title or module..."
              }
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ── CURRENT ACTIVE STUDY ──────────────────────────────── */}
          {resolvedCurrentModule && isCurrentActiveMatchingSearch && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                {config.activeStudyHeader ?? "CURRENT ACTIVE STUDY"}
              </h3>

              <button
                type="button"
                onClick={() => setSelectedModuleId(resolvedCurrentModule.id)}
                className={`
                  w-full text-left rounded-2xl p-3.5 transition-all cursor-pointer select-none border
                  flex items-center justify-between gap-3
                  ${
                    selectedModuleId === resolvedCurrentModule.id
                      ? "border-emerald-500 bg-white shadow-xs ring-2 ring-emerald-500/10"
                      : "border-slate-200/90 bg-white hover:bg-slate-50/70"
                  }
                `.trim()}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Left Side: Gray image box placeholder (no emoji, no icon) */}
                  <div
                    className="w-14 h-14 rounded-xl bg-slate-200 shrink-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    {resolvedCurrentModule.image_url && (
                      <img
                        src={resolvedCurrentModule.image_url}
                        alt={resolvedCurrentModule.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Study Details */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="font-bold text-[14.5px] text-slate-900 leading-snug truncate">
                      {resolvedCurrentModule.title}
                    </h4>
                    <p className="text-[12px] font-medium text-slate-500 truncate">
                      {resolvedCurrentModule.module_badge}
                      {resolvedCurrentModule.sessions
                        ? ` · ${resolvedCurrentModule.sessions}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Right Side: Green Active Badge */}
                <Badge
                  label={config.currentBadgeLabel ?? "ACTIVE"}
                  variant="success"
                  size="sm"
                  dotVisible={false}
                  className="font-bold text-[10.5px] tracking-wider px-2.5 py-0.5 rounded-full shrink-0"
                />
              </button>
            </div>
          )}

          {/* ── AVAILABLE CURRICULA ──────────────────────────────── */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
              {config.availableCurriculaHeader ?? "AVAILABLE CURRICULA"}
            </h3>

            {availableCurricula.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-sm">
                No curricula found matching "{searchQuery}"
              </div>
            ) : (
              <div
                className="space-y-2.5"
                role="radiogroup"
                aria-label="Available Curricula"
              >
                {availableCurricula.map((module) => {
                  const isSelected = selectedModuleId === module.id;

                  return (
                    <button
                      key={module.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedModuleId(module.id)}
                      className={`
                        w-full text-left rounded-2xl p-3.5 transition-all cursor-pointer select-none border
                        flex items-center justify-between gap-3
                        ${
                          isSelected
                            ? "border-emerald-500 bg-white shadow-xs ring-2 ring-emerald-500/10"
                            : "border-slate-200/90 bg-white hover:bg-slate-50/70"
                        }
                      `.trim()}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Left Side: Gray image box placeholder (no emoji, no icon) */}
                        <div
                          className="w-14 h-14 rounded-xl bg-slate-200 shrink-0 overflow-hidden"
                          aria-hidden="true"
                        >
                          {module.image_url && (
                            <img
                              src={module.image_url}
                              alt={module.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Middle Info */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block">
                            {module.module_badge.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-[14.5px] text-slate-900 leading-snug truncate">
                            {module.title}
                          </h4>
                          <p className="text-[12px] text-slate-500 truncate">
                            {module.sessions ?? module.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Radio Indicator */}
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Fixed Footer Buttons (Update & Cancel) ─────────────── */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-6 pt-3.5 pb-6 space-y-2 shadow-xs">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleUpdate}
            className="text-white rounded-2xl font-semibold text-[15px] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{config.updateButtonLabel}</span>
            {SubmitArrowIcon && <SubmitArrowIcon className="w-4 h-4" />}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-center text-[#62718A] hover:text-[#0E172A] font-medium text-[14px] transition-colors cursor-pointer border-none bg-transparent"
          >
            {config.cancelButtonLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default JourneyModuleListModal;