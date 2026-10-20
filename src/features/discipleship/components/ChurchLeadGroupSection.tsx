import { Church, Users, Clock } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";

export type LeadGroupStatus = "Active" | "Paused" | string;

export interface LeadGroupItem {
  id: string;
  name: string;
  members_count: number;
  next_gathering_preview: string;
  status: "Active" | "Paused" | string;
  members?: any[];
}

export interface ChurchLeadGroupData {
  church_id?: number | string;
  church_name: string;
  groups_count?: number;
  groups: LeadGroupItem[];
}

export type ChurchLeadGroupSectionData = ChurchLeadGroupData;

export interface ChurchLeadGroupSectionProps {
  /** Optional consolidated church section data object */
  section?: ChurchLeadGroupData;
  /** Church ID */
  churchId?: number | string;
  /** Church name header */
  churchName?: string;
  /** Number of groups, defaults to groups.length */
  groupsCount?: number;
  /** List of group items under this church */
  groups?: LeadGroupItem[];
  /** Callback fired when a group's card is clicked */
  onManageGroup?: (groupId: string, group: LeadGroupItem) => void;
  /** @deprecated Action label for group management row - card is now clickable */
  manageActionLabel?: string;
  /** Suffix for members count (defaults to "Members") */
  membersSuffix?: string;
  /** Header suffix for singular group (defaults to "Group") */
  singleGroupSuffix?: string;
  /** Header suffix for plural groups (defaults to "Groups") */
  multipleGroupsSuffix?: string;
  /** Label for active badge (defaults to "Active") */
  activeBadgeLabel?: string;
  /** Label for paused badge (defaults to "Paused") */
  pausedBadgeLabel?: string;
  /** Additional container styling classes */
  className?: string;
}

export function ChurchLeadGroupSection({
  section,
  churchName = section?.church_name ?? "",
  groupsCount = section?.groups_count ?? section?.groups?.length ?? 0,
  groups = section?.groups ?? [],
  onManageGroup,
  membersSuffix = "Members",
  singleGroupSuffix = "Group",
  multipleGroupsSuffix = "Groups",
  activeBadgeLabel = "Active",
  pausedBadgeLabel = "Paused",
  className = "",
}: ChurchLeadGroupSectionProps) {
  const displayGroupsCount = groups.length > 0 ? groups.length : groupsCount;
  const countSuffix =
    displayGroupsCount === 1 ? singleGroupSuffix : multipleGroupsSuffix;

  return (
    <section className={`w-full space-y-3 ${className}`.trim()}>
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 px-1 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Church className="w-4 h-4 text-slate-500 shrink-0" />
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase truncate">
            {churchName}
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {displayGroupsCount} {countSuffix}
        </span>
      </div>

      {/* ── Dynamic Group Cards List ──────────────────────────────── */}
      <div className="space-y-3">
        {groups.map((group) => {
          const isActive = group.status === "Active" || group.status?.toLowerCase() === "active";

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onManageGroup?.(group.id, group)}
              className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-3 transition-all duration-200 hover:border-slate-200 hover:shadow-md active:scale-[0.99] select-none text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 block"
            >
              {/* Card Header: Group Name and Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug">
                  {group.name}
                </h3>
                {isActive ? (
                  <Badge
                    label={activeBadgeLabel}
                    variant="success"
                    size="sm"
                    dotVisible={false}
                    className="font-bold text-[11px] px-2.5 py-0.5 tracking-wider shrink-0"
                  />
                ) : (
                  <Badge
                    label={pausedBadgeLabel}
                    variant="outline"
                    size="sm"
                    dotVisible={false}
                    className="font-semibold text-[11px] tracking-wider shrink-0 border-slate-300 text-slate-600"
                  />
                )}
              </div>

              {/* Card Details: Members count and Next Gathering */}
              <div className="flex items-center gap-2 text-[13px] text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {group.members_count} {membersSuffix}
                  </span>
                </div>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{group.next_gathering_preview}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ChurchLeadGroupSection;
