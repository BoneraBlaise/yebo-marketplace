import React from "react";
import { Badge } from "../../../design-system/components";
import { AI_STATUS_LABELS, AI_STATUS_VARIANT } from "../../constants/aiStatus";
import { YEBO_AI_BRAND } from "../../utils/providerTransparency";

export const AIStatusBadge = ({ status = "idle" }) => (
  <Badge variant={AI_STATUS_VARIANT[status] || "default"} role="status" aria-label={`Status: ${AI_STATUS_LABELS[status] || status}`}>
    {AI_STATUS_LABELS[status] || status}
  </Badge>
);

export const YEBOAIBrand = () => (
  <span className="text-xs text-gray-500" aria-label={YEBO_AI_BRAND}>{YEBO_AI_BRAND}</span>
);

export const AIStatusIndicator = ({ status = "idle" }) => (
  <div className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${status === "completed" ? "bg-green-500" : status === "failed" ? "bg-red-500" : status === "processing" || status === "running" ? "bg-yellow-500 animate-pulse" : "bg-gray-400"}`} aria-hidden="true" />
    <AIStatusBadge status={status} />
  </div>
);

export default { AIStatusBadge, YEBOAIBrand, AIStatusIndicator };
