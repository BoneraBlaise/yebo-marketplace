import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { ExecutiveDashboard } from "../components/dashboard/ExecutiveDashboard";

const AdminDashboardPage = () => (
  <AdminPageShell pageName="dashboard" activeNavId="dashboard" title="Executive Dashboard">
    <ExecutiveDashboard />
  </AdminPageShell>
);

export default AdminDashboardPage;
