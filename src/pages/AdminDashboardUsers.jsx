import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllUsers from "../components/Admin/AllUsers";

const AdminDashboardUsers = () => (
  <AdminDashboardLayout active={4} bare>
    <AllUsers />
  </AdminDashboardLayout>
);

export default AdminDashboardUsers;
