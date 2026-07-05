import React from "react";
import DashboardLayout from "./DashboardLayout";

const AdminDashboardLayout = ({
  active,
  children,
  bare = false,
  fullWidth = false,
}) => (
  <DashboardLayout mode="admin" active={active} bare={bare} fullWidth={fullWidth}>
    {children}
  </DashboardLayout>
);

export default AdminDashboardLayout;
