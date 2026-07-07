import React from "react";
import { EmptyState, ErrorState, LoadingState, Button } from "../../design-system/components";
import { Alert, Banner } from "../../design-system/notifications";

const icon = (emoji) => <span className="text-4xl mb-3 block" aria-hidden="true">{emoji}</span>;

export const statePresets = {
  noProducts: { title: "No products yet", description: "Browse the marketplace to discover amazing items.", emoji: "🛍️" },
  noOrders: { title: "No orders", description: "Your order history will appear here.", emoji: "📦" },
  noCustomers: { title: "No customers", description: "Customer activity will show up here.", emoji: "👥" },
  noVendors: { title: "No vendors", description: "Registered vendors will appear in this list.", emoji: "🏪" },
  noNotifications: { title: "All caught up", description: "You have no new notifications.", emoji: "🔔" },
  noResults: { title: "No results found", description: "Try adjusting your search or filters.", emoji: "🔍" },
  offline: { title: "You're offline", description: "Check your connection and try again.", emoji: "📡" },
  serverError: { title: "Something went wrong", description: "Our team has been notified. Please try again.", emoji: "⚠️" },
  permissionDenied: { title: "Access denied", description: "You don't have permission to view this.", emoji: "🔒" },
  aiFailure: { title: "AI preview failed", description: "Powered by YEBO AI — please retry your preview.", emoji: "✨" },
  lowCredits: { title: "Low AI credits", description: "Top up credits to continue using AI previews.", emoji: "💳" },
  subscriptionExpired: { title: "Subscription expired", description: "Renew your plan to unlock AI features.", emoji: "📋" },
  queueFailed: { title: "Queue unavailable", description: "The preview queue is temporarily busy.", emoji: "⏳" },
};

export const PolishedEmptyState = ({ preset = "noResults", action, ...overrides }) => {
  const config = { ...statePresets[preset], ...overrides };
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900/50">
      {icon(config.emoji)}
      <EmptyState title={config.title} description={config.description} action={action} />
    </div>
  );
};

export const PolishedErrorState = ({ preset = "serverError", retry }) => {
  const config = statePresets[preset] || statePresets.serverError;
  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-900/50 p-6 md:p-8 bg-red-50/30 dark:bg-red-950/20">
      {icon(config.emoji)}
      <ErrorState message={`${config.title}: ${config.description}`} retry={retry} />
    </div>
  );
};

export const PolishedLoadingState = ({ message = "Loading..." }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
    <LoadingState message={message} />
  </div>
);

export const PolishedWarningBanner = ({ children }) => <Banner variant="warning">{children}</Banner>;
export const PolishedInfoAlert = ({ children }) => <Alert variant="info">{children}</Alert>;

export const ConfirmationDialogContent = ({ title, message, onConfirm, onCancel }) => (
  <div className="space-y-4">
    <h3 className="font-Poppins font-semibold text-lg">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    <div className="flex gap-2 justify-end">
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </div>
  </div>
);

export default {
  statePresets, PolishedEmptyState, PolishedErrorState, PolishedLoadingState,
  PolishedWarningBanner, PolishedInfoAlert, ConfirmationDialogContent,
};
