/** YEBO Customer Experience UI — Phase 8H.2 */

/* Pages */
export { default as CustomerHomePage } from "./pages/CustomerHomePage";
export { default as CustomerSearchPage } from "./pages/CustomerSearchPage";
export { default as CustomerCategoryPage } from "./pages/CustomerCategoryPage";
export { default as CustomerProductListingPage } from "./pages/CustomerProductListingPage";
export { default as CustomerProductDetailsPage } from "./pages/CustomerProductDetailsPage";
export { default as CustomerWishlistPage } from "./pages/CustomerWishlistPage";
export { default as CustomerComparePage } from "./pages/CustomerComparePage";
export { default as CustomerCartPage } from "./pages/CustomerCartPage";
export { default as CustomerCheckoutPage } from "./pages/CustomerCheckoutPage";
export { default as CustomerOrdersPage } from "./pages/CustomerOrdersPage";
export { default as CustomerOrderDetailsPage } from "./pages/CustomerOrderDetailsPage";
export { default as CustomerProfilePage } from "./pages/CustomerProfilePage";

/* Routes */
export { CustomerUIRoutes } from "./routes/CustomerUIRoutes";

/* Shell */
export { CustomerPageShell } from "./components/CustomerPageShell";

/* Landing */
export {
  HeroSection, SearchEntry, CategoryGrid, FeaturedProducts, FeaturedVendors, PromotionsBanner,
} from "./components/landing/LandingSections";

/* Product Discovery */
export {
  ProductCard, ProductGrid, ProductFilters, ProductSort, ProductPagination,
  RecentlyViewed, TrendingProducts, ProductListing,
} from "./components/products/ProductDiscovery";

/* Product Details */
export { ProductDetailsView, AIPreviewPlaceholder } from "./components/product-details/ProductDetailsView";

/* Wishlist */
export { WishlistView, WishlistEmpty, WishlistItem } from "./components/wishlist/WishlistView";

/* Compare */
export { CompareView, FeatureComparison, PriceComparison } from "./components/compare/CompareView";

/* Cart */
export { CartView, CartItem, CouponArea, OrderSummary, ShippingSummary } from "./components/cart/CartView";

/* Checkout */
export {
  CheckoutView, ShippingAddressForm, DeliveryMethod, PaymentMethod,
  CheckoutSummary, OrderConfirmation,
} from "./components/checkout/CheckoutView";

/* Orders */
export {
  OrdersList, OrderDetailsView, OrderTimeline, TrackingPlaceholder, InvoicePlaceholder,
} from "./components/orders/OrdersView";

/* Profile */
export {
  ProfileView, ProfileHeader, AddressesView, SavedPaymentsPlaceholder,
  ProfileSettings, SecuritySettings,
} from "./components/profile/ProfileView";

/* AI Experience */
export {
  AIExperiencePanel, AIHistoryPlaceholder, AIAssetsPlaceholder,
  AIJobsPlaceholder, AIRecommendationsPlaceholder, NotificationShowcase,
} from "./components/ai/AIExperiencePanel";

/* Hooks & Data */
export { useCustomerExperience } from "./hooks/useCustomerExperience";
export * from "./data/mockCustomerData";

/* Diagnostics */
export { logCustomerUIDiagnostics } from "./diagnostics/CustomerUIDiagnostics";
