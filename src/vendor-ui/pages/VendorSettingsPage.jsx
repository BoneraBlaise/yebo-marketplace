import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { StoreSettings } from "../components/settings/StoreSettings";

export const VendorSettingsPage = () => (
  <VendorPageShell pageName="settings" activeNavId="settings" title="Store Settings" breadcrumbs={[{ label: "Settings" }]}>
    <StoreSettings />
  </VendorPageShell>
);

export default VendorSettingsPage;
