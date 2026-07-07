import React, { useState } from "react";
import { Card, Tabs, DataTable, Badge, Button } from "../../../design-system/components";
import { mockUsers } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

const ROLES = ["all", "customer", "vendor", "organization", "platform_admin"];

export const UserManagement = ({ users = mockUsers }) => {
  const [tab, setTab] = useState("all");
  logAdminUIDiagnostics("component", { name: "UserManagement", tab });

  const filtered = tab === "all" ? users : users.filter((u) => u.role === tab);
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "verified", label: "Verified" },
  ];
  const rows = filtered.map((u) => ({
    ...u,
    role: u.role.replace("_", " "),
    verified: u.verified ? "Yes" : "No",
  }));

  return (
    <div aria-label="User management">
      <Tabs tabs={ROLES.map((r) => ({ id: r, label: r === "all" ? "All Users" : r.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) }))} active={tab} onChange={setTab} />
      <div className="mt-4">
        <div className="flex justify-between mb-4">
          <p className="text-sm text-gray-500">{filtered.length} users</p>
          <Button size="sm">Add User</Button>
        </div>
        <DataTable columns={columns} rows={rows} />
      </div>
      <Card className="mt-4" aria-label="Roles and permissions">
        <h3 className="font-semibold mb-2">Roles & Permissions</h3>
        <p className="text-sm text-gray-500">Role-based access control placeholder — UI only.</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {["customer:read", "vendor:manage", "admin:diagnostics", "platform:full"].map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
