import type {
  SharedButtonProps,
  ComponentIcon,
} from "../../../../shared/models/types/components.types";
import type { DiscipleshipIntakeQuestion } from "../mocks/discipleshipIntakeQuestion.mocks";
import type { DiscipleshipChurch } from "./myDiscipleshipEmptyState.types";

export interface DiscipleshipProcessChurchApplyConfig {
  buttonBack: SharedButtonProps;
  buttonSubmit: SharedButtonProps;
  titleHeader: string;
  subtitle: string;
  footnoteText: string;
  icons: {
    clock: ComponentIcon;
    footnote: ComponentIcon;
  };
}

export interface DiscipleshipProcessChurchApplyProps {
  churchId?: number;
  church?: DiscipleshipChurch;
  questions?: DiscipleshipIntakeQuestion[];
  config?: Partial<DiscipleshipProcessChurchApplyConfig>;
  onBack?: () => void;
  onSubmit?: (answers: Record<string, string>) => void;
  className?: string;
}
