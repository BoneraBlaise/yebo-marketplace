import React from "react";
import { AIExperiencePageShell, AIExperiencePlatform } from "../components/AIExperiencePlatform";
import { ErrorRecoveryShowcase } from "../components/recovery/ErrorRecovery";

const AIExperiencePage = () => (
  <AIExperiencePageShell pageName="ai-experience">
    <AIExperiencePlatform />
    <details className="mt-8 text-sm">
      <summary className="cursor-pointer text-gray-500">Error recovery examples</summary>
      <div className="mt-4">
        <ErrorRecoveryShowcase />
      </div>
    </details>
  </AIExperiencePageShell>
);

export default AIExperiencePage;
