// features/profile/views/NotificationView.tsx
// View layer — dumb UI rendering the notification preferences form.
// Uses useNotificationViewModel for all states and actions.

import React from 'react';
import { useNotificationViewModel } from '../viewModels/useNotificationViewModel';
import type { NotificationFrequency } from '../models/notificationTypes';

interface FeedbackBannerProps {
  type: 'success' | 'error';
  message: string;
  onDismiss?: () => void;
}
const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message, onDismiss }) => (
  <div
    role="alert"
    aria-live="polite"
    className={[
      'flex items-center justify-between gap-2 w-full px-4 py-3',
      'rounded-[10px] text-sm font-sans transition-all duration-300',
      type === 'success'
        ? 'bg-green-50 text-green-800 outline outline-1 outline-green-300'
        : 'bg-red-50 text-red-800 outline outline-1 outline-red-300',
    ].join(' ')}
  >
    <span>{message}</span>
    {onDismiss && (
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        ✕
      </button>
    )}
  </div>
);

interface ToggleRowProps {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}
const ToggleRow: React.FC<ToggleRowProps> = ({ id, title, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between gap-4 py-2 self-stretch border-b border-gray-100 last:border-0">
    <div className="flex flex-col gap-0.5 flex-1">
      <span id={id} className="text-black text-sm font-semibold font-sans leading-5">
        {title}
      </span>
      {description && (
        <span className="text-black/50 text-xs font-normal font-sans leading-4">
          {description}
        </span>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={id}
      disabled={disabled}
      onClick={onChange}
      className={[
        'w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-[#336ef9]/50 shrink-0',
        checked ? 'bg-[#336ef9]' : 'bg-[#1f2156]/20',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'w-5 h-5 rounded-full bg-white transition-transform absolute left-0 top-0.5 shadow-sm',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  </div>
);

interface NotificationViewProps {
  onSuccess?: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ onSuccess }) => {
  const {
    settings,
    isLoading,
    isSaving,
    saveSuccess,
    saveError,
    handleToggleField,
    handleToggleDelivery,
    handleFrequencyChange,
    handleQuietHoursChange,
    handleSave,
    handleResetToDefaults,
    handleDismissError,
  } = useNotificationViewModel({ onSuccess });

  if (isLoading) {
    return (
      <main className="flex flex-col w-full items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-solid border-[#336ef9]/35 border-t-[#336ef9] animate-spin" />
        <p className="text-black/50 text-sm font-sans mt-3">Loading settings…</p>
      </main>
    );
  }

  const isBusy = isSaving;

  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full gap-5 px-4 max-w-[448px]">

        {/* ── Title Header ───────────────────────────────────────── */}
        <section className="flex flex-col gap-1 w-full">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            Notification Settings
          </h1>
          <p className="text-black/50 text-xs font-normal font-sans leading-4">
            Manage how and when you receive notifications from Teleo.
          </p>
        </section>

        {/* ── Banners ────────────────────────────────────────────── */}
        {saveSuccess && (
          <FeedbackBanner type="success" message="Notification settings saved successfully! 🎉" />
        )}
        {saveError && (
          <FeedbackBanner type="error" message={saveError} onDismiss={handleDismissError} />
        )}

        {/* ── Notification Types ───────────────────────────────────── */}
        <section className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-1 shadow-[0px_4px_4px_#00000040]">
          <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5 mb-2">
            Notification Types
          </h2>
          <ToggleRow
            id="lbl-event-reminders"
            title="Event Reminders"
            description="Get notified about upcoming services and church events."
            checked={settings.eventReminders}
            onChange={() => handleToggleField('eventReminders')}
            disabled={isBusy}
          />
          <ToggleRow
            id="lbl-announcements"
            title="Announcements"
            description="Stay updated with new notices and updates from your church."
            checked={settings.announcements}
            onChange={() => handleToggleField('announcements')}
            disabled={isBusy}
          />
          <ToggleRow
            id="lbl-prayer-requests"
            title="Prayer Requests"
            description="Be notified when community members post new prayer requests."
            checked={settings.prayerRequests}
            onChange={() => handleToggleField('prayerRequests')}
            disabled={isBusy}
          />
        </section>

        {/* ── Delivery Preferences ─────────────────────────────────── */}
        <section className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-1 shadow-[0px_4px_4px_#00000040]">
          <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5 mb-2">
            Delivery Preferences
          </h2>
          <ToggleRow
            id="lbl-push"
            title="Push Notifications"
            description="Receive immediate alerts directly on your device."
            checked={settings.push}
            onChange={() => handleToggleDelivery('push')}
            disabled={isBusy}
          />
          <ToggleRow
            id="lbl-email"
            title="Email Notifications"
            description="Receive updates via your registered email address."
            checked={settings.email}
            onChange={() => handleToggleDelivery('email')}
            disabled={isBusy}
          />
          <ToggleRow
            id="lbl-in-app"
            title="In-App Notifications"
            description="Show indicators and messages inside the application."
            checked={settings.inApp}
            onChange={() => handleToggleDelivery('inApp')}
            disabled={isBusy}
          />
        </section>

        {/* ── Frequency Options ────────────────────────────────────── */}
        <section className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-3 shadow-[0px_4px_4px_#00000040]">
          <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
            Frequency Options
          </h2>
          <div className="flex flex-col gap-[3px] w-full">
            <label
              htmlFor="sel-frequency"
              className="text-black text-xs font-medium font-sans leading-4"
            >
              Update Frequency
            </label>
            <div className="relative w-full">
              <select
                id="sel-frequency"
                value={settings.frequency}
                disabled={isBusy}
                onChange={(e) => handleFrequencyChange(e.target.value as NotificationFrequency)}
                className={[
                  'w-full h-11 px-4 py-2.5 appearance-none',
                  'bg-blue-500/5 rounded-[10px]',
                  'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                  'text-black text-xs font-normal font-sans leading-4',
                  'focus:outline-2 focus:outline-[#336ef9]',
                  'transition-all duration-150 cursor-pointer',
                ].join(' ')}
              >
                <option value="instant">Instant (Immediate Alerts)</option>
                <option value="daily">Daily Digest (Once per day)</option>
                <option value="weekly">Weekly Summary (Once per week)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1f2156]">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quiet Hours / Do Not Disturb ─────────────────────────── */}
        <section className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-4 shadow-[0px_4px_4px_#00000040]">
          <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
            Quiet Hours / Do Not Disturb
          </h2>
          <ToggleRow
            id="lbl-quiet-hours"
            title="Enable Quiet Hours"
            description="Silence notifications during specified times."
            checked={settings.quietHoursEnabled}
            onChange={() => handleToggleField('quietHoursEnabled')}
            disabled={isBusy}
          />

          {settings.quietHoursEnabled && (
            <div className="flex gap-4 w-full animate-fade-in">
              {/* Start Time */}
              <div className="flex-1 flex flex-col gap-[3px]">
                <label
                  htmlFor="inp-quiet-start"
                  className="text-black text-xs font-medium font-sans leading-4"
                >
                  Start Time
                </label>
                <input
                  id="inp-quiet-start"
                  type="time"
                  value={settings.quietHoursStart}
                  disabled={isBusy}
                  onChange={(e) => handleQuietHoursChange('quietHoursStart', e.target.value)}
                  className={[
                    'w-full h-11 px-4 py-2.5',
                    'bg-blue-500/5 rounded-[10px]',
                    'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                    'text-black text-xs font-normal font-sans leading-4',
                    'focus:outline-2 focus:outline-[#336ef9]',
                    'transition-all duration-150 cursor-pointer',
                  ].join(' ')}
                />
              </div>

              {/* End Time */}
              <div className="flex-1 flex flex-col gap-[3px]">
                <label
                  htmlFor="inp-quiet-end"
                  className="text-black text-xs font-medium font-sans leading-4"
                >
                  End Time
                </label>
                <input
                  id="inp-quiet-end"
                  type="time"
                  value={settings.quietHoursEnd}
                  disabled={isBusy}
                  onChange={(e) => handleQuietHoursChange('quietHoursEnd', e.target.value)}
                  className={[
                    'w-full h-11 px-4 py-2.5',
                    'bg-blue-500/5 rounded-[10px]',
                    'outline outline-1 outline-offset-[-1px] outline-[#1f2156]',
                    'text-black text-xs font-normal font-sans leading-4',
                    'focus:outline-2 focus:outline-[#336ef9]',
                    'transition-all duration-150 cursor-pointer',
                  ].join(' ')}
                />
              </div>
            </div>
          )}
        </section>

        {/* ── Actions ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full mt-2">
          {/* Save Changes Button */}
          <button
            type="button"
            disabled={isBusy}
            onClick={handleSave}
            className={[
              'w-full h-14 px-4',
              'bg-[#336ef9] rounded-[20px]',
              'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
              'border border-[#1f2156]',
              'flex justify-center items-center gap-2',
              'text-white text-base font-bold font-sans leading-6',
              'transition-all duration-150 active:scale-[0.98]',
              isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-[#336ef9]/90',
            ].join(' ')}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-solid border-white/35 border-t-white animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>

          {/* Reset to Defaults Button */}
          <button
            type="button"
            disabled={isBusy}
            onClick={handleResetToDefaults}
            className={[
              'w-full h-14 px-4',
              'bg-transparent rounded-[20px]',
              'border border-[#1f2156]',
              'flex justify-center items-center',
              'text-[#1f2156] text-base font-bold font-sans leading-6',
              'transition-all duration-150 active:scale-[0.98]',
              isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-black/5',
            ].join(' ')}
          >
            Reset to Defaults
          </button>
        </div>

      </div>
    </main>
  );
};

export default NotificationView;
