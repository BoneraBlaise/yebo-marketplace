import React from "react";
import { useEnterpriseTheme } from "../theme/ThemeProvider";
import { THEME_MODE } from "../theme/ThemeEngine";
import { focusRingClass } from "../accessibility";
import { motionClasses } from "../motion/MotionSystem";

/** Production theme toggle — Light / Dark / System — Phase 8I */
export const ThemeToggle = ({ className = "" }) => {
  const theme = useEnterpriseTheme();
  const current = theme?.mode || THEME_MODE.SYSTEM;

  if (!theme) return null;

  const modes = [
    { id: THEME_MODE.LIGHT, label: "Light", icon: "☀️" },
    { id: THEME_MODE.DARK, label: "Dark", icon: "🌙" },
    { id: THEME_MODE.SYSTEM, label: "System", icon: "💻" },
  ];

  return (
    <div
      className={`inline-flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800 ${motionClasses.micro} ${className}`}
      role="group"
      aria-label="Theme mode"
    >
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => theme.setMode(m.id)}
          aria-pressed={current === m.id}
          aria-label={`${m.label} mode`}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${focusRingClass} ${
            current === m.id
              ? "bg-yebone-primary text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
          }`}
        >
          <span aria-hidden="true">{m.icon}</span>
          <span className="hidden sm:inline ml-1">{m.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
