import React from "react";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineGlobe,
} from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { SectionTitle } from "../ui";

const DashboardSettings = ({ setActive }) => {
  const { theme, toggleTheme } = useTheme();

  const sections = [
    {
      icon: HiOutlineUser,
      title: "Personal information",
      desc: "Update your name, email, and phone",
      action: () => setActive(1),
    },
    {
      icon: HiOutlineLockClosed,
      title: "Password & security",
      desc: "Change your account password",
      action: () => setActive(6),
    },
    {
      icon: HiOutlineBell,
      title: "Notifications",
      desc: "Manage alerts and updates",
      action: () => setActive(12),
    },
    {
      icon: HiOutlineGlobe,
      title: theme === "dark" ? "Light mode" : "Dark mode",
      desc: "Switch appearance theme",
      action: toggleTheme,
    },
  ];

  return (
    <div className="space-y-6 yebone-fade-up">
      <SectionTitle title="Account settings" subtitle="Manage your Yebone account" align="left" className="mb-0" />

      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <button
            key={section.title}
            type="button"
            onClick={section.action}
            className="dashboard-section yebone-surface yebone-card-lift text-left p-5"
          >
            <section.icon className="text-yebone-primary mb-3" size={22} />
            <h3 className="font-semibold dark:text-white">{section.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.desc}</p>
          </button>
        ))}
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-semibold mb-2 dark:text-white">Privacy & preferences</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Language and region preferences are managed through your browser and Yebone global
          settings. Contact support for data privacy requests.
        </p>
      </div>
    </div>
  );
};

export default DashboardSettings;
