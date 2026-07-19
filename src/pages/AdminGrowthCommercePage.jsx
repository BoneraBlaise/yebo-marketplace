import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AdminGrowthCommercePanel from "../components/GrowthCommerce/AdminGrowthCommercePanel";

const AdminGrowthCommercePage = () => (
  <AdminDashboardLayout active={31} bare>
    <AdminGrowthCommercePanel />
  </AdminDashboardLayout>
);

export default AdminGrowthCommercePage;
