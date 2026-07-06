import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** User preference architecture — presentation only, no persistence backend. */
export class PreferenceMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("preferences")) {
      this.storage.set("preferences", {});
    }
  }

  getAll() {
    return { ...this.storage.get("preferences", {}) };
  }

  seed(mock = {}) {
    this.storage.set("preferences", { ...mock, seeded: true });
    MemoryEvents.emit(MEMORY_EVENT.PREFERENCE_UPDATE, this.getAll());
    return this.getAll();
  }

  set(key, value) {
    const prefs = this.getAll();
    prefs[key] = value;
    this.storage.set("preferences", prefs);
    MemoryEvents.emit(MEMORY_EVENT.PREFERENCE_UPDATE, { key, value });
    return prefs;
  }

  get(key, fallback = null) {
    return this.getAll()[key] ?? fallback;
  }

  setFavoriteCategories(categories) {
    return this.set("favoriteCategories", categories);
  }

  setBudgetRange(range) {
    return this.set("budgetRange", range);
  }

  setLocale({ language, country, currency }) {
    const prefs = this.getAll();
    if (language) prefs.language = language;
    if (country) prefs.country = country;
    if (currency) prefs.currency = currency;
    this.storage.set("preferences", prefs);
    MemoryEvents.emit(MEMORY_EVENT.PREFERENCE_UPDATE, prefs);
    return prefs;
  }

  getSnapshot() {
    return this.getAll();
  }

  clear() {
    this.storage.set("preferences", {});
  }
}

export const createPreferenceMemory = (storage) => new PreferenceMemory(storage);

export default PreferenceMemory;
