import type { LucideIcon } from "lucide-react";
import type { ElementType } from "react";

export type DiscipleshipIcon = LucideIcon | ElementType<{ className?: string }>;

export interface MyDiscipleshipLeadCardProps {
    icon: DiscipleshipIcon;
    title: string;
    description: string;
}