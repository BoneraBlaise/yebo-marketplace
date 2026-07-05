import React from "react";

const MarketplaceSectionTabs = ({ sections = [], activePath, onChange }) => (
  <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Marketplace sections">
    {sections.map((section) => {
      const isActive = activePath === section.path;
      return (
        <button
          key={section.path}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(section.path)}
          className={`marketplace-section-tab ${isActive ? "is-active" : ""}`}
        >
          {section.name}
        </button>
      );
    })}
  </div>
);

export default MarketplaceSectionTabs;
