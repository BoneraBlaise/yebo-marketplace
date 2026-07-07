import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { SecurityCenter } from "../components/security/SecurityCenter";

const AdminSecurityPage = () => (
  <AdminPageShell pageName="security" activeNavId="security" title="Security Center" breadcrumbs={[{ label: "Security" }]}>
    <SecurityCenter />
  </AdminPageShell>
);

export default AdminSecurityPage;
