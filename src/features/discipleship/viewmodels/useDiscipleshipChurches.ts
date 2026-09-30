import { useMemo } from "react";
import { mockDiscipleshipChurches } from "../mocks/discipleshipChurches.mocks";
import type { DiscipleshipChurch } from "../models/myDiscipleshipEmptyState.types";


export interface UseDiscipleshipChurchesOptions {
  churches?: DiscipleshipChurch[];
}

export function useDiscipleshipChurches(options?: UseDiscipleshipChurchesOptions) {
  const allChurches = options?.churches ?? mockDiscipleshipChurches;

  const homeChurches = useMemo(
    () => allChurches.filter((church) => church.is_home_church),
    [allChurches]
  );

  const otherChurches = useMemo(
    () => allChurches.filter((church) => !church.is_home_church),
    [allChurches]
  );

  const hasHomeChurch = homeChurches.length > 0;
  const hasOtherChurches = otherChurches.length > 0;

  return {
    allChurches,
    homeChurches,
    otherChurches,
    hasHomeChurch,
    hasOtherChurches,
  };
}
