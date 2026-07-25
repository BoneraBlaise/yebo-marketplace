import React from "react";
import { Link } from "react-router-dom";

const ShopEmptyState = ({ icon = "📦", title, description, actionLabel, actionTo, onAction }) => (
  <div className="shop-empty" role="status">
    <div className="shop-empty__icon" aria-hidden="true">{icon}</div>
    <h3 className="shop-empty__title">{title}</h3>
    <p className="shop-empty__text">{description}</p>
    {actionLabel && actionTo ? (
      <Link to={actionTo} className="shop-hero__btn shop-hero__btn--primary inline-flex">
        {actionLabel}
      </Link>
    ) : null}
    {actionLabel && onAction ? (
      <button type="button" onClick={onAction} className="shop-hero__btn shop-hero__btn--primary">
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default ShopEmptyState;
