import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => (
  <VendorDashboardLayout active={4}>
    <CreateProduct />
  </VendorDashboardLayout>
);

export default ShopCreateProduct;
