import React from "react";
import { Link } from "react-router-dom";
import "./property-mobility-ui.css";

const PropertyMobilityEmptyState = ({
  onReset,
  onCreate,
  title = "No properties found",
  description,
  compact = false,
  createLabel = "Create listing",
  secondaryLabel,
  onSecondary,
  secondaryTo,
}) => {
  const isVendorEmpty = Boolean(onCreate) && !onReset;

  return (
    <div
      className={`pm-empty-state${compact ? " pm-empty-state--compact" : ""}${isVendorEmpty ? " pm-empty-state--vendor" : ""}`}
      role="status"
    >
      <div className="pm-empty-state__illustration" aria-hidden="true">
        {isVendorEmpty ? "🏡" : "🏠"}
      </div>
      <h3 className="pm-empty-state__title">{title}</h3>
      <p className="pm-empty-state__desc">
        {description ||
          (onCreate
            ? "Create your first property or mobility listing to reach buyers across Africa."
            : "Try changing your filters or search another location to discover more listings.")}
      </p>
      <div className="pm-empty-state__actions">
        {onCreate ? (
          <button type="button" className="pm-empty-state__create" onClick={onCreate}>
            {createLabel}
          </button>
        ) : null}
        {onReset ? (
          <button type="button" className="pm-empty-state__reset" onClick={onReset}>
            Reset filters
          </button>
        ) : null}
        {secondaryLabel && secondaryTo ? (
          <Link to={secondaryTo} className="pm-empty-state__secondary">
            {secondaryLabel}
          </Link>
        ) : null}
        {secondaryLabel && onSecondary ? (
          <button type="button" className="pm-empty-state__secondary" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyMobilityEmptyState;
