import React from 'react';
import { Link } from 'react-router-dom';
import { useCreatePrayerViewModel } from '../viewmodels/CreatePrayerViewModel';
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

const CreatePrayerView: React.FC = () => {
  const { audiences, hashtags, themes, navigateToTab } =
    useCreatePrayerViewModel();

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

      <form className="flex flex-1 flex-col px-5 pb-8 pt-7 sm:px-7">
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

          <label className="block">
            <span className="mb-2 block text-[12px] font-bold text-navy">Hashtag</span>
            <select
              name="hashtag"
              defaultValue=""
              className="h-12 w-full appearance-none rounded-xl border border-gray-border bg-white px-4 text-[13px] text-gray-label outline-none transition focus:border-navy focus:ring-4 focus:ring-navy/8"
            >
              <option value="" disabled>
                Choose a category
              </option>
              {hashtags.map((hashtag) => (
                <option key={hashtag} value={hashtag.toLowerCase()}>
                  {hashtag}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="mb-3 text-[12px] font-bold text-navy">Theme</legend>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme, index) => (
                <label
                  key={theme.id}
                  className="group relative cursor-pointer"
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
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-gray-border hover:bg-off-white"
                >
                  <input
                    type="radio"
                    name="audience"
                    value={audience.id}
                    defaultChecked={index === 0}
                    className="mt-0.5 size-4 accent-[#1e3a5f]"
                  />
                  <span>
                    <span className="block text-[13px] font-semibold text-navy">
                      {audience.label}
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

        <div className="mt-auto flex items-center justify-between gap-4 pt-10">
          <button
            type="reset"
            className="min-w-24 rounded-full border border-gray-border bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-placeholder transition hover:border-navy hover:text-navy active:scale-95"
          >
            Clear
          </button>
          <button
            type="button"
            className="min-w-32 rounded-full bg-navy px-7 py-2.5 text-[13px] font-bold text-white shadow-btn transition hover:bg-navy-hover active:scale-95 active:bg-navy-active"
          >
            Post
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
