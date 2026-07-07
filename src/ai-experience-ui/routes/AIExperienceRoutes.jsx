import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyRouteFallback } from "../../application";

const AIExperiencePage = lazy(() => import("../pages/AIExperiencePage"));

/** AI Experience Platform routes — opt-in — Phase 8H.5 */
export const AIExperienceRoutes = () => (
  <Suspense fallback={<LazyRouteFallback />}>
    <Routes>
      <Route path="/ai-experience" element={<AIExperiencePage />} />
      <Route path="/ai-experience/product/:productId" element={<AIExperiencePage />} />
    </Routes>
  </Suspense>
);

export default AIExperienceRoutes;
