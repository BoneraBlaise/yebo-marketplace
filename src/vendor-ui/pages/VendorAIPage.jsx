import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { AIWorkspace } from "../components/ai/AIWorkspace";

export const VendorAIPage = () => (
  <VendorPageShell pageName="ai" activeNavId="ai" title="AI Workspace" breadcrumbs={[{ label: "AI Workspace" }]}>
    <AIWorkspace />
  </VendorPageShell>
);

export default VendorAIPage;
