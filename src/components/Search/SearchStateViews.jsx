import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MarketplaceListingSkeleton, MarketplaceEmptyState } from "../Marketplace";
import { ErrorState } from "../ui";

const SearchStateViews = ({
  isLoading = false,
  error = null,
  hasResults = false,
  searchTerm = "",
  onRetry,
  children,
}) => {
  if (isLoading) {
    return <MarketplaceListingSkeleton count={8} />;
  }

  if (error) {
    return (
      <ErrorState
        preset="network"
        title="Search unavailable"
        description={error}
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  if (!hasResults) {
    return (
      <MarketplaceEmptyState
        icon={IoSearchOutline}
        title="No products found"
        message={
          searchTerm
            ? `We couldn't find matches for "${searchTerm}". Try different keywords or clear your filters.`
            : "No products match your current filters. Adjust filters or browse the full marketplace."
        }
        actionLabel="Browse all products"
        actionTo="/products"
      />
    );
  }

  return children || null;
};

export default SearchStateViews;
