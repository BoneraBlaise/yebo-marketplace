import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => (
  <VendorDashboardLayout active={8} messagingLayout>
    <DashboardMessages />
  </VendorDashboardLayout>
);

export default ShopInboxPage;
