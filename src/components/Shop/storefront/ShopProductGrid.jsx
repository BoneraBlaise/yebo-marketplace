import React, { useMemo, useState } from "react";
import ProductCard from "../../Route/ProductCard/ProductCard";
import ShopEmptyState from "./ShopEmptyState";

const ShopCategoryTabs = ({ categories = [], activeCategory, onSelect }) => {
  const tabs = useMemo(() => ["All Products", ...categories], [categories]);

  return (
    <nav className="shop-category-tabs" aria-label="Shop categories">
      <div className="shop-category-tabs__scroll" role="tablist">
        {tabs.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`shop-category-tab ${activeCategory === cat ? "is-active" : ""}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

const ShopProductGrid = ({ products = [], isOwner, shopId }) => {
  const [activeCategory, setActiveCategory] = useState("All Products");

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (activeCategory === "All Products") return sorted;
    return sorted.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section aria-label="Shop products">
      <ShopCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {filtered.length === 0 ? (
        <ShopEmptyState
          icon="📦"
          title="No products yet"
          description={
            isOwner
              ? "Add your first product to start selling on Yebone."
              : "This shop hasn't listed any products in this category yet."
          }
          actionLabel={isOwner ? "Add Product" : undefined}
          actionTo={isOwner ? "/dashboard-create-product" : undefined}
        />
      ) : (
        <div className="shop-product-grid">
          {filtered.map((product) => (
            <div key={product._id} className="mpc-card-slot">
              <ProductCard data={product} isShop />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopProductGrid;
