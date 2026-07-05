import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateBid from "../../components/Shop/CreateBid";

const ShopCreateBid = () => (
  <VendorDashboardLayout active={15}>
    <CreateBid />
  </VendorDashboardLayout>
);

export default ShopCreateBid;
