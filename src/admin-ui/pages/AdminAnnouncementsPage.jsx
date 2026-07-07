import React from "react";
import AdminPageShell from "../components/AdminPageShell";
import { AnnouncementCenter } from "../components/announcements/AnnouncementCenter";

const AdminAnnouncementsPage = () => (
  <AdminPageShell pageName="announcements" activeNavId="announcements" title="Announcement Center" breadcrumbs={[{ label: "Announcements" }]}>
    <AnnouncementCenter />
  </AdminPageShell>
);

export default AdminAnnouncementsPage;
