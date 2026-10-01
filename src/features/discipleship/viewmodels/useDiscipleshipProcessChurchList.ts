import { useState, useMemo, useCallback } from "react";
import { mockDiscipleshipChurches } from "../models/mocks/discipleshipChurches.mocks";
import type { DiscipleshipChurchItem } from "../models/types/discipleshipProcessChurchList.types";

export interface UseDiscipleshipProcessChurchListOptions {
  churches?: DiscipleshipChurchItem[];
}

export function useDiscipleshipProcessChurchList(
  options?: UseDiscipleshipProcessChurchListOptions
) {
  const [searchQuery, setSearchQuery] = useState("");

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
    return filteredChurches.filter((church) => church.is_home_church);
  }, [filteredChurches]);

  const otherChurches = useMemo(() => {
    return filteredChurches.filter((church) => !church.is_home_church);
  }, [filteredChurches]);

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
