import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import AdminTrustBuyerProtectionPanel from "../components/TrustBuyerProtection/AdminTrustBuyerProtectionPanel";

const AdminTrustBuyerProtectionPage = () => (
  <AdminDashboardLayout active={34} bare>
    <AdminTrustBuyerProtectionPanel />
  </AdminDashboardLayout>
);

export default AdminTrustBuyerProtectionPage;
