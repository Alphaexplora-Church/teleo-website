// features/profile/security/views/PrivacyPolicyView.tsx
// View layer — static page displaying the Privacy Policy texts.
// Dumb UI following Teleo branding guidelines.

import React from 'react';

const PrivacyPolicyView: React.FC = () => {
    return (
        <main className="flex flex-col w-full items-center gap-6 relative min-h-full pt-6 pb-10">
            <div className="flex flex-col w-full gap-5 px-5 max-w-[448px]">

                {/* ── Hero Title ─────────────────────────────────────────── */}
                <section className="flex flex-col gap-1 w-full">
                    <h1 className="text-black text-2xl font-bold font-sans leading-6">
                        Privacy Policy
                    </h1>
                    <p className="text-black/50 text-xs font-normal font-sans leading-4">
                        Last updated: July 2026
                    </p>
                </section>

                {/* ── Single Content Container ────────────────────────────── */}
                <div className="w-full p-5 bg-[#336ef90d] rounded-[20px] border border-[#1f2156] flex flex-col gap-6">

                    {/* Section: Introduction */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Introduction
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            Welcome to Teleo. We value your privacy and are committed to protecting your personal data. This policy outlines what data we collect and how we secure and use it.
                        </p>
                    </section>

                    {/* Section: Information We Collect */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Information We Collect
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            We collect personal information such as your name, email address, phone number, and church preferences to provide you with a tailored experience.
                        </p>
                    </section>

                    {/* Section: How We Use Your Information */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            How We Use Your Information
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            We use your information to operate and maintain the application features, verify your identity, and facilitate connection to your local church.
                        </p>
                    </section>

                    {/* Section: Sharing of Information */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Sharing of Information
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            We do not sell or share your personal information with third parties. Information may only be shared if required by law or to protect the safety of our community.
                        </p>
                    </section>

                    {/* Section: Data Security */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Data Security
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            We take reasonable steps to protect your information from unauthorized access or misuse.
                        </p>
                    </section>

                    {/* Section: Your Rights */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Your Rights
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            You may request to update or delete your personal information by contacting us.
                        </p>
                    </section>

                    {/* Section: Changes to This Policy */}
                    <section className="flex flex-col gap-2">
                        <h2 className="text-[#1f2156] text-lg font-bold font-sans leading-5">
                            Changes to This Policy
                        </h2>
                        <p className="text-black/75 text-sm font-normal font-sans leading-5">
                            We may update this Privacy Policy from time to time. Updates will be posted within the App.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicyView;
