import React from "react";
import { Card } from "../../../design-system/components";
import { AIRecommendationCard } from "../../../design-system/ai";
import { useAIExperiencePlatform } from "../../hooks/useAIExperiencePlatform";
import { YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

const DEFAULT_RECOMMENDATIONS = [
  { type: "preview", message: "Try wrist_tryon for watches and accessories." },
  { type: "product", message: "Recommended product: Smart Watch Pro pairs well with your style." },
  { type: "style", message: "Recommended style: Minimalist modern aesthetic." },
  { type: "size", message: "Recommended size: Medium based on your preferences." },
  { type: "placement", message: "Recommended furniture placement: Center wall, eye level." },
  { type: "decoration", message: "Recommended decoration: Add complementary accent pieces." },
];

export const AIRecommendationsPanel = ({ userId = "demo-user" }) => {
  const { getRecommendations } = useAIExperiencePlatform(userId);
  const serviceRecs = getRecommendations();
  const recommendations = serviceRecs.length
    ? serviceRecs.map((r) => ({ message: r.message || String(r) }))
    : DEFAULT_RECOMMENDATIONS;

  logAIExperienceDiagnostics("render", { panel: "recommendations", count: recommendations.length });

  return (
    <section aria-label="AI recommendations" className="space-y-3">
      <Card>
        <h3 className="font-semibold mb-2">AI Recommendations</h3>
        <YEBOAIBrand />
      </Card>
      {recommendations.map((rec, i) => (
        <AIRecommendationCard key={i} message={rec.message} />
      ))}
    </section>
  );
};

export default AIRecommendationsPanel;
