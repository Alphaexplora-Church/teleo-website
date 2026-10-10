import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Badge } from "../../../shared/components/Badge/Badge";
import { Button } from "../../../shared/components/Button/Button";
import {
  mockDiscipleshipJourneyModules,
  type JourneyStudyModule,
} from "../models/mocks/discipleshipJourneyModules.mocks";
import {
  journeyModuleListModalConst,
} from "../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import type { JourneyModuleListModalConfig } from "../models/types/myDiscipleshipGroupsLeadCardView.types";

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
  // Find current module ID from ID prop or by matching title
  const resolvedCurrentModuleId = React.useMemo(() => {
    if (currentModuleId) return currentModuleId;
    if (currentModuleTitle) {
      const match = modules.find(
        (m) => m.title.toLowerCase() === currentModuleTitle.toLowerCase()
      );
      if (match) return match.id;
    }
    return modules[0]?.id ?? "";
  }, [currentModuleId, currentModuleTitle, modules]);

  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    resolvedCurrentModuleId
  );

  // Swipe/drag-to-dismiss states
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef(0);

  // Sync selection with current module when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedModuleId(resolvedCurrentModuleId);
      setDragOffsetY(0);
      setIsDragging(false);
    }
  }, [isOpen, resolvedCurrentModuleId]);

  // Lock background scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Keyboard accessibility: dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Touch swipe-down to dismiss handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (dragOffsetY > 70) {
      onClose();
    } else {
      setDragOffsetY(0);
    }
  }, [dragOffsetY, onClose]);

  const handleUpdate = () => {
    const chosen = modules.find((m) => m.id === selectedModuleId);
    if (chosen) {
      onUpdateModule?.(chosen);
    }
    onClose();
  };

  if (!isOpen) return null;

  const SubmitArrowIcon = config.icons?.submitArrow;
  const CheckIcon = config.icons?.check;

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform:
            dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
          transition: isDragging
            ? "none"
            : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl
          flex flex-col space-y-5 select-none animate-in slide-in-from-bottom duration-300 max-h-[92dvh] overflow-y-auto
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-module-list-modal-title"
      >
        {/* Pull / Drag Handle Bar */}
        <div
          className="w-10 h-1 rounded-full bg-slate-300 shrink-0 cursor-grab mx-auto hover:bg-slate-400 transition-colors"
          aria-hidden="true"
        />

        {/* ── Header Title (No X button, no group subtitle) ─────── */}
        <div className="pt-1">
          <h2
            id="journey-module-list-modal-title"
            className="text-[20px] font-bold text-[#0E172A] tracking-tight leading-tight"
          >
            {config.title}
          </h2>
        </div>

        {/* ── Journey Modules Selection List ────────────────────── */}
        <div
          className="space-y-3"
          role="radiogroup"
          aria-labelledby="journey-module-list-modal-title"
        >
          {modules.map((module) => {
            const isSelected = selectedModuleId === module.id;
            const isCurrent = module.id === resolvedCurrentModuleId;

            return (
              <button
                key={module.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedModuleId(module.id)}
                className={`
                  w-full text-left rounded-2xl p-4.5 transition-all cursor-pointer select-none
                  ${
                    isSelected
                      ? "bg-white border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-500/10"
                      : "bg-[#F8FAFC] hover:bg-slate-100/80 border border-slate-200/80"
                  }
                `.trim()}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[16px] text-[#0E172A] leading-tight">
                        {module.title}
                      </span>
                      {isCurrent && (
                        <Badge
                          label={config.currentBadgeLabel}
                          variant="success"
                          dotVisible={false}
                          size="sm"
                          className="font-semibold text-[11px] px-2.5 py-0.5 tracking-wide uppercase shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-[12.5px] font-medium text-slate-500">
                      {module.module_badge}
                    </p>
                  </div>

                  {/* Green Check Indicator or Unselected Gray Circle */}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      {CheckIcon && <CheckIcon className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E2E8F0]/80 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Action Buttons ────────────────────────────────────── */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleUpdate}
            className="text-white rounded-2xl font-semibold text-[15px] shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>{config.updateButtonLabel}</span>
            {SubmitArrowIcon && <SubmitArrowIcon className="w-4 h-4" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClose}
            className="text-[#62718A] hover:text-[#0E172A] font-medium text-[14px]"
          >
            {config.cancelButtonLabel}
          </Button>
        </div>

        {/* Mobile bottom indicator pill */}
        <div className="w-28 h-1 bg-slate-300/60 rounded-full mx-auto select-none mt-1" />
      </div>
    </div>,
    document.body
  );
}

export default JourneyModuleListModal;