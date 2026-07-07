import React from "react";
import { HiOutlineSparkles, HiSparkles } from "react-icons/hi";

const YEBOSparkleMark = ({ outlineSize = 26, coreSize = 11 }) => (
  <span className="ai-fab__brand-mark" aria-hidden="true">
    <HiOutlineSparkles className="ai-fab__sparkle-outline" size={outlineSize} />
    <HiSparkles className="ai-fab__sparkle-fill" size={coreSize} />
  </span>
);

export default YEBOSparkleMark;
