/** Shared create actions — used by modal, mobile sheet, and desktop popover */
export const CREATE_ACTIONS = [
  { id: "product", icon: "📦", title: "Create Product", desc: "Publish products for sale", step: "product" },
  { id: "property", icon: "🏠", title: "Create Property", desc: "List homes and land", step: "property" },
  { id: "vehicle", icon: "🚗", title: "Create Vehicle", desc: "List cars and mobility", step: "property" },
  { id: "event", icon: "📅", title: "Create Event", desc: "Promote sales and occasions", route: "/dashboard-create-event" },
];

export default CREATE_ACTIONS;
