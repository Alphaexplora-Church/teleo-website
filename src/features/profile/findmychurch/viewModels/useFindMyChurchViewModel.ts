// features/profile/findmychurch/viewModels/useFindMyChurchViewModel.ts
// ViewModel layer: all state, filtering logic, and derived data.
// NO JSX. Returns only what the View needs.

import { useState, useMemo, useCallback } from 'react';
import type { Church } from '../models/findMyChurchTypes';
import { PLACEHOLDER_CHURCHES } from '../models/findMyChurchApi';

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
}

// ── Hook ──────────────────────────────────────────────────────
export const useFindMyChurchViewModel = (
  onChurchSelect?: (church: Church) => void,
): FindMyChurchViewModelReturn => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Filter churches by name or location (case-insensitive)
  const filteredChurches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PLACEHOLDER_CHURCHES;
    return PLACEHOLDER_CHURCHES.filter(
      (church) =>
        church.name.toLowerCase().includes(q) ||
        church.location.toLowerCase().includes(q),
    );
  }, [searchQuery]);

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
  };
};
