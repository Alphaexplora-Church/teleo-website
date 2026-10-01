import { ChevronLeft, SlidersHorizontal, ArrowRight, Lock } from "lucide-react";
import type { DiscipleshipProcessIntroConfig } from "../types/discipleshipProcessIntro.types";

export const discipleshipProcessIntroConst: DiscipleshipProcessIntroConfig = {
  buttonBack: {
    icon: ChevronLeft,
    label: "Back to Churches",
    to: "/discipleship/church-list",
  },
  buttonApply: {
    icon: ArrowRight,
    label: "Apply / Request to Join",
  },
  formatPrefix: "Format: ",
  footnoteText: "Application details shared only with church leadership.",
  icons: {
    format: SlidersHorizontal,
    lock: Lock,
  },
};
