import { ChevronLeft, ArrowRight, Clock, FileText } from "lucide-react";
import type { DiscipleshipProcessChurchApplyConfig } from "../types/discipleshipProcessChurchApply.types";

export const discipleshipProcessChurchApplyConst: DiscipleshipProcessChurchApplyConfig =
  {
    buttonBack: {
      icon: ChevronLeft,
      label: "Back to Church",
    },
    buttonSubmit: {
      icon: ArrowRight,
      label: "Submit Application",
    },
    titleHeader: "Apply to Discipleship",
    subtitle:
      "Answer honestly so church leadership can place you in the right small group.",
    footnoteText: "Complete in one sitting — drafts are not saved.",
    inputPlaceholder: "Write your response here...",
    icons: {
      clock: Clock,
      footnote: FileText,
    },
  };
