import { useState, useMemo } from "react";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import { mockLeadChurchGroups } from "../models/mocks/discipleshipLead.mocks";

export type MemberStatus = "Active" | "Paused" | string;

export interface GroupMemberItem {
    id: string;
    name: string;
    initials?: string;
    joined_date?: string;
    note?: string;
    status?: MemberStatus;
    avatar_url?: string;
}

export interface GroupRosterListProps {
    /** Array of group members */
    members?: GroupMemberItem[];
    /** Section header title, defaults to "GROUP ROSTER" */
    headerTitle?: string;
    /** Total count displayed in header, defaults to members count */
    totalCount?: number;
    /** Initial number of items visible (default is 3) */
    initialVisibleCount?: number;
    /** Number of items to reveal on each click (default is 3) */
    step?: number;
    /** Sorting criteria: "name" sorts alphabetically, "none" preserves original order */
    sortBy?: "name" | "none";
    /** Custom remaining label generator */
    viewRemainingLabel?: (remaining: number) => string;
    /** Label when all items are displayed to collapse back */
    collapseLabel?: string;
    /** Action click callback for a member */
    onMemberAction?: (member: GroupMemberItem) => void;
    /** Custom wrapper styling */
    className?: string;
}

const DEFAULT_MEMBERS = mockLeadChurchGroups[0]?.groups[0]?.members ?? [];

const AVATAR_PALETTE = [
    "bg-slate-100 text-slate-700",
    "bg-blue-100 text-blue-700",
    "bg-slate-100 text-slate-700",
    "bg-indigo-100 text-indigo-700",
    "bg-slate-100 text-slate-700",
];

function getInitials(name: string, fallback?: string): string {
    if (fallback) return fallback;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function GroupRosterList({
    members = DEFAULT_MEMBERS,
    headerTitle = "GROUP ROSTER",
    totalCount,
    initialVisibleCount = 3,
    step = 3,
    sortBy = "name",
    viewRemainingLabel,
    collapseLabel = "Show less",
    onMemberAction,
    className = "",
}: GroupRosterListProps) {
    const [visibleCount, setVisibleCount] = useState<number>(initialVisibleCount);

    // Sort members alphabetically by name if sortBy === "name"
    const sortedMembers = useMemo(() => {
        if (sortBy === "name") {
            return [...members].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );
        }
        return members;
    }, [members, sortBy]);

    const displayTotalCount = totalCount ?? sortedMembers.length;
    const visibleMembers = sortedMembers.slice(0, visibleCount);
    const remainingCount = Math.max(0, sortedMembers.length - visibleCount);
    const isAllVisible = visibleCount >= sortedMembers.length;

    const handleToggle = () => {
        if (isAllVisible) {
            setVisibleCount(initialVisibleCount);
        } else {
            setVisibleCount((prev) => Math.min(sortedMembers.length, prev + step));
        }
    };

    const remainingText = viewRemainingLabel
        ? viewRemainingLabel(remainingCount)
        : `View remaining ${remainingCount} ${remainingCount === 1 ? "disciple" : "disciples"
        }`;

    return (
        <div className={`w-full space-y-2.5 select-none ${className}`.trim()}>
            {/* ── Section Header ────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    {headerTitle} ({displayTotalCount})
                </h3>
            </div>

            {/* ── Members Card Container ────────────────────────────────── */}
            <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden divide-y divide-slate-100">
                {visibleMembers.map((member, index) => {
                    const initials = getInitials(member.name, member.initials);
                    const avatarColor = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
                    const isActive = member.status === "Active";

                    return (
                        <div
                            key={member.id}
                            className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                        >
                            {/* Member Avatar & Details */}
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                <div
                                    className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center font-bold text-[13px] tracking-wide shrink-0`}
                                    aria-hidden="true"
                                >
                                    {initials}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="text-[15px] font-bold text-slate-900 leading-snug truncate">
                                        {member.name}
                                    </h4>
                                    <p className="text-[12.5px] text-slate-500 truncate mt-0.5">
                                        {member.joined_date}
                                        {member.note ? ` · ${member.note}` : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge & Options Menu */}
                            <div className="flex items-center gap-2 shrink-0">
                                {member.status && (
                                    <Badge
                                        label={member.status}
                                        variant={isActive ? "success" : "outline"}
                                        size="sm"
                                        dotVisible={false}
                                        className={`font-semibold text-[11px] tracking-wider px-2.5 py-0.5 shrink-0 ${!isActive ? "border-slate-300 text-slate-600" : ""
                                            }`}
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() => onMemberAction?.(member)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
                                    aria-label={`Options for ${member.name}`}
                                >
                                    <MoreVertical className="w-4 h-4 shrink-0" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* ── Expand / Collapse Footer Bar ─────────────────────────── */}
                {sortedMembers.length > initialVisibleCount && (
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="w-full bg-slate-50/70 hover:bg-slate-100 p-3.5 text-center flex items-center justify-center gap-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors border-t border-slate-100 select-none"
                    >
                        <span>{isAllVisible ? collapseLabel : remainingText}</span>
                        {isAllVisible ? (
                            <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default GroupRosterList;