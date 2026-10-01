import { myDiscipleshipLeadCardConst } from "../../../models/constants/myDiscipleshipLeadEmptyState.constant";
import type { MyDiscipleshipLeadCardProps } from "../../../models/types/myDiscipleshipLeadEmptyState.types";


export interface MyDiscipleshipLeadEmptyStateProps {
  cardData?: MyDiscipleshipLeadCardProps;
  className?: string;
}

export function MyDiscipleshipLeadEmptyState({
  cardData = myDiscipleshipLeadCardConst,
  className = "",
}: MyDiscipleshipLeadEmptyStateProps = {}) {
  const IconComponent = cardData.icon;

  return (
    <div
      className={`
        w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm
        relative overflow-hidden text-center flex flex-col items-center select-none
        ${className}
      `.trim()}
    >
      {/* ── Subtle Decorative Background Shape ───────────────── */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 bg-[#F8FAFC] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Circular Icon Container ──────────────────────────── */}
      {IconComponent && (
        <div className="w-16 h-16 rounded-full bg-[#F1F3F6] flex items-center justify-center mb-5 shrink-0 relative z-10">
          <IconComponent className="w-7 h-7 text-[#0E172A]" />
        </div>
      )}

      {/* ── Text Content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-[18px] font-bold text-[#0E172A] leading-snug mb-3 max-w-[240px]">
          {cardData.title}
        </h3>
        <p className="text-[13px] text-[#62718A] leading-relaxed max-w-[320px]">
          {cardData.description}
        </p>
      </div>
    </div>
  );
}

export default MyDiscipleshipLeadEmptyState;