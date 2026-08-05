/** Persist recent marketplace searches in localStorage (shared with YEBO SearchMemory shape). */
const STORAGE_KEY = "yebone_site_search_v1";

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { recent: [], contexts: [] };
};

const writeStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
};

export const addRecentSearch = (query, context = {}) => {
  if (!query?.trim()) return readStore();
  const data = readStore();
  const trimmed = query.trim();
  data.recent = [trimmed, ...(data.recent || []).filter((q) => q !== trimmed)].slice(0, 20);
  data.contexts = [{ query: trimmed, ...context, at: Date.now() }, ...(data.contexts || [])].slice(0, 20);
  writeStore(data);
  return data;
};

export const getRecentSearches = (limit = 5) => readStore().recent?.slice(0, limit) || [];

export const clearRecentSearches = () => {
  writeStore({ recent: [], contexts: [] });
};

export default { addRecentSearch, getRecentSearches, clearRecentSearches };
