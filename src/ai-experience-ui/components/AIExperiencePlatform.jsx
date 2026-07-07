import React from "react";
import { ApplicationShell, CustomerRouteShell } from "../../application";
import { CustomerLayoutShell } from "../../application";
import { Tabs } from "../../design-system/components";
import { ThemeToggle } from "../../design-system/navigation";
import { PageContainer } from "../../ui-polish";
import { PreviewExperience } from "./preview/PreviewExperience";
import { PreviewJobsPanel } from "./jobs/PreviewJobsPanel";
import { AssetManager } from "./assets/AssetManager";
import { AIHistoryPanel } from "./history/AIHistoryPanel";
import { AICreditsExperience } from "./credits/AICreditsExperience";
import { AIRecommendationsPanel } from "./recommendations/AIRecommendationsPanel";
import { logAIExperienceDiagnostics } from "../diagnostics/AIExperienceDiagnostics";

/** AI Experience Platform shell — Phase 8H.5 */
export const AIExperiencePlatform = ({ userId = "demo-user", productId = "p-1" }) => {
  const [tab, setTab] = React.useState("preview");
  logAIExperienceDiagnostics("render", { platform: "AIExperiencePlatform", tab });

  return (
    <div aria-label="YEBO AI Experience Platform" className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-Poppins text-2xl md:text-3xl font-bold tracking-tight">✨ YEBO AI Experience</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Powered by YEBO AI — preview, manage, and optimize</p>
        </div>
        <ThemeToggle />
      </div>
      <Tabs tabs={[
        { id: "preview", label: "Preview" },
        { id: "jobs", label: "Jobs" },
        { id: "assets", label: "Assets" },
        { id: "history", label: "History" },
        { id: "credits", label: "Credits" },
        { id: "recommendations", label: "Recommendations" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === "preview" && <PreviewExperience userId={userId} productId={productId} />}
        {tab === "jobs" && <PreviewJobsPanel userId={userId} />}
        {tab === "assets" && <AssetManager userId={userId} />}
        {tab === "history" && <AIHistoryPanel userId={userId} />}
        {tab === "credits" && <AICreditsExperience userId={userId} />}
        {tab === "recommendations" && <AIRecommendationsPanel userId={userId} />}
      </div>
    </div>
  );
};

export const AIExperiencePageShell = ({ children, pageName = "ai-experience" }) => {
  logAIExperienceDiagnostics("render", { page: pageName });
  return (
    <ApplicationShell routingScope="customer">
      <CustomerRouteShell>
        <CustomerLayoutShell title="YEBO AI Experience" activeNavId="profile" breadcrumbs={[{ label: "AI Experience" }]}>
          <PageContainer className="yebone-fade-up">{children}</PageContainer>
        </CustomerLayoutShell>
      </CustomerRouteShell>
    </ApplicationShell>
  );
};

export default AIExperiencePlatform;
