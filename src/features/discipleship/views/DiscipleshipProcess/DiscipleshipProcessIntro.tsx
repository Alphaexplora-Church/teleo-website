import { useMemo } from "react";
import { discipleshipProcessIntroConst } from "../../models/constants/discipleshipProcessIntro.constant";
import { getDiscipleshipProgramByChurchId } from "../../models/mocks/discipleshipProgramIntro.mocks";
import type {
  DiscipleshipProcessIntroConfig,
  DiscipleshipProcessIntroProps,
} from "../../models/types/discipleshipProcessIntro.types";
import { IntroWhatToExpect } from "../../components/IntroWhatToExpect";

export function DiscipleshipProcessIntro({
  churchId,
  programDetail,
  config: userConfig,
  onBack,
  onApply,
  className = "",
}: DiscipleshipProcessIntroProps = {}) {
  const resolvedConfig: DiscipleshipProcessIntroConfig = {
    ...discipleshipProcessIntroConst,
    ...userConfig,
    buttonBack: {
      ...discipleshipProcessIntroConst.buttonBack,
      ...userConfig?.buttonBack,
    },
    buttonApply: {
      ...discipleshipProcessIntroConst.buttonApply,
      ...userConfig?.buttonApply,
    },
    icons: {
      ...discipleshipProcessIntroConst.icons,
      ...userConfig?.icons,
    },
  };

  const targetChurchId = churchId ?? 102;

  const resolvedProgram = useMemo(() => {
    if (programDetail) return programDetail;
    return (
      getDiscipleshipProgramByChurchId(targetChurchId) ??
      getDiscipleshipProgramByChurchId(102)
    );
  }, [programDetail, targetChurchId]);

  // Icons are injected exclusively from Model/Constant layer
  const BackIcon = resolvedConfig.buttonBack.icon;
  const ApplyIcon = resolvedConfig.buttonApply.icon;
  const FormatIcon = resolvedConfig.icons.format;
  const LockIcon = resolvedConfig.icons.lock;

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back to Churches Button Only (No profile avatar) ── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[17px] font-semibold text-[#0E172A] hover:text-[#042C58] transition-colors cursor-pointer border-none bg-transparent p-0"
          aria-label={resolvedConfig.buttonBack.label}
        >
          {BackIcon && <BackIcon className="w-5 h-5 -ml-1 text-[#0E172A]" />}
          <span>{resolvedConfig.buttonBack.label}</span>
        </button>
      </div>

      {/* ── Church Name & Format Indicator ──────────────────────── */}
      <div className="space-y-2.5">
        <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
          {resolvedProgram?.church_name || "Church Discipleship"}
        </h1>

        {resolvedProgram?.format && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F3F6] rounded-lg text-xs font-medium text-[#475569]">
              {FormatIcon && (
                <FormatIcon className="w-3.5 h-3.5 text-[#62718A]" />
              )}
              <span>
                {resolvedConfig.formatPrefix}
                {resolvedProgram.format}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Description Box ────────────────────────────────────── */}
      {resolvedProgram?.description && (
        <div className="w-full p-4.5 bg-[#F8FAFC] rounded-2xl border border-slate-100">
          <p className="text-[14px] leading-relaxed text-[#334155]">
            {resolvedProgram.description}
          </p>
        </div>
      )}

      {/* ── What To Expect Section ─────────────────────────────── */}
      <IntroWhatToExpect
        reviewTimingDays={resolvedProgram?.review_timing_days}
      />

      {/* ── Bottom Action Button & Security Footnote ───────────── */}
      <div className="pt-2 space-y-3 pb-6">
        <button
          type="button"
          onClick={onApply}
          className="w-full h-12 bg-[#0E172A] hover:bg-black active:scale-[0.99] text-white font-semibold text-[15px] rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <span>{resolvedConfig.buttonApply.label}</span>
          {ApplyIcon && <ApplyIcon className="w-4 h-4 text-white" />}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#62718A]">
          {LockIcon && (
            <LockIcon className="w-3.5 h-3.5 text-[#62718A] shrink-0" />
          )}
          <span>{resolvedConfig.footnoteText}</span>
        </div>
      </div>
    </div>
  );
}

export default DiscipleshipProcessIntro;
