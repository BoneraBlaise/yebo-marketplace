import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";

const ShopAllRefunds = () => (
  <VendorDashboardLayout active={10} bare>
    <AllRefundOrders />
  </VendorDashboardLayout>
);

export default ShopAllRefunds;
