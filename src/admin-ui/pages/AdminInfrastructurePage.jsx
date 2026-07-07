import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { InfrastructureCenter } from "../components/infrastructure/InfrastructureCenter";

const AdminInfrastructurePage = () => (
  <AdminPageShell pageName="infrastructure" activeNavId="infrastructure" title="Infrastructure Center" breadcrumbs={[{ label: "Infrastructure" }]}>
    <InfrastructureCenter />
  </AdminPageShell>
);

export default AdminInfrastructurePage;
