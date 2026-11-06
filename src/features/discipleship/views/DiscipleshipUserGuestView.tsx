import type React from "react";
import { useNavigate } from "react-router-dom";
import { Church, ArrowRight } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import { ChurchCardSkeleton } from "../components/skeletons/ChurchListSkeleton";
import type { DiscipleshipUserGuestViewProps } from "../models/types/discipleshipUserGuestView.types";

export type { DiscipleshipUserGuestViewProps };

/**
 * Discipleship Guest POV View
 * Shown when an unauthenticated guest visits the discipleship view.
 * Features the "Join a Discipleship" card that navigates to Teleo welcome screen (/welcome),
 * and locked, non-scrollable church list skeletons below.
 */
export function DiscipleshipUserGuestView({
  onJoin,
  className = "",
}: DiscipleshipUserGuestViewProps = {}): React.JSX.Element {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    } else {
      navigate("/welcome");
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto space-y-5 select-none overflow-hidden ${className}`.trim()}
    >
      {/* ── Guest Welcome / Join Discipleship Card ──────────────── */}
      <div className="w-full bg-[#F1F5F9] border border-slate-100 rounded-3xl p-6 text-center flex flex-col items-center shadow-xs">
        {/* Church Icon Circle Badge */}
        <div className="w-14 h-14 rounded-full bg-slate-200/80 flex items-center justify-center mb-4 shrink-0">
          <Church className="w-6 h-6 text-slate-800" />
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6 space-y-2">
          <h2 className="text-[17px] font-bold text-slate-900 leading-snug">
            Join a Discipleship Group
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Sign in to connect with a discipleship community, join groups, and grow in your faith journey.
          </p>
        </div>

        {/* Join Button -> Navigates to Teleo Welcome Screen */}
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          onClick={handleJoin}
          className="text-white flex items-center justify-center gap-2 cursor-pointer shadow-btn"
        >
          <span>Sign In to Join</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
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
            Home Church
          </h3>
          <ChurchCardSkeleton />
        </section>

        {/* ── Explore Other Churches Section ─────────────────────── */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase px-0.5">
            Explore Other Churches
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

