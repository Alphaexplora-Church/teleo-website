export interface DiscipleshipChurchMock {
  church_id: number;
  name: string;
  city: string;
  is_home_church: boolean;
  active_groups_count: number;
  is_registered?: boolean;
}

export const mockDiscipleshipChurches: DiscipleshipChurchMock[] = [
  {
    church_id: 101,
    name: "Grace Community Church",
    city: "Dasmariñas City",
    is_home_church: true,
    is_registered: true,
    active_groups_count: 6,
  },
  {
    church_id: 102,
    name: "Riverside Fellowship",
    city: "Makati City",
    is_home_church: false,
    active_groups_count: 3,
  },
  {
    church_id: 105,
    name: "Victory Christian Fellowship",
    city: "Taguig City",
    is_home_church: false,
    active_groups_count: 8,
  },
  {
    church_id: 106,
    name: "Christ Commission Fellowship",
    city: "Pasig City",
    is_home_church: false,
    active_groups_count: 12,
  },
  {
    church_id: 107,
    name: "Faith Community Bible Church",
    city: "Muntinlupa City",
    is_home_church: false,
    active_groups_count: 5,
  },
  {
    church_id: 108,
    name: "Metro South Bible Fellowship",
    city: "Parañaque City",
    is_home_church: false,
    active_groups_count: 3,
  },
  {
    church_id: 109,
    name: "Cornerstone Christian Church",
    city: "Mandaluyong City",
    is_home_church: false,
    active_groups_count: 4,
  },
];

export const mockChurchesFootnote =
  "You can apply to any church. Placements are decided by church leaders.";