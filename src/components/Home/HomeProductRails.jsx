import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import { Container, SectionTitle } from "../ui";
import { PRODUCT_TABS, getProductsByTab } from "./homeProductFilters";
import HomeProductCard from "./HomeProductCard";
import HomeFlashSaleCard from "./HomeFlashSaleCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

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
    <section className="home-section bg-white dark:bg-gray-950">
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
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-yebone-primary text-white shadow-md shadow-yebone-primary/25"
                    : "bg-yebone-light-gray dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
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
          <p className="text-center py-16 text-gray-500">No products in this collection yet.</p>
        ) : (
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory -mx-1 px-1">
            {products.map((item) => (
              <div key={item._id} className="snap-start shrink-0">
                {activeTab === "flash" ? (
                  <HomeFlashSaleCard data={item} />
                ) : (
                  <HomeProductCard data={item} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-yebone-primary text-yebone-primary font-semibold hover:bg-yebone-primary hover:text-white transition"
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
