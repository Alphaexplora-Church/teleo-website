// src/features/discipleship/viewmodels/useDiscipleshipChurches.ts
// ViewModel for Discipleship church list exploration and home church filtering.
// Pure live API integration: No mock data fallbacks.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { DiscipleshipChurch } from "../models/types/myDiscipleshipEmptyStateView.types";
import { fetchDiscipleshipPrograms } from "../models/api/discipleship.api";
import { mapChurchProgramsDTOToDiscipleshipChurches } from "../models/utils/discipleship.mappers";

export interface UseDiscipleshipChurchesOptions {
  churches?: DiscipleshipChurch[];
  maxDisplayed?: number;
  autoFetch?: boolean;
}

const EMPTY_CHURCHES: DiscipleshipChurch[] = [];

export function useDiscipleshipChurches(options?: UseDiscipleshipChurchesOptions) {
  const [apiChurches, setApiChurches] = useState<DiscipleshipChurch[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadChurches = useCallback(async () => {
    // If external churches were explicitly passed, don't overwrite with API
    if (options?.churches) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDiscipleshipPrograms();
      if (response && Array.isArray(response.churches)) {
        const mapped = mapChurchProgramsDTOToDiscipleshipChurches(response.churches);
        setApiChurches(mapped);
      } else {
        setApiChurches([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load discipleship churches";
      setError(message);
      setApiChurches([]);
    } finally {
      setIsLoading(false);
    }
  }, [options?.churches]);

  const hasLoadedChurchesRef = useRef(false);

  useEffect(() => {
    if (options?.autoFetch === false || options?.churches) {
      setIsLoading(false);
      return;
    }

    if (!hasLoadedChurchesRef.current) {
      hasLoadedChurchesRef.current = true;
      loadChurches();
    }
  }, [loadChurches, options?.autoFetch, options?.churches]);

  const allChurches = useMemo(() => {
    if (options?.churches) return options.churches;
    return apiChurches ?? EMPTY_CHURCHES;
  }, [options?.churches, apiChurches]);

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
    isLoading,
    error,
    refetch: loadChurches,
  };
}
