import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllBids from "../../components/Shop/AllBids";

const ShopAllBids = () => (
  <VendorDashboardLayout active={14} bare>
    <AllBids />
  </VendorDashboardLayout>
);

export default ShopAllBids;
