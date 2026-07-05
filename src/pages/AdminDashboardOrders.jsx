import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllAdminOrders from "../components/Admin/AllAdminOrders";

const AdminDashboardOrders = () => (
  <AdminDashboardLayout active={2} bare>
    <AllAdminOrders />
  </AdminDashboardLayout>
);

export default AdminDashboardOrders;
