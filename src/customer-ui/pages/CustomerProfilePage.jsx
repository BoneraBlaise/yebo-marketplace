import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { ProfileView } from "../components/profile/ProfileView";
import { AIExperiencePanel } from "../components/ai/AIExperiencePanel";
import { mockAddresses } from "../data/mockCustomerData";

export const CustomerProfilePage = () => (
  <CustomerPageShell pageName="profile" activeNavId="profile" title="My Profile" breadcrumbs={[{ label: "Profile" }]}>
    <ProfileView addresses={mockAddresses} />
    <div className="mt-8">
      <AIExperiencePanel />
    </div>
  </CustomerPageShell>
);

export default CustomerProfilePage;
