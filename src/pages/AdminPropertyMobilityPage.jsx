import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AdminPropertyMobilityPanel from "../components/PropertyMobility/AdminPropertyMobilityPanel";

const AdminPropertyMobilityPage = () => (
  <AdminDashboardLayout active={33} bare>
    <AdminPropertyMobilityPanel />
  </AdminDashboardLayout>
);

export default AdminPropertyMobilityPage;
