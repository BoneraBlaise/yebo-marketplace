import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { MonitoringCenter } from "../components/monitoring/MonitoringCenter";

const AdminMonitoringPage = () => (
  <AdminPageShell pageName="monitoring" activeNavId="monitoring" title="Monitoring Center" breadcrumbs={[{ label: "Monitoring" }]}>
    <MonitoringCenter />
  </AdminPageShell>
);

export default AdminMonitoringPage;
