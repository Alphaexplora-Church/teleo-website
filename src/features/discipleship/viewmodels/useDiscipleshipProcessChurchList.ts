import { useState, useMemo, useCallback } from "react";
import { mockDiscipleshipChurches } from "../models/mocks/discipleshipChurches.mocks";
import type { DiscipleshipChurchItem } from "../models/types/discipleshipProcessChurchList.types";

export interface UseDiscipleshipProcessChurchListOptions {
  churches?: DiscipleshipChurchItem[];
  pendingChurchIds?: number[];
}

export function useDiscipleshipProcessChurchList(
  options?: UseDiscipleshipProcessChurchListOptions
) {
  const [searchQuery, setSearchQuery] = useState("");
  const pendingIds = options?.pendingChurchIds ?? [];

  const allChurches: DiscipleshipChurchItem[] = useMemo(() => {
    return options?.churches ?? mockDiscipleshipChurches;
  }, [options?.churches]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredChurches = useMemo(() => {
    if (!normalizedQuery) return allChurches;

    return allChurches.filter((church) => {
      const nameMatch = church.name.toLowerCase().includes(normalizedQuery);
      const cityMatch = (church.city ?? "").toLowerCase().includes(normalizedQuery);
      return nameMatch || cityMatch;
    });
  }, [allChurches, normalizedQuery]);

  const homeChurches = useMemo(() => {
    return filteredChurches
      .filter((church) => church.is_home_church)
      .sort((a, b) => {
        const aPending = pendingIds.includes(a.church_id);
        const bPending = pendingIds.includes(b.church_id);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return 0;
      });
  }, [filteredChurches, pendingIds]);

  const otherChurches = useMemo(() => {
    return filteredChurches
      .filter((church) => !church.is_home_church)
      .sort((a, b) => {
        const aPending = pendingIds.includes(a.church_id);
        const bPending = pendingIds.includes(b.church_id);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return 0;
      });
  }, [filteredChurches, pendingIds]);

  const availableCount = otherChurches.length;
  const hasResults = homeChurches.length > 0 || otherChurches.length > 0;
  const hasQuery = normalizedQuery.length > 0;

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    homeChurches,
    otherChurches,
    availableCount,
    hasResults,
    hasQuery,
  };
}
