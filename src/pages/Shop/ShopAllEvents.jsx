import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllEvents from "../../components/Shop/AllEvents";

const ShopAllEvents = () => (
  <VendorDashboardLayout active={5} bare>
    <AllEvents />
  </VendorDashboardLayout>
);

export default ShopAllEvents;
