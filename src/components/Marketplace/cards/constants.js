/** Phase 8H.8 — shared marketplace card constants */

export const MARKETPLACE_CARD_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
};

export const MARKETPLACE_GRID_COLUMNS = {
  mobile: 2,
  tablet: 3,
  laptop: 4,
  desktop: 5,
};

export const MARKETPLACE_SWIPE_PAGE_SIZE = 4;

export const chunkArray = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};
