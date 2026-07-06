/** @typedef {import('../types').YIPFeatureModule} YIPFeatureModule */

const modules = new Map();

const DEFAULT_MODULES = [
  { id: "search", label: "AI Search", description: "Natural language product discovery", status: "planned" },
  { id: "recommendations", label: "Recommendations", description: "Personalized product picks", status: "beta" },
  { id: "try-on", label: "Virtual Try-On", description: "Visual fit preview", status: "planned" },
  { id: "stylist", label: "Stylist", description: "Outfit and style guidance", status: "planned" },
  { id: "assistant", label: "Shopping Assistant", description: "YEBO conversational helper", status: "beta" },
  { id: "vendor-insights", label: "Vendor Insights", description: "Seller business intelligence", status: "planned" },
  { id: "admin-insights", label: "Admin Insights", description: "Platform AI analytics", status: "planned" },
  { id: "fraud", label: "Fraud Detection", description: "Risk and anomaly signals", status: "planned" },
  { id: "image-search", label: "Image Search", description: "Visual product lookup", status: "planned" },
  { id: "voice", label: "Voice", description: "Voice-driven shopping", status: "planned" },
];

DEFAULT_MODULES.forEach((m) => modules.set(m.id, { ...m }));

export const YIPRegistry = {
  register(id, meta) {
    modules.set(id, { status: "planned", ...meta, id });
    return modules.get(id);
  },

  get(id) {
    return modules.get(id) || null;
  },

  list() {
    return Array.from(modules.values());
  },

  isEnabled(id) {
    const mod = modules.get(id);
    return mod?.status === "active" || mod?.status === "beta";
  },

  setStatus(id, status) {
    const mod = modules.get(id);
    if (mod) modules.set(id, { ...mod, status });
  },
};

export default YIPRegistry;
