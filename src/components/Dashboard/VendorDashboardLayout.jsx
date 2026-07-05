import React from "react";
import DashboardLayout from "./DashboardLayout";

const VendorDashboardLayout = ({
  active,
  children,
  bare = false,
  fullWidth = false,
}) => (
  <DashboardLayout mode="vendor" active={active} bare={bare} fullWidth={fullWidth}>
    {children}
  </DashboardLayout>
);

export default VendorDashboardLayout;
