import React from "react";
import { IntelligenceReactContext } from "./IntelligenceHooks";

/** Optional standalone intelligence provider — YIPProvider wires engine by default */
export const IntelligenceProvider = ({ children, intelligenceEngine }) => (
  <IntelligenceReactContext.Provider value={intelligenceEngine}>
    {children}
  </IntelligenceReactContext.Provider>
);

export default IntelligenceProvider;
