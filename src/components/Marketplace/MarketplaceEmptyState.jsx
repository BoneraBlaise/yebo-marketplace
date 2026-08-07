import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";

const MarketplaceEmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  message = "Try adjusting your filters or browse other categories.",
  actionLabel = "Browse marketplace",
  actionTo = "/products",
  onAction,
  secondaryLabel,
  secondaryTo,
  onSecondary,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center py-12 md:py-16 lg:py-20 px-6 yebone-fade-up rounded-2xl border border-dashed border-gray-200/80 dark:border-gray-700/80 bg-gray-50/40 dark:bg-gray-900/30 ${className}`}
    role="status"
  >
    {Icon && (
      <div className="w-20 h-20 mb-5 rounded-2xl yebone-surface flex items-center justify-center shadow-yebo">
        <Icon size={36} className="text-yebone-primary" aria-hidden="true" />
      </div>
    )}
    <h2 className={`${typography.heading} mb-2 text-xl md:text-2xl`}>{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
      {message}
    </p>
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
      {actionLabel && actionTo && (
        <Link to={actionTo} className="w-full sm:w-auto">
          <Button size="lg" className="yebone-btn-lift w-full sm:w-auto min-h-[44px]">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction} className="yebone-btn-lift min-h-[44px]">
          {actionLabel}
        </Button>
      )}
      {secondaryLabel && secondaryTo && (
        <Link to={secondaryTo} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px]">
            {secondaryLabel}
          </Button>
        </Link>
      )}
      {secondaryLabel && onSecondary && (
        <Button variant="outline" size="lg" onClick={onSecondary} className="min-h-[44px]">
          {secondaryLabel}
        </Button>
      )}
    </div>
  </div>
);

export default MarketplaceEmptyState;
