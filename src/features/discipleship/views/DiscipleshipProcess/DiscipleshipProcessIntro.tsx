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

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 py-6 space-y-6 select-none ${className}`.trim()}
    >
      {/* ── Sub-Navigation: Back Button (Icon Only) ────────────────── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#0E172A] hover:text-[#042C58] hover:bg-slate-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          aria-label={resolvedConfig.buttonBack.label || "Back"}
        >
          {BackIcon && <BackIcon className="w-6 h-6 text-[#0E172A]" />}
        </button>
      </div>

      {/* ── Church Name ─────────────────────────────────────────── */}
      <h1 className="text-2xl font-bold text-[#0E172A] tracking-tight">
        {resolvedProgram?.church_name || "Church Discipleship"}
      </h1>

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

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <div className="pt-2 pb-6">
        <button
          type="button"
          onClick={onApply}
          className="w-full h-12 bg-[#0E172A] hover:bg-black active:scale-[0.99] text-white font-semibold text-[15px] rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <span>{resolvedConfig.buttonApply.label}</span>
          {ApplyIcon && <ApplyIcon className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
}

export default DiscipleshipProcessIntro;
