import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import OrderDetails from "../../components/Shop/OrderDetails";

const ShopOrderDetails = () => (
  <VendorDashboardLayout active={2} bare>
    <OrderDetails />
  </VendorDashboardLayout>
);

export default ShopOrderDetails;
