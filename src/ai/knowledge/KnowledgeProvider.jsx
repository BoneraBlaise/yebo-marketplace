import React from "react";
import { KnowledgeReactContext } from "./KnowledgeHooks";

/** Optional standalone knowledge provider — YIPProvider wires by default */
export const KnowledgeProvider = ({ children, knowledgeEngine }) => (
  <KnowledgeReactContext.Provider value={knowledgeEngine}>
    {children}
  </KnowledgeReactContext.Provider>
);

export default KnowledgeProvider;
