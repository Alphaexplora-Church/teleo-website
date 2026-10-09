import type { LucideIcon } from "lucide-react";
import { ArrowLeft, SlidersHorizontal, ArrowRight, Lock } from "lucide-react";
import type { DiscipleshipProcessIntroConfig } from "../types/discipleshipProcessIntro.types";

export const DISCIPLESHIP_PROCESS_INTRO_ICONS: Record<string, LucideIcon> = {
  back: ArrowLeft,
  format: SlidersHorizontal,
  apply: ArrowRight,
  lock: Lock,
};

export const discipleshipProcessIntroConst: DiscipleshipProcessIntroConfig = {
  buttonBack: {
    icon: DISCIPLESHIP_PROCESS_INTRO_ICONS.back,
    label: "Back to Churches",
    to: "/discipleship/church-list",
  },
  buttonApply: {
    icon: DISCIPLESHIP_PROCESS_INTRO_ICONS.apply,
    label: "Apply / Request to Join",
  },
  formatPrefix: "Format: ",
  footnoteText: "Application details shared only with church leadership.",
  icons: {
    format: DISCIPLESHIP_PROCESS_INTRO_ICONS.format,
    lock: DISCIPLESHIP_PROCESS_INTRO_ICONS.lock,
  },
};
