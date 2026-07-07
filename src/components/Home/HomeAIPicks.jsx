import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, SectionTitle, Badge } from "../ui";
import HomeProductCard from "./HomeProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { getAIPicksProducts } from "./homeAIPicksFilters";
import { MarketplaceCardGrid, MarketplaceCardSlot } from "../Marketplace/cards";

const HomeAIPicks = () => {
  const { allProducts } = useSelector((state) => state.products);

  const picks = useMemo(
    () => getAIPicksProducts(allProducts, 4),
    [allProducts]
  );

  const hasData = picks.length >= 2;

  return (
    <section id="ai-picks" className="home-section home-section--compact home-surface-0">
      <Container>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gold">AI Powered</Badge>
          <span className="text-xs font-semibold text-yebone-primary uppercase tracking-wider flex items-center gap-1">
            <HiOutlineSparkles size={14} />
            Yebone AI
          </span>
        </div>

        <SectionTitle
          title="AI Picks for you"
          subtitle={
            hasData
              ? "Curated fashion, beauty, and lifestyle — prioritized by Yebone AI."
              : "Analyzing trends across Yebone — your personalized picks are loading."
          }
          align="left"
        />

        {hasData ? (
          <MarketplaceCardGrid>
            {picks.map((product) => (
              <MarketplaceCardSlot key={product._id}>
                <HomeProductCard data={product} compact fluid />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        ) : (
          <ProductCardSkeleton count={4} compact layout="grid" />
        )}

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="text-sm font-semibold text-yebone-primary hover:underline"
          >
            Browse all products on Yebone →
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default HomeAIPicks;
