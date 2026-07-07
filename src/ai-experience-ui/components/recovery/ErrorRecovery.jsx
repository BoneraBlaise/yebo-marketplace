import React from "react";
import { Card, Button, ErrorState } from "../../../design-system/components";
import { Alert } from "../../../design-system/notifications";
import { YEBOAIBrand } from "../status/AIStatusComponents";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

export const ErrorRecovery = ({ errorType = "temporary_failure", onRetry, onCancel, onResume }) => {
  logAIExperienceDiagnostics("preview", { errorType, recovery: true });

  const messages = {
    low_credits: { title: "Low Credits", message: "You don't have enough credits for this preview.", action: "Top Up Credits" },
    subscription_expired: { title: "Subscription Expired", message: "Your AI subscription has expired.", action: "Renew Subscription" },
    temporary_failure: { title: "Temporary Failure", message: "Something went wrong. Please try again.", action: "Retry" },
    failed: { title: "Preview Failed", message: "The preview could not be completed.", action: "Start Again" },
  };

  const config = messages[errorType] || messages.temporary_failure;

  return (
    <Card aria-label="Error recovery" role="alert">
      <Alert variant="error">{config.title}: {config.message}</Alert>
      <YEBOAIBrand />
      <div className="flex flex-wrap gap-2 mt-4">
        <Button size="sm" onClick={onRetry} aria-label="Retry">Retry</Button>
        <Button size="sm" variant="secondary" onClick={onResume} aria-label="Resume">Resume</Button>
        <Button size="sm" variant="ghost" onClick={onCancel} aria-label="Cancel">Cancel</Button>
        <Button size="sm" variant="ghost" aria-label="Start again">Start Again</Button>
      </div>
    </Card>
  );
};

export const ErrorRecoveryShowcase = () => (
  <div className="space-y-4" aria-label="Error recovery examples">
    <ErrorRecovery errorType="low_credits" />
    <ErrorRecovery errorType="subscription_expired" />
    <ErrorRecovery errorType="temporary_failure" />
    <ErrorState message="Preview failed — user-friendly recovery available above." retry={() => {}} />
  </div>
);

export default ErrorRecovery;
