import React from "react";
import "./property-mobility-ui.css";

const PropertyOfferTabs = ({ value, onChange, saleCount, rentCount }) => (
  <div className="pm-offer-tabs" role="tablist" aria-label="Listing offer type">
    <button
      type="button"
      role="tab"
      aria-selected={value === "sale"}
      className={`pm-offer-tabs__btn${value === "sale" ? " is-active" : ""}`}
      onClick={() => onChange("sale")}
    >
      For Sale
      {saleCount != null ? <span className="pm-offer-tabs__count">{saleCount}</span> : null}
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={value === "rent"}
      className={`pm-offer-tabs__btn${value === "rent" ? " is-active" : ""}`}
      onClick={() => onChange("rent")}
    >
      For Rent
      {rentCount != null ? <span className="pm-offer-tabs__count">{rentCount}</span> : null}
    </button>
  </div>
);

export default PropertyOfferTabs;
