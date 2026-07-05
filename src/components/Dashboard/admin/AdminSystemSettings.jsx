import React from "react";

const SETTINGS_SECTIONS = [
  { title: "Branding", fields: ["Logo", "Primary color", "Tagline"] },
  { title: "Theme", fields: ["Light / Dark default", "Accent tokens"] },
  { title: "Languages", fields: ["Default locale", "Enabled languages"] },
  { title: "Currencies", fields: ["Default currency (RWF)", "Display format"] },
  { title: "Commission", fields: ["Platform rate (4%)", "Referral rate (5%)"] },
  { title: "Referral", fields: ["Program enabled", "Signup bonus"] },
  { title: "Notifications", fields: ["Email alerts", "Push notifications"] },
  { title: "Security", fields: ["2FA requirement", "Session timeout"] },
  { title: "Maintenance", fields: ["Maintenance mode", "Banner message"] },
];

const AdminSystemSettings = () => (
  <section id="admin-settings" className="space-y-6 scroll-mt-24 yebone-fade-up">
    <div>
      <h2 className="font-Poppins text-xl font-semibold dark:text-white">System settings</h2>
      <p className="text-sm text-gray-500 mt-1">Platform configuration center (presentation only)</p>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.title} className="vendor-form-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">{section.title}</h3>
          <ul className="space-y-3">
            {section.fields.map((field) => (
              <li key={field} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{field}</span>
                <span className="text-xs text-gray-400">Configure →</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default AdminSystemSettings;
