// src/features/discipleship/views/DiscipleshipProcessIntro.tsx
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DiscipleshipProcessIntroProps } from "../models/types/discipleshipProcessIntro.types";
import type { DiscipleshipProgramDetail } from "../models/types/discipleship.types";
import { IntroWhatToExpect } from "../components/process/IntroWhatToExpect";
import { fetchChurchDiscipleshipProgram } from "../models/api/discipleship.api";

export function DiscipleshipProcessIntro({
  churchId,
  programDetail,
  onBack,
  onApply,
  className = "",
}: DiscipleshipProcessIntroProps = {}) {
  const targetChurchId = churchId ?? 101;
  const [liveProgram, setLiveProgram] = useState<DiscipleshipProgramDetail | null>(null);

  useEffect(() => {
    if (programDetail) return;
    if (churchId) {
      fetchChurchDiscipleshipProgram(churchId)
        .then((res) => {
          if (res?.program) {
            setLiveProgram({
              church_id: res.program.church_id,
              church_name: res.program.church_name,
              city: "",
              is_home_church: false,
              active_groups_count: res.program.active_groups_count ?? 0,
              format: "Hybrid (In-Person & Online)",
              description:
                res.program.description ||
                "Our discipleship groups meet weekly to study scripture, pray together, and spur one another on toward Christlikeness.",
              review_timing_days: "2-3 days",
            });
          }
        })
        .catch(() => {
          // Graceful catch handled by safe fallback
        });
    }
  }, [churchId, programDetail]);

  const resolvedProgram = useMemo(() => {
    if (programDetail) return programDetail;
    if (liveProgram) return liveProgram;

    return {
      church_id: targetChurchId,
      church_name: "Church Discipleship",
      city: "",
      is_home_church: false,
      active_groups_count: 0,
      format: "Hybrid (In-Person & Online)" as const,
      description:
        "Our discipleship groups meet weekly to study scripture, pray together, and spur one another on toward Christlikeness.",
      review_timing_days: "2-3 days",
    };
  }, [programDetail, liveProgram, targetChurchId]);

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
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 text-[#0E172A]" />
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
          <span>Apply for Discipleship</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

export default DiscipleshipProcessIntro;

