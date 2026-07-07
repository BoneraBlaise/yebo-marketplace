import React from "react";
import { PageContainer } from "./PageChrome";
import { FloatingThemeToggle } from "./ThemeBar";
import { logPolishDiagnostics } from "../diagnostics/PolishDiagnostics";

/** Wraps page content with production polish chrome — Phase 8I */
export const ExperienceChrome = ({ children, showThemeToggle = true, className = "" }) => {
  logPolishDiagnostics("chrome", { showThemeToggle });
  return (
    <>
      <PageContainer className={`yebone-premium-screen yebone-fade-up yebone-stack-flow ${className}`}>{children}</PageContainer>
      {showThemeToggle && <FloatingThemeToggle />}
    </>
  );
};

export default ExperienceChrome;
