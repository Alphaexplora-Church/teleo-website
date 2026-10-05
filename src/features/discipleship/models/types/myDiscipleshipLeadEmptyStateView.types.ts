import type { LucideIcon } from "lucide-react";
import type { ComponentIcon } from "../../../../shared/models/types/components.types";

export type MyDiscipleshipLeadEmptyStateViewIcons = Record<string, LucideIcon>;


export interface MyDiscipleshipLeadCardProps {
  icon: ComponentIcon;
  title: string;
  description: string;
}
