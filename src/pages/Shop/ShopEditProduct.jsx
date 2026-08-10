import React from "react";
import { useParams } from "react-router-dom";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateProductWizard from "../../components/seller-experience/CreateProductWizard";

const ShopEditProduct = () => {
  const { id } = useParams();

  return (
    <VendorDashboardLayout active={4} bare>
      <CreateProductWizard mode="edit" productId={id} />
    </VendorDashboardLayout>
  );
};

export default ShopEditProduct;
