import { useMemo } from "react";
import { mockDiscipleshipChurches } from "../models/mocks/discipleshipChurches.mocks";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";

export interface UseDiscipleshipChurchesOptions {
  churches?: DiscipleshipChurch[];
  maxDisplayed?: number;
}

export function useDiscipleshipChurches(options?: UseDiscipleshipChurchesOptions) {
  const allChurches = options?.churches ?? mockDiscipleshipChurches;
  const maxDisplayed = options?.maxDisplayed;

  const homeChurches = useMemo(
    () => allChurches.filter((church) => church.is_home_church),
    [allChurches]
  );

  const otherChurches = useMemo(
    () => allChurches.filter((church) => !church.is_home_church),
    [allChurches]
  );

  const displayedOtherChurches = useMemo(() => {
    if (typeof maxDisplayed === "number" && maxDisplayed > 0) {
      // Fisher-Yates shuffle to randomly select churches without bias
      const shuffled = [...otherChurches];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, maxDisplayed);
    }
    return otherChurches;
  }, [otherChurches, maxDisplayed]);

  const hasMoreOtherChurches = useMemo(() => {
    if (typeof maxDisplayed === "number") {
      return otherChurches.length > maxDisplayed;
    }
    return false;
  }, [otherChurches, maxDisplayed]);

  const hasHomeChurch = homeChurches.length > 0;
  const hasOtherChurches = otherChurches.length > 0;

  return {
    allChurches,
    homeChurches,
    otherChurches,
    displayedOtherChurches,
    hasMoreOtherChurches,
    hasHomeChurch,
    hasOtherChurches,
  };
}
