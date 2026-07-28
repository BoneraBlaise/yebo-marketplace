import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import HomeProductCard from "../Home/HomeProductCard";
import "../Marketplace/cards/marketplaceCards.css";

const buildTabs = (data) => [
  {
    id: "location",
    label: data.location ? `More in ${data.location}` : "More nearby",
  },
  {
    id: "shop",
    label: "From this Shop",
  },
  {
    id: "price",
    label: "Similar Price",
  },
];

const ProductSimilarRails = ({ data }) => {
  const { allProducts, products: shopProducts } = useSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState("location");
  const tabs = useMemo(() => buildTabs(data), [data]);

  const pool = useMemo(() => {
    const merged = [...(allProducts || []), ...(shopProducts || [])];
    const seen = new Set();
    return merged.filter((p) => {
      if (!p?._id || p._id === data?._id || seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });
  }, [allProducts, shopProducts, data?._id]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const price = Number(data.discountPrice) || 0;
    const min = price * 0.8;
    const max = price * 1.2;

    if (activeTab === "shop") {
      return pool.filter((p) => String(p.shopId) === String(data.shop?._id || data.shopId));
    }
    if (activeTab === "price") {
      return pool.filter((p) => {
        const pPrice = Number(p.discountPrice) || 0;
        return pPrice >= min && pPrice <= max;
      });
    }
    if (data.location) {
      return pool.filter((p) => p.location === data.location);
    }
    return pool.filter((p) => p.category === data.category);
  }, [pool, activeTab, data]);

  const items = filtered.slice(0, 12);
  if (!items.length) return null;

  return (
    <section className="pdp-section" aria-label="Similar products">
        <div className="flex flex-col gap-3 mb-3">
        <h2 className="font-Poppins text-lg lg:text-xl font-semibold dark:text-white">Similar products</h2>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-yebone-primary text-white shadow-md shadow-yebone-primary/20"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700 hover:border-yebone-primary/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mpc-rail mpc-rail--carousel mpc-rail--pdp" role="tabpanel">
        {items.map((product) => (
          <div key={product._id} className="mpc-rail__item mpc-rail__item--pdp">
            <HomeProductCard data={product} compact dense fluid />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSimilarRails;
