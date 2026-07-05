import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import CreateEvent from "../../components/Shop/CreateEvent";

const ShopCreateEvents = () => (
  <VendorDashboardLayout active={6}>
    <CreateEvent />
  </VendorDashboardLayout>
);

export default ShopCreateEvents;
