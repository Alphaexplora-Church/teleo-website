// features/services/select-church/viewModels/useSelectChurchViewModel.ts
// ViewModel layer: all state, filtering logic, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Church } from '../models/selectChurchTypes';
import { toChurch } from '../models/selectChurchTypes';
import { fetchChurches } from '../models/selectChurchApi';

// ── Helper: chunk a flat array into rows of N ──────────────────
function chunkArray<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

// ── ViewModel return type ──────────────────────────────────────
export interface FindMyChurchViewModelReturn {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
  filteredChurches: Church[];
  churchRows: Church[][];
  handleChurchSelect: (church: Church) => void;
  isLoading: boolean;
  error: string | null;
}

// ── Hook ──────────────────────────────────────────────────────
export const useFindMyChurchViewModel = (
  onChurchSelect?: (church: Church) => void,
): FindMyChurchViewModelReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allChurches, setAllChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch churches on mount ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchChurches(null, 50);
        setAllChurches(result.data.map(toChurch));
      } catch (err) {
        console.error('Failed to fetch churches:', err);
        setError('Could not load churches. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Filter churches by name, shortName, or description (case-insensitive)
  const filteredChurches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allChurches;
    return allChurches.filter(
      (church) =>
        church.name.toLowerCase().includes(q) ||
        church.shortName.toLowerCase().includes(q) ||
        (church.description && church.description.toLowerCase().includes(q)),
    );
  }, [searchQuery, allChurches]);

  // Split into rows of 3 for the grid layout
  const churchRows = useMemo(() => chunkArray(filteredChurches, 3), [filteredChurches]);

  // Stable callback wrapping the injected onChurchSelect
  const handleChurchSelect = useCallback(
    (church: Church) => {
      onChurchSelect?.(church);
    },
    [onChurchSelect],
  );

  return {
    searchQuery,
    handleSearchChange,
    filteredChurches,
    churchRows,
    handleChurchSelect,
    isLoading,
    error,
  };
};
