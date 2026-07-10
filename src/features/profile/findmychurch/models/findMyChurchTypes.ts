// features/profile/findmychurch/models/findMyChurchTypes.ts
// Model layer: pure TypeScript. Types and interfaces only. No functions, no hooks.

export interface Church {
  id: number;
  name: string;
  location: string;
  imageUrl?: string | null;
}
