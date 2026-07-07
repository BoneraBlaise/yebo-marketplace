import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { CommerceCenter } from "../components/commerce/CommerceCenter";

const AdminCommercePage = () => (
  <AdminPageShell pageName="commerce" activeNavId="commerce" title="Commerce Center" breadcrumbs={[{ label: "Commerce" }]}>
    <CommerceCenter />
  </AdminPageShell>
);

export default AdminCommercePage;
