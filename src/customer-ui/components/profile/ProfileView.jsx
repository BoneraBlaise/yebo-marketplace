import React, { useState } from "react";
import { Card, Button, Input, Tabs, Avatar, Badge } from "../../../design-system/components";
import { SectionHeader, PremiumCard } from "../../../ui-polish";
import { AI_POWERED_BY, MARKETPLACE_NAME } from "../../../ui-polish/brandConstants";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const ProfileHeader = ({ name = "Customer", email = "customer@example.com" }) => (
  <PremiumCard className="flex items-center gap-4 mb-6">
    <Avatar name={name} size="lg" />
    <div>
      <h2 className="text-xl font-Poppins font-bold">{name}</h2>
      <p className="text-sm text-gray-500">{email}</p>
      <Badge variant="success" className="mt-2">Verified member</Badge>
    </div>
  </PremiumCard>
);

export const AddressesView = ({ addresses = [] }) => (
  <section aria-label="Saved addresses" className="space-y-3">
    {addresses.map((a) => (
      <Card key={a.id}>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{a.label} {a.default && <span className="text-xs text-yebone-primary">(Default)</span>}</p>
            <p className="text-sm text-gray-600">{a.line1}, {a.city} {a.postal}</p>
          </div>
          <Button size="sm" variant="ghost">Edit</Button>
        </div>
      </Card>
    ))}
    <Button variant="secondary" size="sm">Add Address</Button>
  </section>
);

export const SavedPaymentsPlaceholder = () => (
  <Card aria-label="Saved payment methods">
    <h3 className="font-semibold mb-2">Saved Payments</h3>
    <p className="text-sm text-gray-600 mb-3">Payment methods placeholder — no payment implementation.</p>
    <div className="p-4 border border-dashed rounded-lg text-center text-gray-400">💳 No saved payment methods</div>
    <Button variant="secondary" size="sm" className="mt-3">Add Payment Method</Button>
  </Card>
);

export const ProfileSettings = () => (
  <Card aria-label="Profile settings">
    <h3 className="font-semibold mb-4">Settings</h3>
    <div className="space-y-3">
      <div><label className="text-sm text-gray-500">Display Name</label><Input defaultValue="Customer" aria-label="Display name" /></div>
      <div><label className="text-sm text-gray-500">Email</label><Input defaultValue="customer@example.com" type="email" aria-label="Email" /></div>
      <div><label className="text-sm text-gray-500">Phone</label><Input placeholder="+27 ..." aria-label="Phone" /></div>
      <Button size="sm">Save Changes</Button>
    </div>
  </Card>
);

export const SecuritySettings = () => (
  <Card aria-label="Security settings">
    <h3 className="font-semibold mb-4">Security</h3>
    <div className="space-y-3">
      <Button variant="secondary" size="sm">Change Password</Button>
      <Button variant="ghost" size="sm">Enable Two-Factor Authentication</Button>
      <Button variant="ghost" size="sm">Manage Sessions</Button>
    </div>
  </Card>
);

export const AIHistoryPlaceholder = () => (
  <Card aria-label="AI preview history">
    <h3 className="font-semibold mb-2">AI Preview History</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{AI_POWERED_BY} — your preview sessions on {MARKETPLACE_NAME}.</p>
    <div className="p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center text-gray-400 text-sm">No AI previews yet — try Preview with AI on any product.</div>
  </Card>
);

export const ProfileView = ({ addresses = [] }) => {
  const [tab, setTab] = useState("profile");
  logCustomerUIDiagnostics("component", { name: "ProfileView", tab });

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "addresses", label: "Addresses" },
    { id: "payments", label: "Payments" },
    { id: "ai-history", label: "AI History" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="yebone-fade-up">
      <SectionHeader title="My Account" subtitle={`Manage your ${MARKETPLACE_NAME} profile`} />
      <ProfileHeader />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-6">
        {tab === "profile" && <ProfileSettings />}
        {tab === "addresses" && <AddressesView addresses={addresses} />}
        {tab === "payments" && <SavedPaymentsPlaceholder />}
        {tab === "ai-history" && <AIHistoryPlaceholder />}
        {tab === "notifications" && (
          <Card><h3 className="font-semibold mb-2">Notifications</h3><p className="text-sm text-gray-500">All caught up — no new notifications.</p></Card>
        )}
        {tab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
};

export default ProfileView;
