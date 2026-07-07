import React, { useState } from "react";
import { Button, Select, Progress } from "../../../design-system/components";
import { AIPreviewCard } from "../../../design-system/ai";
import { AI_PREVIEW_TYPE } from "../../../ai/commerce/CommerceTypes";
import { PremiumCard, PolishedEmptyState } from "../../../ui-polish";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { PreviewLifecycle } from "./PreviewLifecycle";
import { AIStatusIndicator, YEBOAIBrand } from "../status/AIStatusComponents";
import { YEBO_AI_BRAND } from "../../utils/providerTransparency";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

const AI_PREVIEW_TYPE_OPTIONS = Object.entries(AI_PREVIEW_TYPE).map(([, value]) => ({
  value,
  label: value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export const PreviewExperience = ({ userId = "demo-user", productId = "p-1" }) => {
  const [previewType, setPreviewType] = useState("body_tryon");
  const [activeSession, setActiveSession] = useState(null);
  const { createPreview, getSessions, getProgress } = useAIExperiencePlatform(userId);

  const sessions = getSessions()?.previewSessions || [];
  const session = activeSession || sessions[sessions.length - 1];
  const progress = session ? getProgress(session.sessionId) : null;
  const viewModel = progress?.viewModel;
  const status = viewModel?.status || session?.status || "idle";

  logAIExperienceDiagnostics("preview", { productId, previewType, status });

  const handleStart = () => {
    const created = createPreview({ ai_preview_type: previewType, productId, inputs: {} });
    setActiveSession(created);
    logAIExperienceDiagnostics("preview", { action: "start", sessionId: created.sessionId });
  };

  const actions = [
    { id: "retry", label: "Retry Preview" },
    { id: "compare", label: "Compare" },
    { id: "replace", label: "Replace" },
    { id: "delete", label: "Delete" },
    { id: "favorite", label: "Favorite" },
    { id: "share", label: "Share" },
    { id: "download", label: "Download" },
    { id: "save", label: "Save" },
  ];

  return (
    <section aria-label="AI Preview Experience" className="space-y-6">
      <PremiumCard accent className="yebone-surface">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-Poppins font-semibold">Preview with AI</h2>
            <YEBOAIBrand />
          </div>
          <AIStatusIndicator status={status === "completed" ? "completed" : status === "failed" ? "failed" : status === "running" ? "processing" : "idle"} />
        </div>

        <div className="mb-6">
          <label htmlFor="preview-type" className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Preview Type</label>
          <Select id="preview-type" value={previewType} onChange={(e) => setPreviewType(e.target.value)} aria-label="Select preview type" className="mt-2">
            {AI_PREVIEW_TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select>
        </div>

        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-200/80 dark:border-gray-700/80 overflow-hidden" role="img" aria-label="AI preview result area">
          {session ? (
            <div className="text-center p-6 w-full max-w-md">
              <p className="text-sm font-semibold capitalize mb-3">{previewType.replace(/_/g, " ")}</p>
              <Progress value={viewModel?.progress || 0} />
              <p className="text-xs text-gray-500 mt-3">{YEBO_AI_BRAND}</p>
            </div>
          ) : (
            <PolishedEmptyState preset="noResults" title="No preview yet" description="Start an AI preview to visualize this product." />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={handleStart}>Preview with AI</Button>
          {actions.map((a) => (
            <Button key={a.id} size="sm" variant="ghost" onClick={() => logAIExperienceDiagnostics("preview", { action: a.id })} aria-label={a.label}>
              {a.label}
            </Button>
          ))}
        </div>

        {sessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Previews</h3>
            {sessions.slice(-3).map((s) => (
              <AIPreviewCard key={s.sessionId} previewType={s.ai_preview_type} status={s.status} />
            ))}
          </div>
        )}
      </PremiumCard>

      {session && <PreviewLifecycle currentStatus={status} sessionId={session.sessionId} />}
    </section>
  );
};

export default PreviewExperience;
