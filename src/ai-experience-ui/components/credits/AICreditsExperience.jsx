import React from "react";
import { Card, StatisticCard } from "../../../design-system/components";
import { AICreditsCard, AISubscriptionCard, AIUsageMeter } from "../../../design-system/ai";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

export const AICreditsExperience = ({ userId = "demo-user", ai_preview_type = "body_tryon" }) => {
  const { getCredits, getSubscription, estimateCost } = useAIExperiencePlatform(userId);
  const credits = getCredits();
  const subscription = getSubscription();
  const cost = estimateCost(ai_preview_type);

  logAIExperienceDiagnostics("credits", { remaining: credits.remaining, cost });

  return (
    <section aria-label="AI credits experience" className="space-y-4">
      <YEBOAIBrand />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AICreditsCard remaining={credits.remaining} allocated={credits.allocated} />
        <AISubscriptionCard plan={subscription.plan} active={subscription.active} />
      </div>
      <Card>
        <h3 className="font-semibold mb-3">Credit Usage</h3>
        <AIUsageMeter used={credits.consumed} total={credits.allocated || 100} />
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-gray-500">Remaining</dt><dd className="font-bold">{credits.remaining}</dd></div>
          <div><dt className="text-gray-500">Consumed</dt><dd className="font-bold">{credits.consumed}</dd></div>
          <div><dt className="text-gray-500">Estimated Cost</dt><dd className="font-bold">{cost} credits</dd></div>
          <div><dt className="text-gray-500">Reset Date</dt><dd>{credits.nextResetAt || "—"}</dd></div>
        </dl>
      </Card>
      <StatisticCard label="Credit Cost (per preview)" value={`${cost} credits`} />
    </section>
  );
};

export default AICreditsExperience;
