import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { VendorDashboard } from "../components/dashboard/VendorDashboard";

export const VendorDashboardPage = () => (
  <VendorPageShell pageName="dashboard" activeNavId="dashboard" title="Dashboard">
    <VendorDashboard />
  </VendorPageShell>
);

export default VendorDashboardPage;
