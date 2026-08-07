import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, SectionTitle } from "../ui";
import {
  MarketplaceCardGrid,
  MarketplaceCardSlot,
  MarketplaceCardSwipe,
  MarketplaceVendorCard,
  MarketplaceCardSkeleton,
} from "../Marketplace/cards";
import {
  getFeaturedVerifiedVendors,
  getBrowseVerifiedVendors,
} from "./homeProductFilters";

const HomeVerifiedVendors = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const featuredVendors = useMemo(
    () => getFeaturedVerifiedVendors(allProducts, 4),
    [allProducts]
  );

  const featuredIds = useMemo(
    () => featuredVendors.map((shop) => shop._id),
    [featuredVendors]
  );

  const browseVendors = useMemo(
    () => getBrowseVerifiedVendors(allProducts, 12, featuredIds),
    [allProducts, featuredIds]
  );

  if (!featuredVendors.length && !browseVendors.length && !isLoading) return null;

  return (
    <section className="home-section home-section--compact home-surface-2">
      <Container>
        <SectionTitle
          title="Featured verified vendors"
          subtitle="Trusted sellers with verified profiles and quality listings."
          align="left"
        />

        {isLoading || !allProducts ? (
          <MarketplaceCardSkeleton count={4} variant="vendor" layout="grid" />
        ) : (
          <MarketplaceCardGrid className="mb-8 lg:mb-10">
            {featuredVendors.map((shop) => (
              <MarketplaceCardSlot key={shop._id}>
                <MarketplaceVendorCard shop={shop} featured />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        )}

        {browseVendors.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <SectionTitle
                title="More verified stores"
                subtitle="Swipe to explore additional trusted sellers on Yebone."
                align="left"
                className="!mb-0"
              />
              <Link
                to="/products"
                className="text-sm font-semibold text-yebone-primary hover:underline shrink-0 min-h-[44px] inline-flex items-center"
              >
                View all sellers →
              </Link>
            </div>

            {isLoading || !allProducts ? (
              <MarketplaceCardSkeleton count={4} variant="vendor" layout="swipe" />
            ) : (
              <MarketplaceCardSwipe>
                {browseVendors.map((shop) => (
                  <MarketplaceVendorCard key={shop._id} shop={shop} />
                ))}
              </MarketplaceCardSwipe>
            )}
          </>
        ) : null}
      </Container>
    </section>
  );
};

export default HomeVerifiedVendors;
