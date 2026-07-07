import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { FeatureFlagCenter } from "../components/features/FeatureFlagCenter";

const AdminFeaturesPage = () => (
  <AdminPageShell pageName="features" activeNavId="features" title="Feature Flag Center" breadcrumbs={[{ label: "Feature Flags" }]}>
    <FeatureFlagCenter />
  </AdminPageShell>
);

export default AdminFeaturesPage;
