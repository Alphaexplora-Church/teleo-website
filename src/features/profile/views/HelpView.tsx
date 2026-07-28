// features/profile/views/HelpView.tsx
// View layer — static page displaying Help & FAQs.
// Dumb UI following Teleo branding guidelines.

import React from 'react';

const HelpView: React.FC = () => {
  return (
    <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
      <div className="flex flex-col w-full gap-5 px-5 max-w-[448px]">

        {/* ── Hero Title ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-1 w-full">
          <h1 className="text-black text-2xl font-bold font-sans leading-6">
            Help & FAQs
          </h1>
          <p className="text-black/50 text-xs font-normal font-sans leading-4">
            Frequently Asked Questions and support information.
          </p>
        </section>

        {/* ── Single Content Container ────────────────────────────── */}
        <div className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-6">

          {/* Section: How do I create an account */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              How do I create an account?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              To create an account, tap 'Get Started' or 'Sign Up' on the welcome screen. Follow the instructions to enter your name, email address, password, and phone number.
            </p>
          </section>

          {/* Section: Do I need an internet connection */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              Do I need an internet connection?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              Yes, Teleo requires an active internet connection (cellular data or Wi-Fi) to sync church feeds, event reminders, prayer requests, and community features.
            </p>
          </section>

          {/* Section: How do I update my profile */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              How do I update my profile?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              You can update your personal details by navigating to Profile &rarr; Account Information. Here, you can edit your name, email, phone number, and avatar picture.
            </p>
          </section>

          {/* Section: What if I forget my password */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              What if I forget my password?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              If you forget your password, tap the 'Forgot Password' link on the Login screen to receive recovery instructions. You can also update your current password from Profile &rarr; Security.
            </p>
          </section>

          {/* Section: How do I contact support */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              How do I contact support?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              For help or customer support inquiries, you can reach out to us at support@teleo.com. Our support team will assist you as soon as possible.
            </p>
          </section>

          {/* Section: Is my information safe */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              Is my information safe?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              Data security is our top priority. We use industry-standard encryption and security protocols to safeguard your personal data. We do not sell your personal information.
            </p>
          </section>

          {/* Section: Can I delete my account */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
              Can I delete my account?
            </h2>
            <p className="text-black/75 text-sm font-normal font-sans leading-5">
              Yes. You can permanently delete your account at any time by going to Profile &rarr; Security and clicking the 'Delete Account' button in the danger zone.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
};

export default HelpView;
