import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreatePrayerViewModel } from '../viewModels/useCreatePrayerViewModel';
import BottomNavBar from '../../../shared/components/BottomNavBar';

const BackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CreatePrayerView: React.FC = () => {
  const {
    audiences,
    hashtags,
    themes,
    isThemeSelectionEnabled,
    isSubmitting,
    errorMessage,
    submitPrayer,
    navigateToTab,
  } = useCreatePrayerViewModel();
  const [isHashtagDropdownOpen, setIsHashtagDropdownOpen] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags((current) =>
      current.includes(hashtag)
        ? current.filter((selectedHashtag) => selectedHashtag !== hashtag)
        : [...current, hashtag],
    );
  };

  return (
    <main className="min-h-dvh w-full bg-off-white">
    <div className="mx-auto flex min-h-dvh w-full max-w-[448px] flex-col border-x border-black/10 bg-white shadow-[0_0_24px_rgba(27,50,82,0.1)]">
      <header className="sticky top-0 z-10 border-b border-gray-border/60 bg-white/95 backdrop-blur">
        <div className="flex h-[60px] items-center gap-3 px-4">
          <Link
            to="/dashboard"
            aria-label="Back to prayer wall"
            className="flex size-9 items-center justify-center rounded-lg bg-navy text-white transition hover:bg-navy-hover active:scale-95"
          >
            <BackIcon />
          </Link>
          <h1 className="text-[17px] font-bold tracking-[-0.02em] text-navy">
            Prayer Request
          </h1>
        </div>
      </header>

      <form
        className="flex flex-1 flex-col px-5 pb-8 pt-7 sm:px-7"
        onSubmit={async (event) => {
          event.preventDefault();
          await submitPrayer(new FormData(event.currentTarget));
        }}
        onReset={() => {
          setSelectedHashtags([]);
          setIsHashtagDropdownOpen(false);
        }}
      >
        <div className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#129e9a]">
            Prayer Wall
          </p>
          <h2 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-navy">
            New Prayer Request
          </h2>
          <p className="mt-2 max-w-[330px] text-[13px] leading-5 text-gray-placeholder">
            Share what is on your heart and invite the community to pray with you.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold text-navy">
              Subject <span className="text-error">*</span>
            </span>
            <input
              type="text"
              name="subject"
              required
              placeholder="Enter a subject for your prayer request"
              className="h-12 w-full rounded-xl border border-gray-border bg-white px-4 text-[13px] text-gray-label outline-none transition placeholder:text-gray-placeholder focus:border-navy focus:ring-4 focus:ring-navy/8"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[12px] font-bold text-navy">
              Prayer request <span className="text-error">*</span>
            </span>
            <textarea
              name="request"
              required
              rows={5}
              placeholder="Share your prayer request here"
              className="w-full resize-none rounded-xl border border-gray-border bg-white px-4 py-3 text-[13px] leading-5 text-gray-label outline-none transition placeholder:text-gray-placeholder focus:border-navy focus:ring-4 focus:ring-navy/8"
            />
          </label>

          <fieldset className="relative">
            <legend className="mb-2 block text-[12px] font-bold text-navy">
              Hashtags
            </legend>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isHashtagDropdownOpen}
              className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-gray-border bg-white px-4 text-left text-[13px] font-semibold text-gray-label outline-none transition hover:border-navy focus:border-navy focus:ring-4 focus:ring-navy/8"
              onClick={() => setIsHashtagDropdownOpen((isOpen) => !isOpen)}
            >
              <span className="min-w-0 flex-1 truncate">
                {selectedHashtags.length > 0
                  ? selectedHashtags.join(', ')
                  : 'Select hashtags'}
              </span>
              <ChevronDownIcon />
            </button>
            {isHashtagDropdownOpen && (
              <div
                role="listbox"
                aria-label="Choose hashtags"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-gray-border bg-white py-1 shadow-[0_14px_30px_rgba(27,50,82,0.16)]"
              >
                {hashtags.map((hashtag) => (
                  <label
                    key={hashtag}
                    className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-[13px] font-semibold text-gray-label transition hover:bg-off-white"
                  >
                    <input
                      type="checkbox"
                      name="hashtags"
                      value={hashtag}
                      checked={selectedHashtags.includes(hashtag)}
                      onChange={() => toggleHashtag(hashtag)}
                      className="size-4 accent-[#1e3a5f]"
                    />
                    <span>{hashtag}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset disabled={!isThemeSelectionEnabled}>
            <legend className="mb-3 flex items-center gap-2 text-[12px] font-bold text-navy">
              Theme
              {!isThemeSelectionEnabled && (
                <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-navy">
                  Ongoing
                </span>
              )}
            </legend>
            <div
              className={`grid grid-cols-3 gap-3 ${
                isThemeSelectionEnabled
                  ? ''
                  : 'cursor-not-allowed opacity-45 grayscale-[25%]'
              }`}
            >
              {themes.map((theme, index) => (
                <label
                  key={theme.id}
                  className={`group relative ${
                    isThemeSelectionEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  title={theme.label}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.id}
                    defaultChecked={index === 0}
                    className="peer sr-only"
                  />
                  <span
                    className="block h-14 rounded-xl border-4 border-white shadow-sm ring-1 ring-black/8 transition group-active:scale-95 peer-checked:ring-[3px] peer-checked:ring-navy peer-focus-visible:ring-[3px] peer-focus-visible:ring-link"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="sr-only">{theme.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[12px] font-bold text-navy">
              Choose audience
            </legend>
            <div className="space-y-2">
              {audiences.map((audience, index) => (
                <label
                  key={audience.id}
                  className={`flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition ${
                    audience.disabled
                      ? 'cursor-not-allowed bg-gray-50 opacity-50'
                      : 'cursor-pointer hover:border-gray-border hover:bg-off-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={audience.id}
                    defaultChecked={index === 0}
                    disabled={audience.disabled}
                    className="mt-0.5 size-4 accent-[#1e3a5f]"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                      {audience.label}
                      {audience.disabled && (
                        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-navy">
                          Ongoing
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-gray-placeholder">
                      {audience.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {errorMessage && (
          <p className="mt-5 rounded-xl bg-[#fff3f2] px-4 py-3 text-[12px] font-medium text-[#8b2d23]">
            {errorMessage}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-10">
          <button
            type="reset"
            className="min-w-24 rounded-full border border-gray-border bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-placeholder transition hover:border-navy hover:text-navy active:scale-95"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-w-32 rounded-full bg-navy px-7 py-2.5 text-[13px] font-bold text-white shadow-btn transition hover:bg-navy-hover active:scale-95 active:bg-navy-active"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
      <div className="sticky bottom-0 z-20 mt-auto">
        <BottomNavBar activeTab="prayer-wall" onTabChange={navigateToTab} />
      </div>
    </div>
    </main>
  );
};

export default CreatePrayerView;
