import type {
  SharedButtonProps,
  ComponentIcon,
} from "../../../../shared/models/types/components.types";
import type { DiscipleshipProgramDetail } from "../mocks/discipleshipProgramIntro.mocks";

export interface DiscipleshipProcessIntroConfig {
  buttonBack: SharedButtonProps;
  buttonApply: SharedButtonProps;
  formatPrefix: string;
  footnoteText: string;
  icons: {
    format: ComponentIcon;
    lock: ComponentIcon;
  };
}

export interface DiscipleshipProcessIntroProps {
  churchId?: number;
  programDetail?: DiscipleshipProgramDetail;
  config?: Partial<DiscipleshipProcessIntroConfig>;
  onBack?: () => void;
  onApply?: () => void;
  className?: string;
}
