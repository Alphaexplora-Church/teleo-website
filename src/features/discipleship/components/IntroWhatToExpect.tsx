import type React from 'react';
import { Clock, Users, FileText } from 'lucide-react';

export interface IntroWhatToExpectProps {
    reviewTimingDays?: string;
    review_timing_days?: string;
    className?: string;
}

interface ExpectationItem {
    id: string;
    icon: React.ElementType<{ className?: string }>;
    title: string;
    getDescription: (timing: string) => string;
}

const EXPECTATION_ITEMS: ExpectationItem[] = [
    {
        id: 'weekly-gatherings',
        icon: Clock,
        title: 'Weekly Gatherings',
        getDescription: () => 'Regular commitment with your small group.',
    },
    {
        id: 'leadership-matching',
        icon: Users,
        title: 'Leadership Matching',
        getDescription: () => 'You will be paired with an experienced discipler.',
    },
    {
        id: 'application-review',
        icon: FileText,
        title: 'Application Review',
        getDescription: (timing: string) =>
            `Church pastoral team reviews requests within ${timing}.`,
    },
];

export function IntroWhatToExpect({
    reviewTimingDays,
    review_timing_days,
    className = '',
}: IntroWhatToExpectProps) {
    const timing = reviewTimingDays ?? review_timing_days ?? '3–5 days';

    return (
        <section
            aria-labelledby="what-to-expect-heading"
            className={`w-full space-y-3 ${className}`.trim()}
        >
            <h3
                id="what-to-expect-heading"
                className="text-xs font-bold text-[#62718A] tracking-wider uppercase px-1 select-none"
            >
                WHAT TO EXPECT
            </h3>

            <div className="space-y-3">
                {EXPECTATION_ITEMS.map((item) => {
                    const IconComponent = item.icon;

                    return (
                        <div
                            key={item.id}
                            className="w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 transition-all duration-200"
                        >
                            <div
                                className="w-12 h-12 rounded-xl bg-[#F1F3F6] flex items-center justify-center shrink-0 mt-0.5"
                                aria-hidden="true"
                            >
                                <IconComponent className="w-5 h-5 text-[#0E172A]" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <h4 className="text-[15px] font-semibold text-[#0E172A] leading-snug">
                                    {item.title}
                                </h4>
                                <p className="text-[13px] text-[#62718A] leading-relaxed mt-0.5">
                                    {item.getDescription(timing)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default IntroWhatToExpect;