import type {
  ChurchLeadGroupData,
  LeadGroupItem,
  LeadGroupStatus,
} from "../../components/ChurchLeadGroupSection";

export type { LeadGroupItem, LeadGroupStatus, ChurchLeadGroupData };

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
      },
      {
        id: "grp-lead-002",
        name: "Berean Fellowship Cohort",
        members_count: 5,
        next_gathering_preview: "Friday at 6:30 PM",
        status: "Active",
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
      },
    ],
  },
];