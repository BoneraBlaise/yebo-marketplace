import React from "react";
import { Link } from "react-router-dom";
import { typography } from "../../design-system/typography";

const MarketplacePageHero = ({
  title,
  subtitle,
  breadcrumbs = [],
  count,
  searchTerm,
  badge,
}) => (
  <div className="marketplace-hero yebone-fade-up mb-6 lg:mb-8">
    {breadcrumbs.length > 0 && (
      <nav className="marketplace-breadcrumb mb-3 relative z-10" aria-label="Breadcrumb">
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

    <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {badge && (
          <span className="inline-block mb-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wide">
            {badge}
          </span>
        )}
        <h1 className={`${typography.heading} text-white text-2xl md:text-3xl lg:text-4xl`}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-white/85 text-sm md:text-base max-w-2xl">{subtitle}</p>
        )}
        {searchTerm && (
          <p className="mt-3 text-white/90 text-sm">
            Results for <strong>&ldquo;{searchTerm}&rdquo;</strong>
          </p>
        )}
      </div>
      {typeof count === "number" && (
        <p className="text-white/80 text-sm font-medium whitespace-nowrap">
          {count} {count === 1 ? "result" : "results"}
        </p>
      )}
    </div>
  </div>
);

export default MarketplacePageHero;
