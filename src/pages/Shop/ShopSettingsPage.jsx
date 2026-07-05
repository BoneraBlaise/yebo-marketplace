import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import ShopSettings from "../../components/Shop/ShopSettings";

const ShopSettingsPage = () => (
  <VendorDashboardLayout active={11} bare>
    <ShopSettings />
  </VendorDashboardLayout>
);

export default ShopSettingsPage;
