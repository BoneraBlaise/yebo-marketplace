import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => (
  <VendorDashboardLayout active={1} bare>
    <DashboardHero />
  </VendorDashboardLayout>
);

export default ShopDashboardPage;
