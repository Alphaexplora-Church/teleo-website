// features/profile/findmychurch/models/findMyChurchApi.ts
// Model layer: API contract definitions. No functions, no hooks — type declarations only.
// When a real backend endpoint exists, add the fetch call in the ViewModel.

import type { Church } from './selectChurchTypes';

// Shape of the API response (future-ready)
export interface FindMyChurchApiResponse {
  churches: Church[];
}

// Placeholder static data used by the ViewModel until the API is ready.
// Kept here (not in ViewModel) because it defines the shape of expected API data.
export const PLACEHOLDER_CHURCHES: Church[] = [
  { id: 1, name: 'Sunday Church Philippines', location: 'Marikina City' },
  { id: 2, name: 'Monday Church Philippines', location: 'Marikina City' },
  { id: 3, name: 'Tuesday Church Philippines', location: 'Marikina City' },
  { id: 4, name: 'Wednesday Church Philippines', location: 'Marikina City' },
  { id: 5, name: 'Sunday Church Philippines', location: 'Marikina City' },
];
