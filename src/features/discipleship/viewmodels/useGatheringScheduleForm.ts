import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type {
  GatheringScheduleFormData,
  MeetingFormat,
} from "../models/types/myDiscipleshipGroupsLeadCardView.types";
import { useSwipeDownDismiss } from "./useSwipeDownDismiss";

/** Computes dynamic default time based on current system time */
export function getDynamicCurrentTime(): {
  hour: string;
  minute: string;
  period: "AM" | "PM";
  formatted: string;
} {
  const now = new Date();
  let hours = now.getHours();
  const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hour = hours.toString().padStart(2, "0");
  const minute = "00";

  return {
    hour,
    minute,
    period,
    formatted: `${hour} : ${minute} ${period}`,
  };
}

/** Parses string like "07 : 00 PM" or "7:00 PM" into components */
export function parseTimeString(timeStr?: string): {
  hour: string;
  minute: string;
  period: "AM" | "PM";
} {
  if (!timeStr) return getDynamicCurrentTime();

  const match = timeStr.trim().match(/^(\d{1,2})\s*[:.]\s*(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    const rawH = parseInt(match[1], 10);
    const h = (rawH > 12 ? rawH % 12 : rawH) || 12;
    const m = match[2];
    const p =
      (match[3]?.toUpperCase() as "AM" | "PM") ||
      (rawH >= 12 ? "PM" : "AM");
    return {
      hour: h.toString().padStart(2, "0"),
      minute: m,
      period: p,
    };
  }

  return getDynamicCurrentTime();
}

export interface UseGatheringScheduleFormOptions {
  isOpen?: boolean;
  initialData?: Partial<GatheringScheduleFormData>;
  defaultRecurrence?: string;
  onSave?: (data: GatheringScheduleFormData) => void;
  onClose?: () => void;
  onRemoveSchedule?: () => void;
}

export function useGatheringScheduleForm({
  isOpen = false,
  initialData,
  defaultRecurrence = "Weekly",
  onSave,
  onClose,
  onRemoveSchedule,
}: UseGatheringScheduleFormOptions = {}) {
  // Confirmation remove modal state
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

  // Form field state
  const [format, setFormat] = useState<MeetingFormat>(
    initialData?.format ?? "physical"
  );
  const [dayOfWeek, setDayOfWeek] = useState<string>(
    initialData?.dayOfWeek ?? ""
  );
  const [recurrence, setRecurrence] = useState<string>(
    initialData?.recurrence ?? defaultRecurrence
  );
  const [location, setLocation] = useState<string>(
    initialData?.location ?? ""
  );
  const [virtualLink, setVirtualLink] = useState<string>(
    initialData?.virtualLink ?? ""
  );

  // Dynamic time picker states
  const initialTime = parseTimeString(initialData?.startTime);
  const [selectedHour, setSelectedHour] = useState<string>(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState<string>(
    initialTime.minute
  );
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    initialTime.period
  );
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Current formatted time
  const currentFormattedTime = `${selectedHour} : ${selectedMinute}  ${selectedPeriod}`;

  // Drag-to-dismiss bottom sheet interaction via reusable hook
  const {
    dragOffsetY,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
  } = useSwipeDownDismiss({
    isOpen,
    onClose,
  });

  // Reset form data on open
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setFormat(initialData?.format ?? "physical");
      setDayOfWeek(initialData?.dayOfWeek ?? "");
      setRecurrence(initialData?.recurrence ?? defaultRecurrence);
      setLocation(initialData?.location ?? "");
      setVirtualLink(initialData?.virtualLink ?? "");
      const parsed = parseTimeString(initialData?.startTime);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedPeriod(parsed.period);
      setIsTimePickerOpen(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialData, defaultRecurrence]);

  // Form validation rules:
  // 1. Dropdown (dayOfWeek, recurrence) and Gathering Time are universally required.
  // 2. Physical: location input is required.
  // 3. Virtual: virtualLink input is required.
  // 4. Hybrid: inputs are optional (only dropdown and time required).
  const isBaseValid = Boolean(
    dayOfWeek?.trim() &&
    recurrence?.trim() &&
    selectedHour?.trim() &&
    selectedMinute?.trim() &&
    selectedPeriod?.trim()
  );

  const isFormatInputValid = useMemo(() => {
    if (format === "physical") return location.trim().length > 0;
    if (format === "virtual") return virtualLink.trim().length > 0;
    return true; // hybrid: inputs are optional
  }, [format, location, virtualLink]);

  const isFormValid = isBaseValid && isFormatInputValid;

  const handleRemoveClick = useCallback(() => {
    setIsConfirmRemoveOpen(true);
  }, []);

  const handleCancelRemove = useCallback(() => {
    setIsConfirmRemoveOpen(false);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    setIsConfirmRemoveOpen(false);
    onRemoveSchedule?.();
    onClose?.();
  }, [onRemoveSchedule, onClose]);

  const handleSave = useCallback(() => {
    if (!isFormValid) return;
    onSave?.({
      format,
      dayOfWeek,
      recurrence,
      startTime: currentFormattedTime,
      location: format === "virtual" ? undefined : location.trim() || undefined,
      virtualLink: format === "physical" ? undefined : virtualLink.trim() || undefined,
    });
    onClose?.();
  }, [
    isFormValid,
    format,
    dayOfWeek,
    recurrence,
    currentFormattedTime,
    location,
    virtualLink,
    onSave,
    onClose,
  ]);

  return {
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
    dragOffsetY,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    sheetStyle,
    isFormValid,
    handleSave,
  };
}
