import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { VendorManagement } from "../components/vendors/VendorManagement";

const AdminVendorsPage = () => (
  <AdminPageShell pageName="vendors" activeNavId="vendors" title="Vendor Management" breadcrumbs={[{ label: "Vendors" }]}>
    <VendorManagement />
  </AdminPageShell>
);

export default AdminVendorsPage;
