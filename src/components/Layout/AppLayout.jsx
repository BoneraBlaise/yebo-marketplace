import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ProductMinimalFooter from "./ProductMinimalFooter";
import CheckoutMinimalFooter from "./CheckoutMinimalFooter";
import "../Layout/shell-tokens.css";
import "../Home/home.css";
import "../Marketplace/cards/marketplaceCards.css";
import "../Layout/navigation/navDesignSystem.css";
import "../Layout/overlays/headerOverlays.css";

const isCheckoutFlowPath = (pathname) =>
  pathname.startsWith("/checkout") ||
  pathname.startsWith("/payment") ||
  pathname.startsWith("/order/success");

/**
 * Global production shell — single Header + Footer for all public marketplace routes.
 * Wrap routes in App.js with `<Route element={<AppLayout />}>`.
 */
const AppLayout = () => {
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/product/");
  const isCheckoutFlow = isCheckoutFlowPath(pathname);

  return (
    <div
      className={`yebone-app-shell flex flex-col min-h-screen bg-[var(--yebone-bg)] text-[var(--yebone-fg)]${
        isCheckoutFlow ? " yebone-app-shell--checkout" : ""
      }`}
    >
      <Header />
      <main id="main-content" className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </main>
      {isCheckoutFlow ? (
        <CheckoutMinimalFooter />
      ) : isProductPage ? (
        <ProductMinimalFooter />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default AppLayout;
