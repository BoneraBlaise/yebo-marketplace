import React, { useMemo } from "react";
import { useCurrentProvider, useAvailableProviders } from "../../../ai/hooks/useOrchestration";
import { useAI } from "../core/AIContext";
import AICard from "../primitives/AICard";

const STATUS_COLORS = {
  healthy: "text-green-600",
  degraded: "text-amber-600",
  unavailable: "text-orange-600",
  offline: "text-gray-400",
};

/** Provider status + switch — presentation only, no real API calls */
const YEBOProviderStatus = ({ className, compact = false }) => {
  const current = useCurrentProvider();
  const providers = useAvailableProviders();
  const { switchProvider, providerHealth, providerUsage, providerConfiguration, isStreaming, assistantProviderIndicator } =
    useAI();

  const sdkHealth = useMemo(() => {
    const activeId = current?.id || providerConfiguration?.activeProvider;
    if (!providerHealth || !activeId) return null;
    return providerHealth.getStatus?.(activeId) ?? null;
  }, [providerHealth, providerConfiguration, current]);

  const sdkUsage = useMemo(() => {
    const activeId = current?.id || providerConfiguration?.activeProvider;
    if (!providerUsage || !activeId) return null;
    return providerUsage.getUsage?.(activeId) ?? null;
  }, [providerUsage, providerConfiguration, current]);

  if (!current) return null;

  const healthLabel = sdkHealth?.status || current.health;
  const statusClass = STATUS_COLORS[healthLabel] || STATUS_COLORS.offline;

  if (compact) {
    const indicator = assistantProviderIndicator
      ? `${assistantProviderIndicator.emoji} ${assistantProviderIndicator.label}`
      : `🔴 Offline`;
    return (
      <p className={`text-[10px] text-gray-500 ${className || ""}`}>
        <span className="font-semibold text-yebone-primary">Active Provider</span>
        <span className="ml-1">{indicator}</span>
        {isStreaming && <span className="ml-1 text-yebone-gold">· streaming</span>}
      </p>
    );
  }

  return (
    <AICard className={className} padding="sm">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-gold mb-2">
        AI Provider · SDK + Orchestration
      </p>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <p className="text-xs font-semibold dark:text-white">{current.name}</p>
          <p className="text-[10px] text-gray-500">
            Type: <span className="capitalize">{current.id || providerConfiguration?.activeProvider}</span>
          </p>
          <p className={`text-[10px] capitalize ${statusClass}`}>{healthLabel}</p>
        </div>
        <span className="text-[10px] text-gray-400">v{current.version}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {current.supportsStreaming && <span className="ai-prompt-chip text-[9px]">Stream</span>}
        {current.supportsVision && <span className="ai-prompt-chip text-[9px]">Vision</span>}
        {current.supportsEmbeddings && <span className="ai-prompt-chip text-[9px]">Embed</span>}
        {current.supportsReasoning && <span className="ai-prompt-chip text-[9px]">Reason</span>}
        {isStreaming && <span className="ai-prompt-chip text-[9px] border-yebone-gold">Live</span>}
      </div>
      {sdkUsage && (
        <p className="text-[9px] text-gray-400 mb-2">
          Mock usage · {sdkUsage.requestCount} req · ~{sdkUsage.estimatedTokens} tokens · $
          {sdkUsage.estimatedCost.toFixed(6)}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {providers.slice(0, 4).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => switchProvider?.(p.id)}
            className={`text-[9px] px-2 py-1 rounded-lg border transition ${
              p.active
                ? "border-yebone-primary bg-yebone-primary/10 text-yebone-primary font-semibold"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-yebone-primary/40"
            }`}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </AICard>
  );
};

export default YEBOProviderStatus;
