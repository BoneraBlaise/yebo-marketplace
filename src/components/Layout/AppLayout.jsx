import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../Home/home.css";
import "../Marketplace/cards/marketplaceCards.css";

/**
 * Global production shell — single Header + Footer for all public marketplace routes.
 * Wrap routes in App.js with `<Route element={<AppLayout />}>`.
 */
const AppLayout = () => (
  <div className="yebone-app-shell flex flex-col min-h-screen bg-[var(--yebone-bg)] text-[var(--yebone-fg)]">
    <Header />
    <main id="main-content" className="flex-1 flex flex-col min-h-0">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AppLayout;
