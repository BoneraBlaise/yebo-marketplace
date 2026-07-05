import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllFlashSales from "../../components/Shop/AllFlashSales";

const ShopAllFlashSales = () => (
  <VendorDashboardLayout active={13} bare>
    <AllFlashSales />
  </VendorDashboardLayout>
);

export default ShopAllFlashSales;
