import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { AnalyticsCenter } from "../components/analytics/AnalyticsCenter";

const AdminAnalyticsPage = () => (
  <AdminPageShell pageName="analytics" activeNavId="analytics" title="Analytics Center" breadcrumbs={[{ label: "Analytics" }]}>
    <AnalyticsCenter />
  </AdminPageShell>
);

export default AdminAnalyticsPage;
