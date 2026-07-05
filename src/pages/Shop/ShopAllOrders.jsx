import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllOrders from "../../components/Shop/AllOrders";

const ShopAllOrders = () => (
  <VendorDashboardLayout active={2} bare>
    <AllOrders />
  </VendorDashboardLayout>
);

export default ShopAllOrders;
