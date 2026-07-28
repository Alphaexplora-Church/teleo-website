// features/profile/findmychurch/models/findMyChurchTypes.ts
// Model layer: pure TypeScript. Types and interfaces only. No functions, no hooks.

/** Shape of a church record returned by GET /api/churches/ */
export interface ChurchApiRecord {
  church_id: number;
  church_name: string;
  short_name: string;
  church_description: string | null;
  church_email: string | null;
  church_phone_num: string | null;
  logo_url: string | null;
  cover_photo_url: string | null;
}

/** Pagination metadata from the churches list endpoint. */
export interface ChurchListMeta {
  next_cursor: string | null;
  has_more: boolean;
}

/** Frontend-friendly alias used by search cards. */
export interface Church {
  id: number;
  name: string;
  shortName: string;
  description: string | null;
  imageUrl: string | null;
}

/** Maps a raw API record to the frontend Church shape. */
export function toChurch(record: ChurchApiRecord): Church {
  return {
    id: record.church_id,
    name: record.church_name,
    shortName: record.short_name,
    description: record.church_description,
    imageUrl: record.logo_url,
  };
}
