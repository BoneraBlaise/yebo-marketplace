import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { wrapHeaderHandler } from "../../utils/headerInteractionDebug";

/** Compact header theme toggle — sun / moon icon button */
const HeaderThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = wrapHeaderHandler("theme", toggleTheme);

  return (
    <button
      type="button"
      className={`home-header__icon-btn home-header__theme-btn ${className}`.trim()}
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="home-header__theme-icon" aria-hidden="true">
        {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
      </span>
    </button>
  );
};

export default React.memo(HeaderThemeToggle);
