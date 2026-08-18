// features/services/booking/viewModels/useBookingScheduleViewModel.ts
// ViewModel: owns all state and logic for BookingScheduleView (Calendar & Time Slots).

import { useState, useCallback, useMemo } from 'react';
import type {
  ServiceDetail,
  CalendarDay,
  MonthOption,
} from '../models/bookingTypes';
import {
  SERVICE_DETAILS_MAP,
  DEFAULT_SERVICE_DETAIL,
} from '../models/bookingTypes';
import type { TimePickerValue } from '../components/TimePicker';

export interface UseBookingScheduleViewModelParams {
  serviceName?: string;
  churchName?: string;
  onBookingComplete?: () => void;
}

export interface UseBookingScheduleViewModelReturn {
  serviceDetails: ServiceDetail;
  churchTitle: string;
  monthLabel: string;
  calendarGrid: CalendarDay[];
  canGoPrevMonth: boolean;
  canGoNextMonth: boolean;
  isPickerOpen: boolean;
  pickerYear: number;
  availableYears: number[];
  monthOptions: MonthOption[];
  timeSelectionMode: 'custom' | 'predefined';
  customTimeValue: TimePickerValue;
  customTimeError: string;
  selectedTimeSlot: string;
  isSubmitting: boolean;
  bookingSuccess: boolean;
  isContinueDisabled: boolean;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleTogglePicker: () => void;
  handleSelectPickerYear: (year: number) => void;
  handleSelectPickerMonth: (monthIndex: number) => void;
  handleDateSelect: (day: CalendarDay) => void;
  handleTimePickerChange: (time: TimePickerValue) => void;
  handleSelectCustomMode: () => void;
  handleTimeSelect: (time: string) => void;
  handleContinueBooking: () => void;
}

// ── Bounds Check Helper (8:00 AM to 5:00 PM) ─────────────────────────────────

const validateBookingTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
  let h24 = hour % 12;
  if (period === 'PM') h24 += 12;
  const totalMinutes = h24 * 60 + minute;

  const startMinutes = 8 * 60;   // 8:00 AM
  const endMinutes = 17 * 60;    // 5:00 PM

  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
};

export const useBookingScheduleViewModel = ({
  serviceName,
  churchName,
  onBookingComplete,
}: UseBookingScheduleViewModelParams = {}): UseBookingScheduleViewModelReturn => {
  // Resolve service details dynamically based on selected service name
  const serviceDetails = useMemo<ServiceDetail>(() => {
    if (!serviceName) return DEFAULT_SERVICE_DETAIL;

    const normalizedKey = serviceName.trim().toLowerCase().replace(/\s+/g, '-');
    const matched = SERVICE_DETAILS_MAP[normalizedKey];

    if (matched) return matched;

    return {
      ...DEFAULT_SERVICE_DETAIL,
      id: normalizedKey,
      name: serviceName,
    };
  }, [serviceName]);

  const churchTitle = churchName || "St. Jude's Cathedral";

  // Today reference normalized to midnight (00:00:00)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Single Date state representing 1st day of current viewed month
  const [viewDate, setViewDate] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(today));

  // 5-Year Ahead Limit Bounds
  const startYear = today.getFullYear();
  const maxYear = startYear + 5;

  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = startYear; y <= maxYear; y++) {
      years.push(y);
    }
    return years;
  }, [startYear, maxYear]);

  // Month/Year Picker Popup State
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [pickerYear, setPickerYear] = useState<number>(() => today.getFullYear());

  // Time Selection Mode & TimePicker Component State (Limited to 8:00 AM – 5:00 PM)
  const [timeSelectionMode, setTimeSelectionMode] = useState<'custom' | 'predefined'>('predefined');
  const [customTimeValue, setCustomTimeValue] = useState<TimePickerValue>({
    hour: 9,
    minute: 0,
    period: 'AM',
  });
  const [customTimeError, setCustomTimeError] = useState<string>('');

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    serviceDetails.timeSlots[0]?.time || '10:00 AM'
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Month navigation bounds check
  const canGoPrevMonth = useMemo(() => {
    const prevMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return prevMonthDate.getTime() >= minMonthDate.getTime();
  }, [viewDate, today]);

  const canGoNextMonth = useMemo(() => {
    const nextMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    const maxMonthDate = new Date(maxYear, 11, 1);
    return nextMonthDate.getTime() <= maxMonthDate.getTime();
  }, [viewDate, maxYear]);

  // Handlers for month navigation using exact Date arithmetic
  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => {
      const target = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
      if (target.getTime() < minDate.getTime()) return prev;
      return target;
    });
  }, [today]);

  const handleNextMonth = useCallback(() => {
    if (!canGoNextMonth) return;
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, [canGoNextMonth]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Formatted Month Header Label (e.g. "July 2026")
  const monthLabel = useMemo(() => {
    return viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }, [viewDate]);

  // Available Month Options for Month/Year Picker Modal
  const monthOptions = useMemo<MonthOption[]>(() => {
    const months = [
      { index: 0, shortName: 'Jan', fullName: 'January' },
      { index: 1, shortName: 'Feb', fullName: 'February' },
      { index: 2, shortName: 'Mar', fullName: 'March' },
      { index: 3, shortName: 'Apr', fullName: 'April' },
      { index: 4, shortName: 'May', fullName: 'May' },
      { index: 5, shortName: 'Jun', fullName: 'June' },
      { index: 6, shortName: 'Jul', fullName: 'July' },
      { index: 7, shortName: 'Aug', fullName: 'August' },
      { index: 8, shortName: 'Sep', fullName: 'September' },
      { index: 9, shortName: 'Oct', fullName: 'October' },
      { index: 10, shortName: 'Nov', fullName: 'November' },
      { index: 11, shortName: 'Dec', fullName: 'December' },
    ];

    return months.map((m) => {
      let isDisabled = false;
      if (pickerYear === startYear && m.index < today.getMonth()) {
        isDisabled = true;
      }
      return {
        ...m,
        isDisabled,
      };
    });
  }, [pickerYear, startYear, today]);

  // Picker Handlers
  const handleTogglePicker = useCallback(() => {
    setIsPickerOpen((prev) => {
      if (!prev) {
        setPickerYear(viewDate.getFullYear());
      }
      return !prev;
    });
  }, [viewDate]);

  const handleSelectPickerYear = useCallback((year: number) => {
    setPickerYear(year);
  }, []);

  const handleSelectPickerMonth = useCallback((monthIndex: number) => {
    if (pickerYear === startYear && monthIndex < today.getMonth()) return;

    setViewDate(new Date(pickerYear, monthIndex, 1));
    setIsPickerOpen(false);
  }, [pickerYear, startYear, today]);

  // Compute Full Calendar Grid for Current Month
  const calendarGrid = useMemo<CalendarDay[]>(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const grid: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push({
        date: new Date(currentYear, currentMonth, -firstDayOfWeek + i + 1),
        dayNumber: 0,
        isCurrentMonth: false,
        isPast: true,
        isSelected: false,
        isToday: false,
      });
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayDate = new Date(currentYear, currentMonth, dayNum);
      dayDate.setHours(0, 0, 0, 0);

      const isPast = dayDate.getTime() < today.getTime();
      const isToday = dayDate.getTime() === today.getTime();
      const isSelected =
        selectedDate.getFullYear() === currentYear &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getDate() === dayNum;

      grid.push({
        date: dayDate,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isPast,
        isSelected,
        isToday,
      });
    }

    return grid;
  }, [currentYear, currentMonth, selectedDate, today]);

  // Date select handler — only allows selecting valid future/today dates
  const handleDateSelect = useCallback((day: CalendarDay) => {
    if (day.isPast || !day.isCurrentMonth) return;
    setSelectedDate(day.date);
  }, []);

  const handleTimePickerChange = useCallback(
    (time: TimePickerValue) => {
      setCustomTimeValue(time);
      setTimeSelectionMode('custom');

      if (!validateBookingTime(time.hour, time.minute, time.period)) {
        setCustomTimeError('Please select a time between 8:00 AM and 5:00 PM');
      } else {
        setCustomTimeError('');
        const formattedMin = time.minute < 10 ? `0${time.minute}` : `${time.minute}`;
        setSelectedTimeSlot(`${time.hour}:${formattedMin} ${time.period}`);
      }
    },
    [],
  );

  const handleSelectCustomMode = useCallback(() => {
    setTimeSelectionMode('custom');
    if (!validateBookingTime(customTimeValue.hour, customTimeValue.minute, customTimeValue.period)) {
      setCustomTimeError('Please select a time between 8:00 AM and 5:00 PM');
    } else {
      setCustomTimeError('');
      const formattedMin = customTimeValue.minute < 10 ? `0${customTimeValue.minute}` : `${customTimeValue.minute}`;
      setSelectedTimeSlot(`${customTimeValue.hour}:${formattedMin} ${customTimeValue.period}`);
    }
  }, [customTimeValue]);

  const handleTimeSelect = useCallback((time: string) => {
    setTimeSelectionMode('predefined');
    setSelectedTimeSlot(time);
    setCustomTimeError('');
  }, []);

  const isCustomTimeValid = useMemo(() => {
    return validateBookingTime(customTimeValue.hour, customTimeValue.minute, customTimeValue.period);
  }, [customTimeValue]);

  const isContinueDisabled =
    isSubmitting || (timeSelectionMode === 'custom' && (!isCustomTimeValid || Boolean(customTimeError)));

  const handleContinueBooking = useCallback(() => {
    if (timeSelectionMode === 'custom' && (!validateBookingTime(customTimeValue.hour, customTimeValue.minute, customTimeValue.period) || customTimeError)) {
      setCustomTimeError('Please select a time between 8:00 AM and 5:00 PM');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      if (onBookingComplete) {
        onBookingComplete();
      }
    }, 800);
  }, [timeSelectionMode, customTimeValue, customTimeError, onBookingComplete]);

  return {
    serviceDetails,
    churchTitle,
    monthLabel,
    calendarGrid,
    canGoPrevMonth,
    canGoNextMonth,
    isPickerOpen,
    pickerYear,
    availableYears,
    monthOptions,
    timeSelectionMode,
    customTimeValue,
    customTimeError,
    selectedTimeSlot,
    isSubmitting,
    bookingSuccess,
    isContinueDisabled,
    handlePrevMonth,
    handleNextMonth,
    handleTogglePicker,
    handleSelectPickerYear,
    handleSelectPickerMonth,
    handleDateSelect,
    handleTimePickerChange,
    handleSelectCustomMode,
    handleTimeSelect,
    handleContinueBooking,
  };
};
