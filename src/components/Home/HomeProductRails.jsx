import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import { Container, SectionTitle } from "../ui";
import { PRODUCT_TABS, getProductsByTab } from "./homeProductFilters";
import HomeProductCard from "./HomeProductCard";
import HomeFlashSaleCard from "./HomeFlashSaleCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { MarketplaceCardRail } from "../Marketplace/cards";

const HomeProductRails = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { flashSales } = useSelector((state) => state.flashSales);
  const [activeTab, setActiveTab] = useState("trending");

  const products = useMemo(
    () => getProductsByTab(activeTab, allProducts, flashSales),
    [activeTab, allProducts, flashSales]
  );

  const loading = isLoading || !allProducts;

  const viewAllHref =
    activeTab === "flash"
      ? "/flash-sales"
      : activeTab === "recommended"
      ? "/best-selling"
      : "/products";

  return (
    <section className="home-section home-surface-1">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionTitle
            title="Discover products"
            subtitle="Handpicked collections on Yebone — updated daily across Africa."
            align="left"
            className="mb-0"
          />

          <div className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`home-tab shrink-0 ${
                  activeTab === tab.id
                    ? "home-tab--active"
                    : "home-tab--idle"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProductCardSkeleton count={5} />
        ) : !products?.length ? (
          <p className="text-center py-16 text-[var(--home-text-muted)]">No products in this collection yet.</p>
        ) : (
          <MarketplaceCardRail aria-label={`${PRODUCT_TABS.find((t) => t.id === activeTab)?.label || "Products"} carousel`}>
            {products.map((item) =>
              activeTab === "flash" ? (
                <HomeFlashSaleCard key={item._id} data={item} />
              ) : (
                <HomeProductCard key={item._id} data={item} fluid />
              )
            )}
          </MarketplaceCardRail>
        )}

        <div className="flex justify-center mt-10">
          <Link
            to={viewAllHref}
            className="home-btn-lift home-btn-outline inline-flex items-center gap-2"
          >
            View all
            <MdNavigateNext size={20} />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default HomeProductRails;
