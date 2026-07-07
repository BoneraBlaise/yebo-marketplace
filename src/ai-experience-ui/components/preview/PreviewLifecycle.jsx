import React from "react";
import { Card, Progress } from "../../../design-system/components";
import { Timeline } from "../../../design-system/data";
import { PREVIEW_LIFECYCLE, mapStatusToLifecycleIndex } from "../../constants/previewLifecycle";
import { logAIExperienceDiagnostics } from "../../diagnostics/AIExperienceDiagnostics";

export const PreviewLifecycle = ({ currentStatus = "ready", sessionId }) => {
  const activeIndex = mapStatusToLifecycleIndex(currentStatus);
  logAIExperienceDiagnostics("lifecycle", { sessionId, status: currentStatus, step: activeIndex });

  const events = PREVIEW_LIFECYCLE.map((step, i) => ({
    id: step.id,
    title: step.label,
    time: i <= activeIndex ? "Done" : i === activeIndex + 1 ? "In progress" : "Pending",
  }));

  return (
    <Card aria-label="Preview lifecycle">
      <h3 className="font-semibold mb-4">Preview Lifecycle</h3>
      <Progress value={((activeIndex + 1) / PREVIEW_LIFECYCLE.length) * 100} aria-label={`Lifecycle progress ${activeIndex + 1} of ${PREVIEW_LIFECYCLE.length}`} />
      <div className="mt-4 max-h-64 overflow-y-auto">
        <Timeline events={events.slice(0, activeIndex + 2)} />
      </div>
    </Card>
  );
};

export default PreviewLifecycle;
