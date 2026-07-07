import { breakpointTokens } from "../tokens";

/** Responsive Engine — Phase 8G */
export class ResponsiveEngine {
  constructor(breakpoints = breakpointTokens) {
    this.breakpoints = breakpoints;
  }

  getBreakpoint(width = typeof window !== "undefined" ? window.innerWidth : 1280) {
    if (width >= this.breakpoints.wide) return "wide";
    if (width >= this.breakpoints.desktop) return "desktop";
    if (width >= this.breakpoints.laptop) return "laptop";
    if (width >= this.breakpoints.tablet) return "tablet";
    return "mobile";
  }

  isMobile(width) {
    return this.getBreakpoint(width) === "mobile";
  }

  isTablet(width) {
    return this.getBreakpoint(width) === "tablet";
  }

  isDesktop(width) {
    const bp = this.getBreakpoint(width);
    return bp === "desktop" || bp === "laptop" || bp === "wide";
  }

  match(query) {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }
}

export const createResponsiveEngine = () => new ResponsiveEngine();

export default ResponsiveEngine;
