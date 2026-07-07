import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { MarketingView } from "../components/marketing/MarketingView";

export const VendorMarketingPage = () => (
  <VendorPageShell pageName="marketing" activeNavId="marketing" title="Marketing" breadcrumbs={[{ label: "Marketing" }]}>
    <MarketingView />
  </VendorPageShell>
);

export default VendorMarketingPage;
