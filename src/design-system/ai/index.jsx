import React from "react";
import { Card, Badge, Progress, StatisticCard } from "../components";

export const AIBadge = ({ label = "AI" }) => <Badge variant="default">{label}</Badge>;
export const AICreditsCard = ({ remaining, allocated }) => <Card><p className="text-sm text-gray-500">AI Credits</p><p className="text-2xl font-bold">{remaining} / {allocated}</p></Card>;
export const AIWalletCard = AICreditsCard;
export const AISubscriptionCard = ({ plan, active }) => <Card><p className="text-sm">Subscription</p><p className="font-semibold">{plan}</p><Badge variant={active ? "success" : "warning"}>{active ? "Active" : "Inactive"}</Badge></Card>;
export const AIROICard = ({ roi, revenue }) => <StatisticCard label="AI ROI" value={roi} trend={revenue ? `+${revenue} revenue` : null} />;
export const AIAnalyticsCard = ({ usage, credits }) => <Card><p className="text-sm">AI Analytics</p><p>{usage} requests · {credits} credits</p></Card>;
export const AIRecommendationCard = ({ message }) => <Card className="border-l-4 border-yebone-accent"><p className="text-sm">{message}</p></Card>;
export const AIPreviewCard = ({ previewType, status }) => <Card><p className="font-medium">{previewType}</p><Badge>{status}</Badge></Card>;
export const AIJobCard = ({ jobId, status, progress }) => <Card><p className="text-sm">Job {jobId}</p><Badge>{status}</Badge><Progress value={progress} className="mt-2" /></Card>;
export const AIQueueCard = ({ queued, running }) => <Card><p className="text-sm">Queue</p><p>{queued} queued · {running} running</p></Card>;
export const AIUsageMeter = ({ used, total }) => <div><Progress value={used} max={total} /><p className="text-xs mt-1">{used}/{total} credits used</p></div>;
export const AIProviderStatus = ({ provider, status }) => <span className="inline-flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${status === "online" ? "bg-green-500" : "bg-gray-400"}`} />{provider}</span>;
export const AIModelBadge = ({ model }) => <Badge>{model}</Badge>;
export const AICostCard = ({ cost, period }) => <StatisticCard label={`Cost (${period})`} value={cost} />;
export const AIHistoryCard = ({ items = [] }) => <Card><p className="text-sm font-medium mb-2">AI History</p><ul className="text-sm space-y-1">{items.slice(0, 5).map((item) => <li key={item.id}>{item.label}</li>)}</ul></Card>;

export default {
  AIBadge, AICreditsCard, AIWalletCard, AISubscriptionCard, AIROICard, AIAnalyticsCard,
  AIRecommendationCard, AIPreviewCard, AIJobCard, AIQueueCard, AIUsageMeter, AIProviderStatus,
  AIModelBadge, AICostCard, AIHistoryCard,
};
