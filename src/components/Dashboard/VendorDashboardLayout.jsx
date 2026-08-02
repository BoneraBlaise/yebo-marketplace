import React from "react";
import DashboardLayout from "./DashboardLayout";

const VendorDashboardLayout = ({
  active,
  children,
  messagingLayout = false,
}) => (
  <DashboardLayout
    mode="vendor"
    active={active}
    bare
    fullWidth
    messagingLayout={messagingLayout}
  >
    {children}
  </DashboardLayout>
);

export default VendorDashboardLayout;
