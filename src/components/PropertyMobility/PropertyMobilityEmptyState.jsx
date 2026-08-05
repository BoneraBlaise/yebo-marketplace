import React from "react";
import "./property-mobility-ui.css";

const PropertyMobilityEmptyState = ({
  onReset,
  onCreate,
  title = "No properties found",
  description,
  compact = false,
  createLabel = "Create Listing",
}) => {
  const isVendorEmpty = Boolean(onCreate) && !onReset;

  return (
    <div className={`pm-empty-state${compact ? " pm-empty-state--compact" : ""}${isVendorEmpty ? " pm-empty-state--vendor" : ""}`} role="status">
      <div className="pm-empty-state__illustration" aria-hidden="true">
        {isVendorEmpty ? "🏡" : "🏠"}
      </div>
      <h3 className="pm-empty-state__title">{title}</h3>
      <p className="pm-empty-state__desc">
        {description ||
          (onCreate
            ? "Create your first property or mobility listing."
            : "Try changing your filters or search another location.")}
      </p>
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
    </div>
  );
};

export default PropertyMobilityEmptyState;
