import React from "react";
import { HiOutlineSparkles, HiOutlineSearch, HiOutlineShieldCheck, HiOutlineEye } from "react-icons/hi";

const AI_FEATURES = [
  { id: "recs", label: "AI Recommendations", icon: HiOutlineSparkles, status: "Beta" },
  { id: "search", label: "AI Search", icon: HiOutlineSearch, status: "Coming soon" },
  { id: "tryon", label: "Virtual Try-On", icon: HiOutlineEye, status: "Coming soon" },
  { id: "fraud", label: "Fraud Detection", icon: HiOutlineShieldCheck, status: "Preview" },
  { id: "moderation", label: "Smart Moderation", icon: HiOutlineShieldCheck, status: "Preview" },
];

const AdminAICenter = () => (
  <section id="admin-ai" className="space-y-6 scroll-mt-24 yebone-fade-up">
    <div>
      <h2 className="font-Poppins text-xl font-semibold dark:text-white">AI control center</h2>
      <p className="text-sm text-gray-500 mt-1">Future-ready feature flags and analytics placeholders</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {AI_FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.id} className="admin-feature-card dashboard-section yebone-surface yebone-card-lift">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yebone-primary/10 flex items-center justify-center text-yebone-primary">
                <Icon size={20} />
              </div>
              <span className="vendor-status-pill">{feature.status}</span>
            </div>
            <h3 className="font-Poppins font-semibold dark:text-white">{feature.label}</h3>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked={feature.status === "Beta"} readOnly />
              <span className="text-sm text-gray-500">Feature flag</span>
            </label>
          </div>
        );
      })}
    </div>
    <div className="dashboard-section yebone-surface border border-dashed border-yebone-primary/20">
      <h3 className="font-Poppins font-semibold mb-2 dark:text-white">AI analytics</h3>
      <p className="text-3xl font-semibold text-yebone-primary">—</p>
      <p className="text-xs text-gray-500 mt-2">Integration coming soon</p>
    </div>
  </section>
);

export default AdminAICenter;
