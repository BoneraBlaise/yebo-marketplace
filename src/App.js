import React, { useEffect, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-quill/dist/quill.snow.css';
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
  BidsPage,
  FlashSalePage,
  BidDetailsPage,
  FlashSaleDetailsPage,
} from "./routes/Routes.js";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopCreateFlashSale,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopPreviewPage,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage,
  ShopAllFlashSales,
  ShopCreateBid,
  ShopAllBids,
} from "./routes/ShopRoutes";
import {
  AdminDashboardPage,
  AdminDashboardUsers,
  AdminDashboardSellers,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithdraw,
} from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { ShopHomePage } from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.js";
import ResetPasswordPage from "./pages/ResetPasswordPage.js";
//Legal files import
import TermsPage from "./pages/legal/TermsPage.js";
import CookiesPage from "./pages/legal/CookiesPage.js";
import ShippingPage from "./pages/legal/ShippingPage.js";
import ContactPage from "./pages/legal/ContactPage.js";
import LocationsPage from "./pages/legal/LocationsPage.js";
import LiveChatPage from "./pages/legal/LiveChatPage.js";
import CareerPage from "./pages/legal/CareerPage.js";
import SellingPage from "./pages/legal/SellingPage.js";
import TransactionPage from "./pages/legal/TransactionPage.js";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage.js";
import BlogPage from "./pages/legal/BlogPage.js";
import AboutPage from "./pages/legal/AboutPage.js";
import BlogDetailsPage from "./pages/legal/BlogDetailsPage.js";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import Loader from "./components/Layout/Loader";
//Bids and Flashsales
import { getAllFlashSales } from "./redux/actions/flashSale.js";
import { getActiveBids } from "./redux/actions/bids.js";
import LoginSuccessHandler from "./components/Login/LoginSuccessHandler";
import CommissionDashboard from "./components/Commission/CommissionDashboard";
import { ReferralProvider } from './context/ReferralContext';
import { AIProvider } from "./components/ai/core/AIContext";
import GlobalAIFab from "./components/ai/GlobalAIFab";
import AppLayout from "./components/Layout/AppLayout";
import "./components/ai/core/ai.css";

// Google Analytics tracking code inside App component
const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Send page view to Google Analytics on route change
    window.gtag("config", "G-M3HYHLZ70H", {
      page_path: location.pathname,
    });
  }, [location]);

  return null; // This component doesn't render anything
};

// Fallback loading component for Suspense
const LoadingFallback = () => <Loader />;

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    Store.dispatch(getAllFlashSales());
    Store.dispatch(getActiveBids());
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || ""}>
      <ReferralProvider>
        <AIProvider>
        <ErrorBoundary>
        <GoogleAnalytics />
        <Suspense fallback={<LoadingFallback />}>
        <div>
          <Routes>
            {/* Auth & onboarding — no global chrome */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/activation/:activation_token" element={<ActivationPage />} />
            <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route path="/login-success" element={<LoginSuccessHandler />} />

            {/* Global Header + Footer shell */}
            <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/flash-sales" element={<FlashSalePage />} />
            <Route path="/bids" element={<BidsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/bid/:bidId" element={<BidDetailsPage />} />

            {/* Legal & info */}
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/live-chat" element={<LiveChatPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="/selling" element={<SellingPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailsPage />} />

            <Route path="/flashsale/:flashSaleId" element={<FlashSaleDetailsPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <UserInbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/track/order/:id"
              element={
                <ProtectedRoute>
                  <TrackOrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route
              path="/shop/:id"
              element={
                <SellerProtectedRoute>
                  <ShopHomePage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <SellerProtectedRoute>
                  <ShopSettingsPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <SellerProtectedRoute>
                  <ShopDashboardPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-product"
              element={
                <SellerProtectedRoute>
                  <ShopCreateProduct />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-flashsale"
              element={
                <SellerProtectedRoute>
                  <ShopCreateFlashSale />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-flashsales"
              element={
                <SellerProtectedRoute>
                  <ShopAllFlashSales />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-bids"
              element={
                <SellerProtectedRoute>
                  <ShopAllBids />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-start-auction"
              element={
                <SellerProtectedRoute>
                  <ShopCreateBid />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-orders"
              element={
                <SellerProtectedRoute>
                  <ShopAllOrders />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-refunds"
              element={
                <SellerProtectedRoute>
                  <ShopAllRefunds />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <SellerProtectedRoute>
                  <ShopOrderDetails />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-products"
              element={
                <SellerProtectedRoute>
                  <ShopAllProducts />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-create-event"
              element={
                <SellerProtectedRoute>
                  <ShopCreateEvents />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-events"
              element={
                <SellerProtectedRoute>
                  <ShopAllEvents />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-coupouns"
              element={
                <SellerProtectedRoute>
                  <ShopAllCoupouns />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-withdraw-money"
              element={
                <SellerProtectedRoute>
                  <ShopWithDrawMoneyPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/dashboard-messages"
              element={
                <SellerProtectedRoute>
                  <ShopInboxPage />
                </SellerProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-users"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardUsers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-sellers"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardSellers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-orders"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardOrders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-products"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardProducts />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-events"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardEvents />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-withdraw-request"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWithdraw />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/commission/dashboard"
              element={
                <ProtectedRoute>
                  <CommissionDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // can be set dynamically if needed
          className="custom-toast-container" // Add custom class name for easier targeting
        />
        <GlobalAIFab />
        </Suspense>
        </ErrorBoundary>
        </AIProvider>
      </ReferralProvider>
    </BrowserRouter>
  );
};

export default App;
