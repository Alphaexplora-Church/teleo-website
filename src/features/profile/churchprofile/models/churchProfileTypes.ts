// features/profile/churchprofile/models/churchProfileTypes.ts
// Model layer: pure TypeScript. No React, no hooks, no JSX.
//
// NOTE: FeedPostModel is imported from the home feature because announcements
// and events share the same shape. If a third feature also needs it, promote
// FeedPostModel to shared/models/ per the 80/20 rule.

import type { FeedPostModel } from '../../../home/models/homeTypes';

/** Represents a tab in the church profile view. */
export type ChurchProfileTab = 'overview' | 'announcements' | 'events' | 'services';

/** Static data for a tab definition (label + key). */
export interface ChurchProfileTabDef {
  key: ChurchProfileTab;
  label: string;
}

/** Service schedule data. */
export interface ChurchService {
  id: string;
  day: string;
  name: string;
  time: string;
}

/** Church profile page data. */
export interface ChurchProfileData {
  id: number;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  joinedDate: string;
  overview: string;
  announcements: FeedPostModel[];
  events: FeedPostModel[];
  services: ChurchService[];
}
