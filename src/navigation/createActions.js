/** Shared create actions — used by modal, mobile sheet, and desktop popover */
export const CREATE_ACTIONS = [
  { id: "product", icon: "📦", title: "Create Product", desc: "Publish products for sale", step: "product" },
  {
    id: "property_mobility",
    icon: "🏠",
    title: "Property & Mobility",
    desc: "Homes, land, cars & more",
    step: "property",
  },
  { id: "event", icon: "📅", title: "Create Event", desc: "Promote sales and occasions", route: "/dashboard-create-event" },
];

/** Non-vendor create sheet — seller onboarding funnel */
export const GUEST_CREATE_ACTIONS = [
  {
    id: "become_seller",
    icon: "🏪",
    title: "Become a Seller",
    desc: "Open your shop on Yebone",
    route: "/seller/onboarding",
  },
  {
    id: "benefits",
    icon: "✨",
    title: "Benefits of selling",
    desc: "Reach buyers, manage orders, grow revenue",
    route: "/seller/onboarding",
    state: { highlight: "benefits" },
  },
  {
    id: "start_selling",
    icon: "🚀",
    title: "Start Selling",
    desc: "Set up your shop in minutes",
    route: "/seller/onboarding",
    state: { start: true },
  },
];

export default CREATE_ACTIONS;
