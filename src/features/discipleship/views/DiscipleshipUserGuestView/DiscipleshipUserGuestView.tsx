import type React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/components/Button/Button";
import { ChurchCardSkeleton } from "../../components/skeletons/ChurchListSkeleton";
import { discipleshipUserGuestViewConst } from "../../models/constants/discipleshipUserGuestView.constant";
import type { DiscipleshipUserGuestViewProps } from "../../models/types/discipleshipUserGuestView.types";

export type { DiscipleshipUserGuestViewProps };

/**
 * Discipleship Guest POV View
 * Shown when an unauthenticated guest visits the discipleship view.
 * Features the "Join a Discipleship" card that navigates to Teleo welcome screen (/welcome),
 * and locked, non-scrollable church list skeletons below.
 */
export function DiscipleshipUserGuestView({
  onJoin,
  config: userConfig,
  className = "",
}: DiscipleshipUserGuestViewProps = {}): React.JSX.Element {
  const navigate = useNavigate();

  const config = {
    ...discipleshipUserGuestViewConst,
    ...userConfig,
    joinCard: {
      ...discipleshipUserGuestViewConst.joinCard,
      ...userConfig?.joinCard,
      buttonJoin: {
        ...discipleshipUserGuestViewConst.joinCard.buttonJoin,
        ...userConfig?.joinCard?.buttonJoin,
      },
    },
    churchList: {
      ...discipleshipUserGuestViewConst.churchList,
      ...userConfig?.churchList,
    },
  };

  const { icon: ChurchIcon, title, description, buttonJoin } = config.joinCard;
  const ArrowIcon = buttonJoin.icon;

  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    } else {
      navigate(buttonJoin.to ?? "/welcome");
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto space-y-5 select-none overflow-hidden ${className}`.trim()}
    >
      {/* ── Guest Welcome / Join Discipleship Card ──────────────── */}
      <div className="w-full bg-[#F1F5F9] border border-slate-100 rounded-3xl p-6 text-center flex flex-col items-center shadow-xs">
        {/* Church Icon Circle Badge */}
        {ChurchIcon && (
          <div className="w-14 h-14 rounded-full bg-slate-200/80 flex items-center justify-center mb-4 shrink-0">
            <ChurchIcon className="w-6 h-6 text-slate-800" />
          </div>
        )}

        {/* Heading & Subtitle */}
        <div className="mb-6 space-y-2">
          <h2 className="text-[17px] font-bold text-slate-900 leading-snug">
            {title}
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            {description}
          </p>
        </div>

        {/* Join Button -> Navigates to Teleo Welcome Screen */}
        <Button
          type="button"
          variant={buttonJoin.variant ?? "primary"}
          size={buttonJoin.size ?? "md"}
          fullWidth
          onClick={handleJoin}
          className="text-white flex items-center justify-center gap-2 cursor-pointer shadow-btn"
        >
          <span>{buttonJoin.label}</span>
          {ArrowIcon && <ArrowIcon className="w-4 h-4 shrink-0" />}
        </Button>
      </div>

      {/* ── Non-scrollable Church List Skeletons ────────────────── */}
      <div
        className="w-full space-y-4 select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* ── Your Home Church Section ───────────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase px-0.5">
            {config.churchList.homeChurchHeader}
          </h3>
          <ChurchCardSkeleton />
        </section>

        {/* ── Explore Other Churches Section ─────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase px-0.5">
            {config.churchList.exploreOtherHeader}
          </h3>
          <div className="space-y-2.5">
            <ChurchCardSkeleton />
            <ChurchCardSkeleton />
          </div>
        </section>
      </div>
    </div>
  );
}

export default DiscipleshipUserGuestView;