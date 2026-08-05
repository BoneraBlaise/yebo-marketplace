import React from "react";
import { useSearchParams } from "react-router-dom";
import { SEARCH_VERTICALS } from "../../constants/marketplaceSearchConstants";
import "./global-marketplace-search.css";

const GlobalMarketplaceSearchToolbar = ({ searchTerm = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeVertical = searchParams.get("vertical") || "all";

  const handleVertical = (verticalId) => {
    const next = new URLSearchParams(searchParams);
    if (verticalId === "all") {
      next.delete("vertical");
    } else {
      next.set("vertical", verticalId);
    }
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  if (!searchTerm?.trim()) return null;

  return (
    <nav className="gms-toolbar" aria-label="Search category filters">
      <div className="gms-toolbar__inner">
        <span className="gms-toolbar__label">Show:</span>
        {SEARCH_VERTICALS.map((vertical) => (
          <button
            key={vertical.id}
            type="button"
            className={`gms-toolbar__chip${activeVertical === vertical.id ? " is-active" : ""}`}
            aria-pressed={activeVertical === vertical.id}
            onClick={() => handleVertical(vertical.id)}
          >
            {vertical.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default GlobalMarketplaceSearchToolbar;

export const shouldShowVertical = (vertical, activeVertical) =>
  activeVertical === "all" || activeVertical === vertical;
