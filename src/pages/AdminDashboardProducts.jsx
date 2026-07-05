import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AllProducts from "../components/Admin/AllProducts";

const AdminDashboardProducts = () => (
  <AdminDashboardLayout active={5} bare>
    <AllProducts />
  </AdminDashboardLayout>
);

export default AdminDashboardProducts;
