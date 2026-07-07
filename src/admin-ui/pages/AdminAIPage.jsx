import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { AIControlCenter } from "../components/ai/AIControlCenter";

const AdminAIPage = () => (
  <AdminPageShell pageName="ai" activeNavId="ai" title="AI Control Center" breadcrumbs={[{ label: "AI Control" }]}>
    <AIControlCenter />
  </AdminPageShell>
);

export default AdminAIPage;
