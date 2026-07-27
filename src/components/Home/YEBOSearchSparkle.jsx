import React from "react";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi";

/** Compact YEBO sparkle control — lives inside the search field */
const YEBOSearchSparkle = ({ onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`home-header__search-yebo ${className}`.trim()}
    aria-label="Open YEBO AI"
    title="YEBO AI"
  >
    <span className="home-header__search-yebo-mark" aria-hidden="true">
      <HiOutlineSparkles className="home-header__search-yebo-outline" size={16} />
      <HiSparkles className="home-header__search-yebo-fill" size={8} />
    </span>
  </button>
);

export default YEBOSearchSparkle;
