const STORAGE_KEY = "yebone_property_favorites";

export const getPropertyFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isPropertyFavorite = (listingId) => getPropertyFavorites().includes(listingId);

export const togglePropertyFavorite = (listingId) => {
  const current = getPropertyFavorites();
  const next = current.includes(listingId)
    ? current.filter((id) => id !== listingId)
    : [...current, listingId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.includes(listingId);
};

export default togglePropertyFavorite;
