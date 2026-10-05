import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ArrowRight, Clock, FileText } from "lucide-react";
import type { DiscipleshipProcessChurchApplyConfig } from "../types/discipleshipProcessChurchApply.types";

export const DISCIPLESHIP_PROCESS_CHURCH_APPLY_ICONS: Record<string, LucideIcon> = {
  back: ChevronLeft,
  submit: ArrowRight,
  clock: Clock,
  footnote: FileText,
};

export const discipleshipProcessChurchApplyConst: DiscipleshipProcessChurchApplyConfig =
  {
    buttonBack: {
      icon: DISCIPLESHIP_PROCESS_CHURCH_APPLY_ICONS.back,
      label: "Back to Church",
    },
    buttonSubmit: {
      icon: DISCIPLESHIP_PROCESS_CHURCH_APPLY_ICONS.submit,
      label: "Submit Application",
    },
    titleHeader: "Apply to Discipleship",
    subtitle:
      "Answer honestly so church leadership can place you in the right small group.",
    footnoteText: "Complete in one sitting — drafts are not saved.",
    inputPlaceholder: "Write your response here...",
    icons: {
      clock: DISCIPLESHIP_PROCESS_CHURCH_APPLY_ICONS.clock,
      footnote: DISCIPLESHIP_PROCESS_CHURCH_APPLY_ICONS.footnote,
    },
  };
