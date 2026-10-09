import { useState, useMemo } from "react";
import { MoreVertical, ChevronDown, ChevronUp, User } from "lucide-react";
import { Badge } from "../../../shared/components/Badge/Badge";
import {
    mockLeadChurchGroups,
    type GroupMemberItem,
    type MemberStatus,
} from "../models/mocks/discipleshipLead.mocks";

export type { GroupMemberItem, MemberStatus };

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

interface MemberAvatarProps {
    name: string;
    avatarUrl?: string;
    sizeClassName?: string;
    iconClassName?: string;
}

function MemberAvatar({
    name,
    avatarUrl,
    sizeClassName = "w-11 h-11",
    iconClassName = "w-5 h-5",
}: MemberAvatarProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className={`${sizeClassName} rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400`}
            aria-hidden="true"
        >
            {avatarUrl && !imageError ? (
                <img
                    src={avatarUrl}
                    alt={name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                />
            ) : (
                <User className={`${iconClassName} text-slate-400`} />
            )}
        </div>
    );
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
                {visibleMembers.map((member) => {
                    const isActive = member.status === "Active";

                    return (
                        <div
                            key={member.id}
                            className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                        >
                            {/* Member Avatar & Details */}
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                <MemberAvatar
                                    name={member.name}
                                    avatarUrl={member.avatar_url}
                                />

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