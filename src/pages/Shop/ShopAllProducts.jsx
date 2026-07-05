import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllProducts from "../../components/Shop/AllProducts";

const ShopAllProducts = () => (
  <VendorDashboardLayout active={3} bare>
    <AllProducts />
  </VendorDashboardLayout>
);

export default ShopAllProducts;
