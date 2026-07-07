import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { AffiliateCenter } from "../components/affiliate/AffiliateCenter";

export const VendorAffiliatePage = () => (
  <VendorPageShell pageName="affiliate" activeNavId="affiliate" title="Affiliate Center" breadcrumbs={[{ label: "Affiliate" }]}>
    <AffiliateCenter />
  </VendorPageShell>
);

export default VendorAffiliatePage;
