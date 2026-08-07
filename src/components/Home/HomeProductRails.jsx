import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { Container, SectionTitle } from "../ui";
import {
  getProductTabs,
  getProductsByTab,
  getDefaultProductTab,
} from "./homeProductFilters";
import ProductCard from "../Marketplace/ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import MarketplaceEmptyState from "../Marketplace/MarketplaceEmptyState";
import { MarketplaceCardRail } from "../Marketplace/cards";

const EMPTY_COPY = {
  trending: {
    title: "Trending picks coming soon",
    message: "We're curating the most popular products across Africa. Check back shortly or browse the full marketplace.",
  },
  new: {
    title: "New arrivals on the way",
    message: "Fresh listings land daily. Explore the marketplace while we update this collection.",
  },
  flash: {
    title: "No flash deals right now",
    message: "Limited-time offers appear here when sellers run promotions. Browse trending products in the meantime.",
  },
  forYou: {
    title: "Personal picks loading",
    message: "Shop and browse to help us tailor recommendations just for you.",
  },
  recommended: {
    title: "Recommendations coming soon",
    message: "Featured products will appear here. Start exploring the marketplace today.",
  },
};

const HomeProductRails = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { flashSales } = useSelector((state) => state.flashSales);
  const { isAuthenticated } = useSelector((state) => state.user);
  const tabs = useMemo(
    () => getProductTabs(isAuthenticated, flashSales),
    [isAuthenticated, flashSales]
  );
  const [activeTab, setActiveTab] = useState(() => getDefaultProductTab(isAuthenticated));

  useEffect(() => {
    setActiveTab(getDefaultProductTab(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(getDefaultProductTab(isAuthenticated));
    }
  }, [tabs, activeTab, isAuthenticated]);

  const products = useMemo(() => {
    const items = getProductsByTab(activeTab, allProducts, flashSales);
    if (activeTab === "flash" && !items.length && allProducts?.length) {
      return getProductsByTab("trending", allProducts, flashSales);
    }
    return items;
  }, [activeTab, allProducts, flashSales]);

  const isFlashFallback =
    activeTab === "flash" &&
    !(Array.isArray(flashSales) && flashSales.length) &&
    products.length > 0;

  const loading = isLoading || !allProducts;
  const emptyConfig = EMPTY_COPY[activeTab] || EMPTY_COPY.trending;

  const viewAllHref =
    activeTab === "flash"
      ? "/flash-sales"
      : activeTab === "recommended" || activeTab === "forYou"
      ? "/best-selling"
      : "/products";

  return (
    <section id="discover-products" className="home-section home-section--compact home-surface-1">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 md:mb-8">
          <SectionTitle
            title="Discover products"
            subtitle="Handpicked collections — updated daily across Africa."
            align="left"
            className="mb-0"
          />

          <div
            className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1"
            role="tablist"
            aria-label="Product collections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`home-tab shrink-0 ${
                  activeTab === tab.id ? "home-tab--active" : "home-tab--idle"
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
          <MarketplaceEmptyState
            icon={HiOutlineShoppingBag}
            title={emptyConfig.title}
            message={emptyConfig.message}
            actionLabel="Browse marketplace"
            actionTo="/products"
            secondaryLabel="View categories"
            secondaryTo="/products"
            className="home-empty-state--inline"
          />
        ) : (
          <>
            {isFlashFallback ? (
              <p className="home-rail-fallback-note mb-4">
                Flash deals are unavailable — showing trending products instead.
              </p>
            ) : null}
            <MarketplaceCardRail
              aria-label={`${tabs.find((t) => t.id === activeTab)?.label || "Products"} carousel`}
            >
              {products.map((item) => (
                <ProductCard key={item._id} data={item} />
              ))}
            </MarketplaceCardRail>
          </>
        )}

        <div className="flex justify-center mt-6 md:mt-8">
          <Link
            to={viewAllHref}
            className="home-btn-lift home-btn-outline inline-flex items-center gap-2 min-h-[44px] px-5"
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
