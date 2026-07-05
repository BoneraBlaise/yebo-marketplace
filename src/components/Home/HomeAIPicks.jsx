import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, SectionTitle, Badge } from "../ui";
import HomeProductCard from "./HomeProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { getAIPicksProducts } from "./homeAIPicksFilters";

const HomeAIPicks = () => {
  const { allProducts } = useSelector((state) => state.products);

  const picks = useMemo(
    () => getAIPicksProducts(allProducts, 4),
    [allProducts]
  );

  const hasData = picks.length >= 2;

  return (
    <section id="ai-picks" className="home-section bg-gradient-to-b from-transparent to-yebone-light-gray/40 dark:to-gray-900/20">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 justify-items-center lg:justify-items-stretch home-fade-up">
            {picks.map((product) => (
              <div key={product._id} className="w-full flex justify-center">
                <HomeProductCard data={product} compact />
              </div>
            ))}
          </div>
        ) : (
          <ProductCardSkeleton count={4} compact />
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
