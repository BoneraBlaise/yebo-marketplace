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
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center py-16 lg:py-20 px-4 yebone-fade-up ${className}`}
  >
    {Icon && (
      <div className="w-20 h-20 mb-5 rounded-2xl yebone-surface flex items-center justify-center">
        <Icon size={36} className="text-yebone-primary" />
      </div>
    )}
    <h2 className={`${typography.heading} mb-2 text-xl md:text-2xl`}>{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
      {message}
    </p>
    <Link to={actionTo}>
      <Button size="lg" className="yebone-btn-lift">
        {actionLabel}
      </Button>
    </Link>
  </div>
);

export default MarketplaceEmptyState;
