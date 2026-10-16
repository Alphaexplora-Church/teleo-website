import type { LucideIcon } from "lucide-react";

export type MyDiscipleshipGroupsLeadScheduleEmptyStateIcons = Record<string, LucideIcon>;

export interface MyDiscipleshipGroupsLeadScheduleEmptyStateConfig {
  /** Section/Card header title, e.g. "MEETING SCHEDULE" */
  headerTitle: string;
  /** Empty state main title, e.g. "No Gathering Schedule Set" */
  title: string;
  /** Empty state descriptive paragraph */
  description: string;
  /** Primary action button label, e.g. "Set Schedule & Location" */
  setScheduleButtonLabel: string;
}

export interface MyDiscipleshipGroupsLeadScheduleEmptyStateProps {
  /** Optional static UI copy configuration */
  config?: MyDiscipleshipGroupsLeadScheduleEmptyStateConfig;
  /** Callback fired when "Set Schedule & Location" button is clicked */
  onSetSchedule?: () => void;
  /** Custom wrapper styling */
  className?: string;
}
