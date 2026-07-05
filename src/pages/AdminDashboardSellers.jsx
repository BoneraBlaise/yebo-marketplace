import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllSellers from "../components/Admin/AllSellers";

const AdminDashboardSellers = () => (
  <AdminDashboardLayout active={3} bare>
    <AllSellers />
  </AdminDashboardLayout>
);

export default AdminDashboardSellers;
