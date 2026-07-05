import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllEvents from "../components/Admin/AllEvents";

const AdminDashboardEvents = () => (
  <AdminDashboardLayout active={6} bare>
    <AllEvents />
  </AdminDashboardLayout>
);

export default AdminDashboardEvents;
