import React from "react";
import { HiOutlineCamera } from "react-icons/hi";

/** Compact camera / visual search control inside the search field */
const YEBOSearchCamera = ({ onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`home-header__search-camera ${className}`.trim()}
    aria-label="Visual search"
    title="Visual Search"
  >
    <HiOutlineCamera size={16} aria-hidden="true" />
  </button>
);

export default YEBOSearchCamera;
