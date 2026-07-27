import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useEnterpriseTheme } from "../../design-system/theme/ThemeProvider";
import { THEME_MODE } from "../../design-system/theme/ThemeEngine";

/** Compact header theme toggle — sun / moon icon button */
const HeaderThemeToggle = ({ className = "" }) => {
  const theme = useEnterpriseTheme();

  if (!theme) return null;

  const isDark = theme.resolvedMode === THEME_MODE.DARK;

  return (
    <button
      type="button"
      className={`home-header__icon-btn home-header__theme-btn ${className}`.trim()}
      onClick={theme.toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="home-header__theme-icon" aria-hidden="true">
        {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
      </span>
    </button>
  );
};

export default HeaderThemeToggle;
