import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateProductWizard from "../../components/seller-experience/CreateProductWizard";

const ShopCreateProduct = () => (
  <VendorDashboardLayout active={4} bare>
    <CreateProductWizard />
  </VendorDashboardLayout>
);

export default ShopCreateProduct;
