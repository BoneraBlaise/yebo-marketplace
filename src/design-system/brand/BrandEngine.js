import { logDesignSystemDiagnostics } from "../diagnostics/DesignSystemDiagnostics";

const DEFAULT_BRAND = {
  organizationId: "default",
  logo: null,
  primaryColor: "#29625d",
  secondaryColor: "#1a4c47",
  accentColor: "#fed592",
  typography: { fontFamily: "Poppins, sans-serif", fontBody: "Roboto, sans-serif" },
  radius: "0.5rem",
  icons: {},
};

/** Organization Brand Engine — Phase 8G */
export class BrandEngine {
  constructor(initialBrand = {}) {
    this.brand = { ...DEFAULT_BRAND, ...initialBrand };
    this.listeners = new Set();
  }

  setBrand(brand = {}) {
    this.brand = { ...this.brand, ...brand };
    this.apply();
    this.listeners.forEach((fn) => fn(this.brand));
    return this.brand;
  }

  getBrand() {
    return { ...this.brand };
  }

  apply() {
    if (typeof document === "undefined") return this.brand;
    const root = document.documentElement;
    const b = this.brand;

    root.style.setProperty("--yebone-primary", b.primaryColor);
    root.style.setProperty("--yebone-secondary", b.secondaryColor);
    root.style.setProperty("--yebone-accent", b.accentColor);
    root.style.setProperty("--yebone-brand-radius", b.radius);
    root.style.setProperty("--yebone-font-display", b.typography?.fontFamily || "Poppins, sans-serif");
    root.style.setProperty("--yebone-font-body", b.typography?.fontBody || "Roboto, sans-serif");

    if (b.logo) root.style.setProperty("--yebone-brand-logo", `url(${b.logo})`);

    logDesignSystemDiagnostics("brand", {
      organizationId: b.organizationId,
      primary: b.primaryColor,
    });

    return this.brand;
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const createBrandEngine = (brand) => new BrandEngine(brand);

export default BrandEngine;
