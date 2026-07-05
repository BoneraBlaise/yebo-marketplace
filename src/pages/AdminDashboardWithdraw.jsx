import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllWithdraw from "../components/Admin/AllWithdraw";

const AdminDashboardWithdraw = () => (
  <AdminDashboardLayout active={7} bare>
    <AllWithdraw />
  </AdminDashboardLayout>
);

export default AdminDashboardWithdraw;
