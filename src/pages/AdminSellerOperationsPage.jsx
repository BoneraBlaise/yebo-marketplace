import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AdminSellerOperationsPanel from "../components/SellerOperations/AdminSellerOperationsPanel";

const AdminSellerOperationsPage = () => (
  <AdminDashboardLayout active={32} bare>
    <AdminSellerOperationsPanel />
  </AdminDashboardLayout>
);

export default AdminSellerOperationsPage;
