import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { FinanceView } from "../components/finance/FinanceView";

export const VendorFinancePage = () => (
  <VendorPageShell pageName="finance" activeNavId="finance" title="Finance" breadcrumbs={[{ label: "Finance" }]}>
    <FinanceView />
  </VendorPageShell>
);

export default VendorFinancePage;
