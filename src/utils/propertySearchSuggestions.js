/** Curated typeahead suggestions for global search (frontend-only, no backend). */
export const PROPERTY_SEARCH_SUGGESTIONS = [
  { label: "Radisson Blu Hotel", query: "radisson blu hotel", kind: "property" },
  { label: "Radisson Apartment", query: "radisson apartment", kind: "property" },
  { label: "Radisson Office", query: "radisson office", kind: "property" },
  { label: "Apartment in Kigali", query: "apartment kigali", kind: "property" },
  { label: "House for Sale", query: "house for sale", kind: "property" },
  { label: "Villa Kigali", query: "villa kigali", kind: "property" },
  { label: "Land Plot", query: "land plot", kind: "property" },
  { label: "Office Space", query: "office space", kind: "property" },
  { label: "Toyota Prado", query: "toyota prado", kind: "vehicle" },
  { label: "Toyota Corolla", query: "toyota corolla", kind: "vehicle" },
  { label: "Toyota RAV4", query: "toyota rav4", kind: "vehicle" },
  { label: "BMW X5", query: "bmw x5", kind: "vehicle" },
  { label: "BMW 3 Series", query: "bmw 3 series", kind: "vehicle" },
  { label: "Motorcycle", query: "motorcycle", kind: "vehicle" },
];

const PROPERTY_KEYWORDS = [
  "apartment",
  "house",
  "villa",
  "land",
  "office",
  "car",
  "toyota",
  "bmw",
  "motorcycle",
  "property",
  "commercial",
  "truck",
  "radisson",
];

export const isPropertyMobilitySearchTerm = (term = "") => {
  const t = term.toLowerCase().trim();
  if (!t) return false;
  return PROPERTY_KEYWORDS.some((kw) => t.includes(kw));
};

export const matchPropertySearchSuggestions = (term = "", limit = 5) => {
  const t = term.toLowerCase().trim();
  if (t.length < 2) return [];
  return PROPERTY_SEARCH_SUGGESTIONS.filter(
    (item) => item.label.toLowerCase().includes(t) || item.query.includes(t)
  )
    .slice(0, limit)
    .map((item) => ({
      ...item,
      type: "property_listing",
      name: item.label,
      _id: `pm-suggest-${item.query.replace(/\s+/g, "-")}`,
    }));
};
