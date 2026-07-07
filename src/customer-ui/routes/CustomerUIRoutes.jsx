import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyRouteFallback } from "../../application";

const CustomerHomePage = lazy(() => import("../pages/CustomerHomePage"));
const CustomerSearchPage = lazy(() => import("../pages/CustomerSearchPage"));
const CustomerCategoryPage = lazy(() => import("../pages/CustomerCategoryPage"));
const CustomerProductListingPage = lazy(() => import("../pages/CustomerProductListingPage"));
const CustomerProductDetailsPage = lazy(() => import("../pages/CustomerProductDetailsPage"));
const CustomerWishlistPage = lazy(() => import("../pages/CustomerWishlistPage"));
const CustomerComparePage = lazy(() => import("../pages/CustomerComparePage"));
const CustomerCartPage = lazy(() => import("../pages/CustomerCartPage"));
const CustomerCheckoutPage = lazy(() => import("../pages/CustomerCheckoutPage"));
const CustomerOrdersPage = lazy(() => import("../pages/CustomerOrdersPage"));
const CustomerOrderDetailsPage = lazy(() => import("../pages/CustomerOrderDetailsPage"));
const CustomerProfilePage = lazy(() => import("../pages/CustomerProfilePage"));

/** Customer UI routes — opt-in, not wired to App.js — Phase 8H.2 */
export const CustomerUIRoutes = () => (
  <Suspense fallback={<LazyRouteFallback />}>
    <Routes>
      <Route path="/customer-ui" element={<CustomerHomePage />} />
      <Route path="/customer-ui/search" element={<CustomerSearchPage />} />
      <Route path="/customer-ui/category/:categoryName?" element={<CustomerCategoryPage />} />
      <Route path="/customer-ui/products" element={<CustomerProductListingPage />} />
      <Route path="/customer-ui/product/:id" element={<CustomerProductDetailsPage />} />
      <Route path="/customer-ui/wishlist" element={<CustomerWishlistPage />} />
      <Route path="/customer-ui/compare" element={<CustomerComparePage />} />
      <Route path="/customer-ui/cart" element={<CustomerCartPage />} />
      <Route path="/customer-ui/checkout" element={<CustomerCheckoutPage />} />
      <Route path="/customer-ui/orders" element={<CustomerOrdersPage />} />
      <Route path="/customer-ui/orders/:id" element={<CustomerOrderDetailsPage />} />
      <Route path="/customer-ui/profile" element={<CustomerProfilePage />} />
    </Routes>
  </Suspense>
);

export default CustomerUIRoutes;
