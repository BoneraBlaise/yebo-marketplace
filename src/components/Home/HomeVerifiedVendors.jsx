import React, { useMemo } from "react";
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

  const browseVendors = useMemo(
    () => getBrowseVerifiedVendors(allProducts, 16),
    [allProducts]
  );

  if (!featuredVendors.length && !browseVendors.length && !isLoading) return null;

  return (
    <section className="home-section home-surface-2">
      <Container>
        <SectionTitle
          title="Featured verified vendors"
          subtitle="Curated premium merchants — trusted sellers on Yebone."
          align="left"
        />

        {isLoading || !allProducts ? (
          <MarketplaceCardSkeleton count={4} variant="vendor" layout="grid" />
        ) : (
          <MarketplaceCardGrid className="mb-10 lg:mb-12">
            {featuredVendors.map((shop) => (
              <MarketplaceCardSlot key={shop._id}>
                <MarketplaceVendorCard shop={shop} featured />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        )}

        <SectionTitle
          title="Browse all verified vendors"
          subtitle="Swipe to discover more trusted stores — four at a time on mobile."
          align="left"
          className="!mt-0"
        />

        {isLoading || !allProducts ? (
          <MarketplaceCardSkeleton count={4} variant="vendor" layout="swipe" />
        ) : browseVendors.length > 0 ? (
          <MarketplaceCardSwipe>
            {browseVendors.map((shop) => (
              <MarketplaceVendorCard key={shop._id} shop={shop} />
            ))}
          </MarketplaceCardSwipe>
        ) : null}
      </Container>
    </section>
  );
};

export default HomeVerifiedVendors;
