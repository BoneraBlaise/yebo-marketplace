import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateFlashSale from "../../components/Shop/CreateFlashSale";

const ShopCreateFlashSale = () => (
  <VendorDashboardLayout active={12}>
    <CreateFlashSale />
  </VendorDashboardLayout>
);

export default ShopCreateFlashSale;
