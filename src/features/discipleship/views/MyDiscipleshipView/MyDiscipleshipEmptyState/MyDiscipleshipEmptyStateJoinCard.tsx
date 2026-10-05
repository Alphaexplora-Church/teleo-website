import { LinkButton } from "../../../../../shared/components/Button/LinkButton";
import type { MyDiscipleshipEmptyStateProps } from "../../../models/types/myDiscipleshipEmptyStateView.types";

export interface MyDiscipleshipEmptyStateJoinCardProps {
  joinCardLink: MyDiscipleshipEmptyStateProps;
  onJoin?: () => void;
  className?: string;
}

export function MyDiscipleshipEmptyStateJoinCard({
  joinCardLink,
  onJoin,
  className = "",
}: MyDiscipleshipEmptyStateJoinCardProps) {
  const HeaderIcon = joinCardLink.icon;
  const { title, description, buttonJoin } = joinCardLink.joinCard;
  const ButtonIcon = buttonJoin.icon;

  return (
    <div
      className={`w-full bg-slate-100 rounded-3xl p-6 text-center flex flex-col items-center select-none ${className}`.trim()}
    >
      {/* ── Circular Icon Container ────────────────────────── */}
      {HeaderIcon && (
        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mb-4 shrink-0">
          <HeaderIcon className="w-6 h-6 text-slate-900" />
        </div>
      )}

      {/* ── Message Container ──────────────────────────────── */}
      <div className="mb-6">
        <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-2">
          {title}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed max-w-70 mx-auto">
          {description}
        </p>
      </div>

      {/* ── Join Button ────────────────────────────────────── */}
      <LinkButton
        to={buttonJoin.to ?? "/discipleship/church-list"}
        onClick={(e) => {
          if (onJoin) {
            e.preventDefault();
            onJoin();
          }
        }}
        fullWidth
        className="flex items-center justify-center gap-2"
      >
        <span>{buttonJoin.label}</span>
        {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
      </LinkButton>
    </div>
  );
}

export default MyDiscipleshipEmptyStateJoinCard;
