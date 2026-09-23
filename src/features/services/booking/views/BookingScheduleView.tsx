// features/services/booking/views/BookingScheduleView.tsx
// View layer: Calendar & Time Slots selection screen.
// Dumb UI only. Calls useBookingScheduleViewModel and renders.

import React from 'react';
import { useBookingScheduleViewModel } from '../viewModels/useBookingScheduleViewModel';
import { TimePicker } from '../components/TimePicker';

// ── Icons ────────────────────────────────────────────────────────────────────

const ChevronLeftIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── View Props ───────────────────────────────────────────────────────────────

export interface BookingScheduleViewProps {
  /** Selected service name (e.g. "Baptism", "House Blessing", "Weddings"). Injected by parent/AppShell. */
  serviceName?: string;
  /** Selected church name (e.g. "St. Jude's Cathedral"). Injected by parent/AppShell. */
  churchName?: string;
  /** Callback triggered when user completes booking. */
  onBookingComplete?: () => void;
}

// ── BookingScheduleView Component ───────────────────────────────────────────

const BookingScheduleView: React.FC<BookingScheduleViewProps> = ({
  serviceName,
  churchName,
  onBookingComplete,
}) => {
  const {
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
  } = useBookingScheduleViewModel({
    serviceName,
    churchName,
    onBookingComplete,
  });

  return (
    <main className="w-full min-h-screen bg-neutral-50 flex flex-col items-center gap-5 px-5 pt-4 pb-12 overflow-x-hidden">
      {/* ── Page Header / Subtitle ─────────────────────────────────── */}
      <section className="w-full flex flex-col gap-1">
        <p className="text-black/60 text-xs font-bold font-['Poppins'] uppercase tracking-wider">
          {churchTitle} • {serviceDetails.name}
        </p>
        <h1 className="text-black text-2xl font-bold font-['Poppins'] leading-tight">
          Select Date & Time
        </h1>
      </section>

      {/* ── Schedule Your Service (Calendar & Time Slots) ─────────── */}
      <section className="w-full flex flex-col gap-4">
        {/* Calendar & Time Card */}
        <div className="w-full p-5 bg-white rounded-2xl shadow-sm border border-neutral-200/80 flex flex-col gap-6">
          {/* Calendar Header & Days */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              {/* Clickable Month Label Triggering Month/Year Picker */}
              <button
                type="button"
                onClick={handleTogglePicker}
                aria-label="Select month and year"
                aria-expanded={isPickerOpen}
                className="inline-flex items-center gap-1 text-black text-sm font-bold font-['Poppins'] hover:text-[#336ef9] cursor-pointer transition-colors"
              >
                <span>{monthLabel}</span>
                <ChevronDownIcon />
              </button>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous Month"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrevMonth}
                  className="p-1.5 rounded-full text-black/70 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  aria-label="Next Month"
                  onClick={handleNextMonth}
                  disabled={!canGoNextMonth}
                  className="p-1.5 rounded-full text-black/70 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* Interactive Month/Year Picker Popup Card */}
            {isPickerOpen && (
              <div className="w-full bg-white rounded-xl shadow-lg border border-neutral-200 p-4 flex flex-col gap-4">
                {/* Year Selector Pills (Limited to 5 Years Ahead) */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-black/50 text-[10px] font-bold font-['Poppins'] uppercase">
                    Select Year
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableYears.map((year) => {
                      const isSelectedYear = year === pickerYear;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleSelectPickerYear(year)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Poppins'] transition-colors cursor-pointer ${isSelectedYear
                            ? 'bg-[#1f2156] text-white shadow-sm'
                            : 'bg-zinc-100 text-black hover:bg-zinc-200'
                            }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Month Selector Grid */}
                <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-3">
                  <span className="text-black/50 text-[10px] font-bold font-['Poppins'] uppercase">
                    Select Month
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {monthOptions.map((m) => {
                      if (m.isDisabled) {
                        return (
                          <button
                            key={m.index}
                            type="button"
                            disabled
                            className="px-2 py-2 rounded-lg text-xs font-normal font-['Roboto'] text-neutral-300 bg-zinc-50 cursor-not-allowed text-center"
                          >
                            {m.shortName}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={m.index}
                          type="button"
                          onClick={() => handleSelectPickerMonth(m.index)}
                          className="px-2 py-2 rounded-lg text-xs font-medium font-['Roboto'] text-black bg-zinc-100 hover:bg-[#336ef9] hover:text-white transition-colors cursor-pointer text-center"
                        >
                          {m.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center border-b border-neutral-100 pb-2">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                <span
                  key={day}
                  className="text-black/50 text-[10px] font-bold font-['Roboto'] uppercase"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 justify-items-center pt-1">
              {calendarGrid.map((day, index) => {
                if (day.dayNumber === 0) {
                  return <div key={`pad-${index}`} className="size-9" aria-hidden="true" />;
                }

                if (day.isPast) {
                  return (
                    <button
                      key={`day-${index}`}
                      type="button"
                      disabled
                      aria-label={`Date ${day.dayNumber} passed`}
                      className="size-9 rounded-lg flex items-center justify-center text-sm font-['Roboto'] text-neutral-300 cursor-not-allowed bg-transparent"
                    >
                      {day.dayNumber}
                    </button>
                  );
                }

                const activeClass = day.isSelected
                  ? 'bg-[#1f2156] text-white font-bold shadow-sm'
                  : 'text-black font-normal hover:bg-neutral-100';

                return (
                  <button
                    key={`day-${index}`}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    aria-label={`Select date ${day.dayNumber}`}
                    className={`size-9 rounded-lg flex items-center justify-center text-sm font-['Roboto'] transition-colors duration-150 cursor-pointer ${activeClass}`}
                  >
                    {day.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-3">
            <p className="text-black/60 text-xs font-bold font-['Poppins'] uppercase tracking-wide">
              SELECT TIME
            </p>

            {/* Custom TimePicker Component */}
            <div className="flex flex-col gap-1.5">
              <div
                onClick={handleSelectCustomMode}
                className={`w-full p-3.5 rounded-xl border flex flex-col transition-all duration-150 cursor-pointer ${
                  timeSelectionMode === 'custom'
                    ? customTimeError
                      ? 'bg-red-50/40 border-red-500 ring-1 ring-red-500'
                      : 'bg-[#336ef9]/10 border-[#336ef9] ring-1 ring-[#336ef9]'
                    : 'bg-zinc-50/80 border-neutral-200 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Radio Indicator */}
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                        timeSelectionMode === 'custom'
                          ? customTimeError
                            ? 'border-red-500 bg-red-500'
                            : 'border-[#336ef9] bg-[#336ef9]'
                          : 'border-neutral-400 bg-white'
                      }`}
                    >
                      {timeSelectionMode === 'custom' && (
                        <div className="size-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-black text-sm font-bold font-['Poppins'] leading-none">
                      Enter Time (8 AM to 5 PM)
                    </span>
                  </div>
                </div>

                {/* TimePicker Input Component */}
                <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                  <TimePicker
                    initialHour={customTimeValue.hour}
                    initialMinute={customTimeValue.minute}
                    initialPeriod={customTimeValue.period}
                    onChange={handleTimePickerChange}
                    disabled={false}
                    error={timeSelectionMode === 'custom' ? customTimeError : ''}
                  />
                </div>
              </div>
            </div>

            {/* Pre-defined Time Slots Label */}
            <p className="text-black/40 text-[10px] font-bold font-['Poppins'] uppercase tracking-wide pt-1">
              OR CHOOSE A PRE-DEFINED SLOT
            </p>

            {/* Pre-defined Time Slots Radio Buttons */}
            <div className="flex flex-col gap-2.5">
              {serviceDetails.timeSlots.map((slot) => {
                const isSelected =
                  timeSelectionMode === 'predefined' && slot.time === selectedTimeSlot;
                const slotContainerClass = isSelected
                  ? 'bg-[#336ef9]/10 border-[#336ef9] ring-1 ring-[#336ef9]'
                  : 'bg-zinc-50/80 border-neutral-200 hover:bg-zinc-100';
                const radioClass = isSelected
                  ? 'border-[#336ef9] bg-[#336ef9]'
                  : 'border-neutral-400 bg-white';

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`w-full p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-150 text-left cursor-pointer ${slotContainerClass}`}
                  >
                    <div
                      className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${radioClass}`}
                    >
                      {isSelected && (
                        <div className="size-1.5 rounded-full bg-[#1f2156]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-black text-sm font-bold font-['Poppins'] leading-none mb-1">
                        {slot.time}
                      </span>
                      <span className="text-black/50 text-[10px] font-normal font-['Roboto'] leading-none">
                        Available
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Continue Booking Button ──────────────────────────────── */}
      <section className="w-full pt-2">
        <button
          type="button"
          id="btn-continue-booking"
          onClick={handleContinueBooking}
          disabled={isContinueDisabled}
          className="w-full py-3.5 bg-[#1f2156] hover:bg-[#2c2f6d] active:scale-[0.98] rounded-xl flex justify-center items-center transition-all duration-200 shadow-md text-white text-base font-bold font-['Poppins'] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          {isSubmitting
            ? 'Processing...'
            : bookingSuccess
              ? 'Booking Confirmed!'
              : 'Continue Booking'}
        </button>
      </section>
    </main>
  );
};

export default BookingScheduleView;
