import React, { useState } from "react";
import { Card, Tabs, Badge, Button, Input, Textarea, Select } from "../../../design-system/components";
import { mockAnnouncements } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const AnnouncementCenter = ({ announcements = mockAnnouncements }) => {
  const [tab, setTab] = useState("list");
  logAdminUIDiagnostics("component", { name: "AnnouncementCenter" });

  const filtered = (audience) => announcements.filter((a) => a.audience === audience);

  return (
    <div aria-label="Announcement center">
      <Tabs tabs={[
        { id: "list", label: "All" },
        { id: "customer", label: "Customers" },
        { id: "vendor", label: "Vendors" },
        { id: "platform", label: "Platform" },
        { id: "create", label: "Create" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === "create" ? (
          <Card aria-label="Create announcement">
            <h3 className="font-semibold mb-4">New Announcement</h3>
            <div className="space-y-3">
              <Select aria-label="Audience"><option value="customer">Customers</option><option value="vendor">Vendors</option><option value="platform">Platform</option></Select>
              <Input placeholder="Title" aria-label="Title" />
              <Textarea placeholder="Message" aria-label="Message" />
              <Button size="sm">Publish</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {(tab === "list" ? announcements : filtered(tab)).map((a) => (
              <Card key={a.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge>{a.audience}</Badge>
                    <h4 className="font-medium mt-2">{a.title}</h4>
                  </div>
                  <Badge variant={a.status === "published" ? "success" : "default"}>{a.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCenter;
