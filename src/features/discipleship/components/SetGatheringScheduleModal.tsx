import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../shared/components/Button/Button";
import { ActionConfirmationModal } from "./ActionConfirmationModal";
import { setGatheringScheduleModalConst } from "../models/constants/myDiscipleshipGroupsLeadCardView.constant";
import type {
    MeetingFormat,
    DayOfWeek,
    RecurrenceType,
    GatheringScheduleFormData,
    SetGatheringScheduleModalConfig,
    SetGatheringScheduleModalProps,
} from "../models/types/myDiscipleshipGroupsLeadCardView.types";
import { useGatheringScheduleForm } from "../viewmodels/useGatheringScheduleForm";

export type {
    MeetingFormat,
    DayOfWeek,
    RecurrenceType,
    GatheringScheduleFormData,
    SetGatheringScheduleModalConfig,
    SetGatheringScheduleModalProps,
};

interface RollerColumnProps {
    items: string[];
    selectedValue: string;
    onSelect: (val: string) => void;
    className?: string;
}

/** Scrollable / interactive vertical wheel column */
function RollerColumn({
    items,
    selectedValue,
    onSelect,
    className = "",
}: RollerColumnProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ITEM_HEIGHT = 38; // px
    const isProgrammaticRef = useRef(true);
    const lastSelectedValueRef = useRef(selectedValue);

    const initialSelectedValueRef = useRef(selectedValue);
    const itemsRef = useRef(items);

    // Initial positioning on mount:
    // Jump directly to dynamic current time without smooth scrolling from 0 or false triggering
    useEffect(() => {
        isProgrammaticRef.current = true;
        const index = itemsRef.current.indexOf(initialSelectedValueRef.current);
        if (index !== -1 && containerRef.current) {
            const targetTop = index * ITEM_HEIGHT;
            containerRef.current.scrollTop = targetTop;
        }

        const frameId = requestAnimationFrame(() => {
            const targetIndex = itemsRef.current.indexOf(initialSelectedValueRef.current);
            if (targetIndex !== -1 && containerRef.current) {
                containerRef.current.scrollTop = targetIndex * ITEM_HEIGHT;
            }
        });

        const timer = window.setTimeout(() => {
            isProgrammaticRef.current = false;
        }, 150);

        return () => {
            cancelAnimationFrame(frameId);
            window.clearTimeout(timer);
        };
    }, []);

    // Sync external changes to selectedValue (e.g. form reset or prop update)
    useEffect(() => {
        if (selectedValue !== lastSelectedValueRef.current) {
            lastSelectedValueRef.current = selectedValue;
            const index = items.indexOf(selectedValue);
            if (index !== -1 && containerRef.current) {
                const targetTop = index * ITEM_HEIGHT;
                if (Math.abs(containerRef.current.scrollTop - targetTop) > 2) {
                    isProgrammaticRef.current = true;
                    containerRef.current.scrollTop = targetTop;
                    const timer = window.setTimeout(() => {
                        isProgrammaticRef.current = false;
                    }, 150);
                    return () => window.clearTimeout(timer);
                }
            }
        }
    }, [selectedValue, items]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isProgrammaticRef.current) return;

        const scrollTop = e.currentTarget.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
        const newItem = items[clampedIndex];
        if (newItem && newItem !== selectedValue) {
            lastSelectedValueRef.current = newItem;
            onSelect(newItem);
        }
    };

    const handleItemClick = (item: string, index: number) => {
        if (item === selectedValue) return;
        isProgrammaticRef.current = true;
        lastSelectedValueRef.current = item;
        onSelect(item);
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: "smooth",
            });
        }
        window.setTimeout(() => {
            isProgrammaticRef.current = false;
        }, 250);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`relative h-[170px] overflow-y-auto snap-y snap-mandatory select-none ${className}`}
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingTop: "66px", // (170 - 38) / 2
                paddingBottom: "66px",
            }}
        >
            {items.map((item, idx) => {
                const isSelected = item === selectedValue;
                return (
                    <div
                        key={item}
                        onClick={() => handleItemClick(item, idx)}
                        className={`
              h-[38px] snap-center flex items-center justify-center cursor-pointer transition-all
              ${isSelected
                                ? "text-[22px] font-bold text-[#0E172A]"
                                : "text-[16px] font-semibold text-[#62718A]/40 hover:text-[#0E172A]"
                            }
            `.trim()}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}

export function SetGatheringScheduleModal({
    isOpen = true,
    mode = "create",
    config: userConfig,
    onClose,
    onSave,
    onRemoveSchedule,
    initialData,
    className = "",
}: SetGatheringScheduleModalProps) {
    const config = {
        ...setGatheringScheduleModalConst,
        ...userConfig,
        icons: {
            ...setGatheringScheduleModalConst.icons,
            ...userConfig?.icons,
        },
    };

    // Mode-specific texts and icons
    const isEditMode = mode === "edit";
    const modalTitle = isEditMode ? config.editTitle : config.title;
    const modalSubtitle = isEditMode ? config.editSubtitle : config.subtitle;
    const saveButtonLabel = isEditMode ? config.saveChangesButtonLabel : config.saveButtonLabel;

    // Icons from model/constant layer
    const PhysicalIcon = config.icons.physical;
    const VirtualIcon = config.icons.virtual;
    const HybridIcon = config.icons.hybrid;
    const ChevronDownIcon = config.icons.chevronDown;
    const ChevronUpIcon = config.icons.chevronUp;
    const ClockIcon = config.icons.clock;
    const LocationIcon = config.icons.location;
    const CalendarIcon = config.icons.calendar;
    const CheckIcon = config.icons.check;
    const TrashIcon = config.icons.trash;
    const SaveButtonIcon = isEditMode ? CheckIcon : CalendarIcon;

    const {
        format,
        setFormat,
        dayOfWeek,
        setDayOfWeek,
        recurrence,
        setRecurrence,
        location,
        setLocation,
        virtualLink,
        setVirtualLink,
        selectedHour,
        setSelectedHour,
        selectedMinute,
        setSelectedMinute,
        selectedPeriod,
        setSelectedPeriod,
        isTimePickerOpen,
        setIsTimePickerOpen,
        currentFormattedTime,
        isConfirmRemoveOpen,
        handleRemoveClick,
        handleConfirmRemove,
        handleCancelRemove,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        sheetStyle,
        isFormValid,
        handleSave,
    } = useGatheringScheduleForm({
        isOpen,
        initialData,
        defaultRecurrence: config.recurrenceOptions[0] ?? "Weekly",
        onSave,
        onClose,
        onRemoveSchedule,
    });

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex flex-col justify-end">
            {/* ── Background Blur Backdrop (Tap to Auto-Close) ──────── */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                onTouchMove={(e) => e.preventDefault()}
                aria-hidden="true"
            />

            {/* ── Bottom Sheet Modal Container (Slide-down dismissable) ─ */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={sheetStyle}
                className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl
          flex flex-col space-y-5 select-none animate-in slide-in-from-bottom duration-300 max-h-[92dvh] overflow-y-auto
          ${className}
        `.trim()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="gathering-schedule-title"
            >
                {/* Pull / Drag Handle Bar */}
                <div
                    className="w-10 h-1 rounded-full bg-slate-300 shrink-0 cursor-grab mx-auto hover:bg-slate-400 transition-colors"
                    aria-hidden="true"
                />

                {/* ── Title & Subtitle ─────────────────────────────────── */}
                <div className="space-y-1 pt-1">
                    <h2
                        id="gathering-schedule-title"
                        className="text-[22px] font-bold text-[#0E172A] tracking-tight leading-tight"
                    >
                        {modalTitle}
                    </h2>
                    <p className="text-[13.5px] text-[#62718A] leading-normal">
                        {modalSubtitle}
                    </p>
                </div>

                {/* ── Meeting Format Segmented Tabs ────────────────────── */}
                <div className="space-y-2">
                    <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                        {config.meetingFormatLabel}
                    </span>
                    <div className="grid grid-cols-3 bg-[#F1F3F6] p-1 rounded-2xl gap-1">
                        {/* Physical Option */}
                        <button
                            type="button"
                            onClick={() => setFormat("physical")}
                            className={`
                flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[13px] transition-all cursor-pointer border-none
                ${format === "physical"
                                    ? "bg-white text-[#0E172A] font-semibold shadow-xs"
                                    : "bg-transparent text-[#62718A] font-medium hover:text-[#0E172A]"
                                }
              `.trim()}
                        >
                            {PhysicalIcon && <PhysicalIcon className="w-4 h-4 shrink-0" />}
                            <span>{config.formatPhysicalLabel}</span>
                        </button>

                        {/* Virtual Option */}
                        <button
                            type="button"
                            onClick={() => setFormat("virtual")}
                            className={`
                flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[13px] transition-all cursor-pointer border-none
                ${format === "virtual"
                                    ? "bg-white text-[#0E172A] font-semibold shadow-xs"
                                    : "bg-transparent text-[#62718A] font-medium hover:text-[#0E172A]"
                                }
              `.trim()}
                        >
                            {VirtualIcon && <VirtualIcon className="w-4 h-4 shrink-0" />}
                            <span>{config.formatVirtualLabel}</span>
                        </button>

                        {/* Hybrid Option */}
                        <button
                            type="button"
                            onClick={() => setFormat("hybrid")}
                            className={`
                flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[13px] transition-all cursor-pointer border-none
                ${format === "hybrid"
                                    ? "bg-white text-[#0E172A] font-semibold shadow-xs"
                                    : "bg-transparent text-[#62718A] font-medium hover:text-[#0E172A]"
                                }
              `.trim()}
                        >
                            {HybridIcon && <HybridIcon className="w-4 h-4 shrink-0" />}
                            <span>{config.formatHybridLabel}</span>
                        </button>
                    </div>
                </div>

                {/* ── Day of Week & Recurrence Row ─────────────────────── */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Day of Week */}
                    <div className="space-y-2">
                        <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                            {config.dayOfWeekLabel}
                            <span className="text-red-500 ml-1 select-none" aria-hidden="true">*</span>
                        </span>
                        <div className="relative bg-[#F1F3F6] rounded-2xl px-4 py-3 flex items-center justify-between">
                            <span
                                className={`text-[14px] truncate ${dayOfWeek ? "text-[#0E172A] font-medium" : "text-[#62718A]"
                                    }`}
                            >
                                {dayOfWeek || config.dayOfWeekPlaceholder}
                            </span>
                            {ChevronDownIcon && (
                                <ChevronDownIcon className="w-4 h-4 text-[#62718A] shrink-0 pointer-events-none" />
                            )}
                            <select
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                                aria-label={config.dayOfWeekLabel}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base"
                            >
                                <option value="" disabled>
                                    {config.dayOfWeekPlaceholder}
                                </option>
                                {config.dayOptions.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Recurrence */}
                    <div className="space-y-2">
                        <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                            {config.recurrenceLabel}
                        </span>
                        <div className="relative bg-[#F1F3F6] rounded-2xl px-4 py-3 flex items-center justify-between">
                            <span className="text-[14px] text-[#0E172A] font-medium truncate">
                                {recurrence}
                            </span>
                            {ChevronDownIcon && (
                                <ChevronDownIcon className="w-4 h-4 text-[#62718A] shrink-0 pointer-events-none" />
                            )}
                            <select
                                value={recurrence}
                                onChange={(e) => setRecurrence(e.target.value)}
                                aria-label={config.recurrenceLabel}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base"
                            >
                                {config.recurrenceOptions.map((rec) => (
                                    <option key={rec} value={rec}>
                                        {rec}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Dynamic Gathering Time Picker Section ────────────── */}
                <div className="space-y-2">
                    {/* Header Row: GATHERING TIME & Editing label */}
                    <div className="flex items-center justify-between">
                        <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                            {config.gatheringTimeLabel}
                            <span className="text-red-500 ml-1 select-none" aria-hidden="true">*</span>
                        </span>
                        {isTimePickerOpen && (
                            <span className="text-[11px] font-semibold text-[#0E172A]">
                                {config.editingLabel}
                            </span>
                        )}
                    </div>

                    {/* Trigger Box (Editing mode has black border) */}
                    <button
                        type="button"
                        onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                        className={`
              w-full px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all border
              ${isTimePickerOpen
                                ? "border-2 border-black bg-white shadow-xs"
                                : "border-transparent bg-[#F1F3F6] hover:border-slate-300"
                            }
            `.trim()}
                        aria-expanded={isTimePickerOpen}
                        aria-label={config.gatheringTimeLabel}
                    >
                        <div className="flex items-center gap-2.5">
                            {ClockIcon && (
                                <ClockIcon
                                    className={`w-5 h-5 shrink-0 ${isTimePickerOpen ? "text-black" : "text-[#62718A]"
                                        }`}
                                />
                            )}
                            <span
                                className={`tracking-wider ${isTimePickerOpen
                                        ? "text-lg font-bold text-[#0E172A]"
                                        : "text-[15px] font-semibold text-[#0E172A]"
                                    }`}
                            >
                                {currentFormattedTime}
                            </span>
                        </div>

                        {isTimePickerOpen ? (
                            ChevronUpIcon && (
                                <ChevronUpIcon className="w-4 h-4 text-black shrink-0" />
                            )
                        ) : (
                            ChevronDownIcon && (
                                <ChevronDownIcon className="w-4 h-4 text-[#62718A] shrink-0" />
                            )
                        )}
                    </button>

                    {/* Expanded Time Wheel / Roller Picker Card */}
                    {isTimePickerOpen && (
                        <div className="bg-[#F1F3F6] rounded-2xl p-4 space-y-2 animate-in fade-in duration-200">
                            {/* Header inside picker: SELECT TIME & Done button */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                                    {config.selectTimeLabel}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsTimePickerOpen(false)}
                                    className="bg-black hover:bg-slate-900 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-all shadow-xs border-none"
                                >
                                    {config.doneButtonLabel}
                                </button>
                            </div>

                            {/* 3-Column Roller Grid with Center White Pill */}
                            <div className="relative h-[170px] grid grid-cols-3">
                                {/* Center White Highlight Bar */}
                                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[42px] bg-white rounded-xl shadow-xs pointer-events-none" />

                                {/* Hours Column */}
                                <RollerColumn
                                    items={config.hours}
                                    selectedValue={selectedHour}
                                    onSelect={setSelectedHour}
                                />

                                {/* Minutes Column */}
                                <RollerColumn
                                    items={config.minutes}
                                    selectedValue={selectedMinute}
                                    onSelect={setSelectedMinute}
                                />

                                {/* AM/PM Period Column */}
                                <RollerColumn
                                    items={config.periods}
                                    selectedValue={selectedPeriod}
                                    onSelect={(val) => setSelectedPeriod(val as "AM" | "PM")}
                                />

                                {/* Top and Bottom Gradient Fade Masks */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F1F3F6] via-[#F1F3F6]/70 to-transparent z-10" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F1F3F6] via-[#F1F3F6]/70 to-transparent z-10" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Conditional Location & Virtual Link Inputs ─────────── */}
                {/* Physical or Hybrid: Show Meeting Location */}
                {(format === "physical" || format === "hybrid") && (
                    <div className="space-y-2">
                        <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                            {config.meetingLocationLabel}
                            {format === "physical" && (
                                <span className="text-red-500 ml-1 select-none" aria-hidden="true">*</span>
                            )}
                        </span>
                        <div className="bg-[#F1F3F6] rounded-2xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-300 transition-all">
                            {LocationIcon && (
                                <LocationIcon className="w-4 h-4 text-[#62718A] shrink-0" />
                            )}
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={config.meetingLocationPlaceholder}
                                className="w-full bg-transparent border-none outline-none text-[14px] text-[#0E172A] placeholder-[#94A3B8]"
                            />
                        </div>
                    </div>
                )}

                {/* Virtual or Hybrid: Show Meeting Link */}
                {(format === "virtual" || format === "hybrid") && (
                    <div className="space-y-2">
                        <span className="block text-[11px] font-bold text-[#62718A] tracking-wider uppercase">
                            {config.meetingLinkLabel}
                            {format === "virtual" && (
                                <span className="text-red-500 ml-1 select-none" aria-hidden="true">*</span>
                            )}
                        </span>
                        <div className="bg-[#F1F3F6] rounded-2xl px-4 py-3 flex items-center gap-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-300 transition-all">
                            {VirtualIcon && (
                                <VirtualIcon className="w-4 h-4 text-[#62718A] shrink-0" />
                            )}
                            <input
                                type="url"
                                value={virtualLink}
                                onChange={(e) => setVirtualLink(e.target.value)}
                                placeholder={config.meetingLinkPlaceholder}
                                className="w-full bg-transparent border-none outline-none text-[14px] text-[#0E172A] placeholder-[#94A3B8]"
                            />
                        </div>
                    </div>
                )}

                {/* ── Action Buttons (Using shared Button component) ────── */}
                <div className="space-y-2 pt-2">
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!isFormValid}
                        onClick={handleSave}
                        className="text-white rounded-2xl gap-2 font-semibold text-[15px] shadow-sm active:scale-[0.99]"
                    >
                        {SaveButtonIcon && (
                            <SaveButtonIcon className="w-4 h-4 shrink-0 text-white" />
                        )}
                        <span>{saveButtonLabel}</span>
                    </Button>

                    {/* Remove Schedule button in Edit mode */}
                    {isEditMode && onRemoveSchedule && (
                        <button
                            type="button"
                            onClick={handleRemoveClick}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-red-600 hover:text-red-700 font-semibold text-[14px] transition-colors cursor-pointer border-none bg-transparent select-none active:scale-[0.99]"
                        >
                            {TrashIcon && (
                                <TrashIcon className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                            <span>{config.removeScheduleButtonLabel}</span>
                        </button>
                    )}

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

            {/* ── Remove Schedule Confirmation Modal ──────────────── */}
            <ActionConfirmationModal
                isOpen={isConfirmRemoveOpen}
                onClose={handleCancelRemove}
                title={config.removeScheduleConfirmTitle}
                description={config.removeScheduleConfirmDescription}
                confirmLabel={config.removeScheduleConfirmLabel}
                cancelLabel={config.cancelButtonLabel}
                confirmVariant="danger"
                icon={
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-rose-500">
                        {TrashIcon ? (
                            <TrashIcon className="w-6 h-6 text-red-600" />
                        ) : undefined}
                    </div>
                }
                onConfirm={handleConfirmRemove}
            />
        </div>,
        document.body
    );
}

export default SetGatheringScheduleModal;