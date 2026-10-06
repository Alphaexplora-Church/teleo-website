export type LeadGroupStatus = "Active" | "Paused";
export type MemberStatus = "Active" | "Paused";

export interface GroupMemberItem {
  id: string;
  name: string;
  initials: string;
  joined_date: string;
  note?: string;
  status: MemberStatus;
}

export interface NextGatheringData {
  timing?: string;
  subtitle?: string;
  location?: string;
  virtual_link?: string;
  gathering_type?: string;
}

export interface CurrentStudyData {
  module_badge?: string;
  title?: string;
  lesson_subtitle?: string;
}

export interface LeadGroupItem {
  id: string;
  name: string;
  church_name?: string;
  leader_name?: string;
  members_count: number;
  next_gathering_preview: string;
  status: LeadGroupStatus;
  next_gathering?: NextGatheringData | null;
  current_study?: CurrentStudyData;
  members: GroupMemberItem[];
}

export interface ChurchLeadGroupData {
  church_id: number;
  church_name: string;
  groups_count: number;
  groups: LeadGroupItem[];
}

export const mockLeadChurchGroups: ChurchLeadGroupData[] = [
  {
    church_id: 1,
    church_name: "GRACE COMMUNITY CHURCH",
    groups_count: 2,
    groups: [
      {
        id: "grp-lead-001",
        name: "The Fig Tree Group",
        members_count: 7,
        next_gathering_preview: "Tomorrow at 7:00 PM",
        status: "Active",
        next_gathering: {
          timing: "Tomorrow at 7:00 PM",
          subtitle: "Weekly fellowship & study",
          location: "123 Acacia St. Room 204",
          virtual_link: "meet.google.com/xyz-abc",
          gathering_type: "HYBRID",
        },
        current_study: {
          module_badge: "Module 2",
          title: "Romans 8: Life in the Spirit",
          lesson_subtitle:
            "This Week: Lesson 3 of 6 · The Flesh vs. The Spirit",
        },
        members: [
          {
            id: "mem-001",
            name: "Juan Dela Cruz",
            initials: "JD",
            joined_date: "Joined 2 months ago",
            note: "Prayer request pending",
            status: "Active",
          },
          {
            id: "mem-002",
            name: "Maria Santos",
            initials: "MS",
            joined_date: "Joined 1 month ago",
            note: "Discussion lead",
            status: "Active",
          },
          {
            id: "mem-003",
            name: "David Lim",
            initials: "DL",
            joined_date: "Paused 1 week ago",
            note: "Traveling",
            status: "Paused",
          },
          {
            id: "mem-004",
            name: "Hannah Reyes",
            initials: "HR",
            joined_date: "Joined 3 weeks ago",
            status: "Active",
          },
          {
            id: "mem-005",
            name: "Joshua Garcia",
            initials: "JG",
            joined_date: "Joined 2 months ago",
            status: "Active",
          },
          {
            id: "mem-006",
            name: "Sarah Mendoza",
            initials: "SM",
            joined_date: "Joined 4 months ago",
            status: "Active",
          },
          {
            id: "mem-007",
            name: "Christian Bautista",
            initials: "CB",
            joined_date: "Joined 5 months ago",
            status: "Active",
          },
        ],
      },
      {
        id: "grp-lead-002",
        name: "Berean Fellowship Cohort",
        members_count: 5,
        next_gathering_preview: "No upcoming gathering set",
        status: "Active",
        next_gathering: null, // Active group WITHOUT schedule set (triggers empty state schedule)
        current_study: {
          module_badge: "Module 1",
          title: "Foundations of Discipleship",
          lesson_subtitle:
            "This Week: Lesson 2 of 5 · Living as Christ's Disciple",
        },
        members: [
          {
            id: "mem-008",
            name: "Mark Anthony",
            initials: "MA",
            joined_date: "Joined 3 weeks ago",
            status: "Active",
          },
          {
            id: "mem-009",
            name: "Grace Tan",
            initials: "GT",
            joined_date: "Joined 1 month ago",
            status: "Active",
          },
          {
            id: "mem-010",
            name: "Peter Alcantara",
            initials: "PA",
            joined_date: "Joined 2 months ago",
            status: "Active",
          },
          {
            id: "mem-011",
            name: "Rachel Cruz",
            initials: "RC",
            joined_date: "Joined 2 months ago",
            status: "Active",
          },
          {
            id: "mem-012",
            name: "Timothy Soriano",
            initials: "TS",
            joined_date: "Joined 3 months ago",
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    church_id: 2,
    church_name: "METRO EAST CITY CHURCH",
    groups_count: 1,
    groups: [
      {
        id: "grp-lead-003",
        name: "Living Water Fellowship",
        members_count: 6,
        next_gathering_preview: "No upcoming gathering set",
        status: "Paused",
        next_gathering: null,
        current_study: {
          module_badge: "Module 3",
          title: "Walking in Wisdom",
          lesson_subtitle: "Lesson 1 of 4 · Proverbs Introduction",
        },
        members: [
          {
            id: "mem-013",
            name: "Daniel Padilla",
            initials: "DP",
            joined_date: "Joined 6 months ago",
            status: "Active",
          },
          {
            id: "mem-014",
            name: "Kathryn Bernardo",
            initials: "KB",
            joined_date: "Joined 6 months ago",
            status: "Active",
          },
          {
            id: "mem-015",
            name: "Enrique Gil",
            initials: "EG",
            joined_date: "Joined 4 months ago",
            status: "Paused",
          },
          {
            id: "mem-016",
            name: "Liza Soberano",
            initials: "LS",
            joined_date: "Joined 4 months ago",
            status: "Active",
          },
          {
            id: "mem-017",
            name: "Alden Richards",
            initials: "AR",
            joined_date: "Joined 2 months ago",
            status: "Active",
          },
          {
            id: "mem-018",
            name: "Maine Mendoza",
            initials: "MM",
            joined_date: "Joined 2 months ago",
            status: "Active",
          },
        ],
      },
    ],
  },
];

export function findLeadGroupById(
  groupId: string
): { group: LeadGroupItem; churchName: string } | null {
  for (const church of mockLeadChurchGroups) {
    const found = church.groups.find((g) => g.id === groupId);
    if (found) {
      return { group: found, churchName: church.church_name };
    }
  }
  return null;
}