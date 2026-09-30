export interface DiscipleshipChurchMock {
  church_id: number;
  name: string;
  is_home_church: boolean;
  active_groups_count: number;
}

export const mockDiscipleshipChurches: DiscipleshipChurchMock[] = [
  {
    church_id: 101,
    name: "Grace Community Church",
    is_home_church: true,
    active_groups_count: 6,
  },
  {
    church_id: 102,
    name: "Riverside Fellowship",
    is_home_church: false,
    active_groups_count: 3,
  },
];
