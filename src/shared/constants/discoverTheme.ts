// shared/constants/discoverTheme.ts
// The Discover top nav and the hero directly beneath it are two separate DOM
// elements (one sticky, one scrolls with content), but they should read as a
// single continuous glowing panel. To do that they share the exact same
// background image/size and are each offset by background-position so the
// pattern lines up perfectly across the seam — the top nav shows the pattern
// from y=0, the hero shows it starting at y=TOP_NAV_HEIGHT, with no visible
// jump in color or shape between them.

export const TOP_NAV_HEIGHT = 59;

export const DISCOVER_GRADIENT_IMAGE =
  'radial-gradient(340px 320px at 36px -80px, rgba(51,110,249,0.55) 0%, rgba(51,110,249,0) 60%), ' +
  'radial-gradient(300px 280px at 424px -20px, rgba(90,150,255,0.4) 0%, rgba(90,150,255,0) 65%), ' +
  'radial-gradient(360px 300px at 270px 300px, rgba(51,110,249,0.35) 0%, rgba(51,110,249,0) 65%)';

export const DISCOVER_GRADIENT_SIZE = '448px 460px';
