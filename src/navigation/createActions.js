/** Shared create actions — vendor menu (desktop popover + mobile sheet + create modal) */
export const CREATE_ACTIONS = [
  {
    id: "product",
    icon: "📦",
    title: "Add Product",
    desc: "List items for sale",
    step: "product",
  },
  {
    id: "property",
    icon: "🏠",
    title: "Add Property",
    desc: "Homes, land & commercial",
    step: "property",
  },
  {
    id: "vehicle",
    icon: "🚗",
    title: "Add Vehicle",
    desc: "Cars, bikes & mobility",
    step: "vehicle",
  },
  {
    id: "event",
    icon: "📅",
    title: "Add Event",
    desc: "Promote sales & occasions",
    route: "/dashboard-create-event",
  },
  {
    id: "auction",
    icon: "🔨",
    title: "Add Auction",
    desc: "Run a timed auction",
    route: "/dashboard-start-auction",
  },
  {
    id: "flash_sale",
    icon: "⚡",
    title: "Add Flash Sale",
    desc: "Limited-time deals",
    route: "/dashboard-create-flashsale",
  },
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
