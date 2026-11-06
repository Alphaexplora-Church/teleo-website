// src/features/discipleship/viewmodels/useDiscipleshipProcessChurchList.ts
// ViewModel for Discipleship church search and filtering with live API integration.

import { useState, useMemo, useCallback, useEffect } from "react";
import type { DiscipleshipChurchItem } from "../models/types/discipleshipProcessChurchList.types";
import { fetchDiscipleshipPrograms } from "../models/api/discipleship.api";
import { mapChurchProgramsDTOToDiscipleshipChurches } from "../models/utils/discipleship.mappers";

export interface UseDiscipleshipProcessChurchListOptions {
  churches?: DiscipleshipChurchItem[];
  pendingChurchIds?: number[];
  autoFetch?: boolean;
}

const EMPTY_PENDING_IDS: number[] = [];
const EMPTY_CHURCHES: DiscipleshipChurchItem[] = [];

export function useDiscipleshipProcessChurchList(
  options?: UseDiscipleshipProcessChurchListOptions
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiChurches, setApiChurches] = useState<DiscipleshipChurchItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!options?.churches);
  const [error, setError] = useState<string | null>(null);

  const pendingChurchIds = options?.pendingChurchIds;

  const pendingIdSet = useMemo(() => {
    return new Set(pendingChurchIds ?? EMPTY_PENDING_IDS);
  }, [pendingChurchIds]);

  useEffect(() => {
    if (options?.churches) {
      setIsLoading(false);
      return;
    }

    if (options?.autoFetch !== false) {
      setIsLoading(true);
      setError(null);
      fetchDiscipleshipPrograms()
        .then((res) => {
          if (res && Array.isArray(res.churches)) {
            setApiChurches(mapChurchProgramsDTOToDiscipleshipChurches(res.churches));
          } else {
            setApiChurches([]);
          }
        })
        .catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : "Failed to load churches";
          setError(msg);
          setApiChurches([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [options?.churches, options?.autoFetch]);

  const allChurches: DiscipleshipChurchItem[] = useMemo(() => {
    if (options?.churches) return options.churches;
    return apiChurches ?? EMPTY_CHURCHES;
  }, [options?.churches, apiChurches]);

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
        const aPending = pendingIdSet.has(a.church_id);
        const bPending = pendingIdSet.has(b.church_id);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return 0;
      });
  }, [filteredChurches, pendingIdSet]);

  const otherChurches = useMemo(() => {
    return filteredChurches
      .filter((church) => !church.is_home_church)
      .sort((a, b) => {
        const aPending = pendingIdSet.has(a.church_id);
        const bPending = pendingIdSet.has(b.church_id);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return 0;
      });
  }, [filteredChurches, pendingIdSet]);

  const availableCount = filteredChurches.length;
  const hasResults = availableCount > 0;
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
    isLoading,
    error,
  };
}
