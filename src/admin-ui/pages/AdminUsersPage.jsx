import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { UserManagement } from "../components/users/UserManagement";

const AdminUsersPage = () => (
  <AdminPageShell pageName="users" activeNavId="users" title="User Management" breadcrumbs={[{ label: "Users" }]}>
    <UserManagement />
  </AdminPageShell>
);

export default AdminUsersPage;
