import React from "react";
import { Link } from "react-router-dom";
import "./shopping-ui.css";

const ShoppingPageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  count,
  searchTerm,
}) => (
  <header className="shop-header">
    {breadcrumbs.length > 0 && (
      <nav className="shop-header__breadcrumb" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {crumb.to ? (
              <Link to={crumb.to}>{crumb.label}</Link>
            ) : (
              <span className={index === breadcrumbs.length - 1 ? "is-current" : ""}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )}

    <div className="shop-header__row">
      <div className="shop-header__copy">
        <h1 className="shop-header__title">{title}</h1>
        {subtitle ? <p className="shop-header__subtitle">{subtitle}</p> : null}
        {searchTerm ? (
          <p className="shop-header__search-term">
            Results for <strong>&ldquo;{searchTerm}&rdquo;</strong>
          </p>
        ) : null}
      </div>
      {typeof count === "number" ? (
        <p className="shop-header__count">
          {count.toLocaleString()} {count === 1 ? "result" : "results"}
        </p>
      ) : null}
    </div>
  </header>
);

export default ShoppingPageHeader;
