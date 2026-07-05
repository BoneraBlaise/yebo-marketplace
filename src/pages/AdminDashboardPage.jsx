import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain";

const AdminDashboardPage = () => (
  <AdminDashboardLayout active={1} bare>
    <AdminDashboardMain />
  </AdminDashboardLayout>
);

export default AdminDashboardPage;
