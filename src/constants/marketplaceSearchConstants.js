/** Unified marketplace search verticals and curated trending queries. */
export const SEARCH_VERTICALS = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "property", label: "Property" },
  { id: "mobility", label: "Mobility" },
  { id: "events", label: "Events" },
];

export const TRENDING_MARKETPLACE_SEARCHES = [
  "White sneakers under 50000 RWF",
  "Apartments in Kigali",
  "Toyota car for sale",
  "Samsung phone deals",
  "Concert tickets Kigali",
  "Houses for rent Gasabo",
  "Ankara fashion",
  "Motorcycle rental",
];

export const SEARCH_DEBOUNCE_MS = 300;

export const resolveListingType = (vertical) => {
  if (vertical === "property") return "property";
  if (vertical === "mobility") return "vehicle";
  return undefined;
};

export default SEARCH_VERTICALS;
