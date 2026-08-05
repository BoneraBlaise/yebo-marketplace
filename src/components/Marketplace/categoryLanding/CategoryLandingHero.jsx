import React from "react";
import { Link } from "react-router-dom";
import { formatProductCount } from "./categoryLandingUtils";
import "../shopping-ui.css";
import "./categoryLanding.css";

const CategoryLandingHero = ({ context, count }) => {
  if (!context) return null;

  const title =
    context.type === "main-chip"
      ? `${context.displayTitle} · ${context.title}`
      : context.displayTitle || context.title;

  return (
    <header className="shop-category-header" aria-labelledby="category-landing-title">
      {context.breadcrumbs?.length > 0 && (
        <nav className="shop-header__breadcrumb" aria-label="Breadcrumb">
          {context.breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.to ? (
                <Link to={crumb.to}>{crumb.label}</Link>
              ) : (
                <span className={index === context.breadcrumbs.length - 1 ? "is-current" : ""}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <h1 id="category-landing-title" className="shop-category-header__title">
        {title}
      </h1>
      <p className="shop-category-header__subtitle">{formatProductCount(count)}</p>
    </header>
  );
};

export default CategoryLandingHero;
