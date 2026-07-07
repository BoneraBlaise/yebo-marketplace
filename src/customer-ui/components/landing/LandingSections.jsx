import React from "react";
import { Card, Badge, Button, SearchInput } from "../../design-system/components";
import { logCustomerUIDiagnostics } from "../diagnostics/CustomerUIDiagnostics";

export const HeroSection = ({ title = "Discover Amazing Products", subtitle = "Shop from trusted vendors across South Africa" }) => {
  logCustomerUIDiagnostics("component", { name: "HeroSection" });
  return (
    <section aria-label="Hero" className="relative rounded-2xl bg-gradient-to-r from-yebone-primary to-yebone-secondary text-white p-8 md:p-12 mb-8">
      <h1 className="text-2xl md:text-4xl font-Poppins font-bold mb-2">{title}</h1>
      <p className="text-white/80 mb-6 max-w-lg">{subtitle}</p>
      <SearchInput placeholder="Search products, brands, categories..." className="max-w-md text-gray-900" aria-label="Search marketplace" />
    </section>
  );
};

export const SearchEntry = ({ onSearch }) => (
  <div className="mb-6">
    <SearchInput placeholder="What are you looking for?" onChange={(e) => onSearch?.(e.target.value)} aria-label="Search products" />
  </div>
);

export const CategoryGrid = ({ categories = [] }) => (
  <section aria-label="Categories" className="mb-8">
    <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((cat) => (
        <Card key={cat.id} className="text-center cursor-pointer hover:shadow-md transition-shadow" role="button" tabIndex={0} aria-label={`Browse ${cat.name}`}>
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">📦</div>
          <p className="text-sm font-medium">{cat.name}</p>
          <p className="text-xs text-gray-500">{cat.count} items</p>
        </Card>
      ))}
    </div>
  </section>
);

export const FeaturedProducts = ({ products = [], title = "Featured Products" }) => (
  <section aria-label={title} className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button variant="ghost" size="sm">View All</Button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="cursor-pointer" role="article" aria-label={p.name}>
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-3xl">🛍️</div>
          <p className="text-sm font-medium truncate">{p.name}</p>
          <p className="text-yebone-primary font-bold">${p.price}</p>
          {p.originalPrice && <p className="text-xs text-gray-400 line-through">${p.originalPrice}</p>}
        </Card>
      ))}
    </div>
  </section>
);

export const FeaturedVendors = ({ vendors = [] }) => (
  <section aria-label="Featured Vendors" className="mb-8">
    <h2 className="text-lg font-semibold mb-4">Featured Vendors</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {vendors.map((v) => (
        <Card key={v.id} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yebone-primary/10 flex items-center justify-center font-bold text-yebone-primary">{v.name[0]}</div>
          <div>
            <p className="font-medium">{v.name} {v.verified && <Badge variant="success">Verified</Badge>}</p>
            <p className="text-xs text-gray-500">⭐ {v.rating} · {v.products} products</p>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

export const PromotionsBanner = ({ promotions = [] }) => (
  <section aria-label="Promotions" className="mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {promotions.map((promo) => (
        <Card key={promo.id} className="bg-yebone-accent/10 border-yebone-accent">
          <Badge variant="warning">{promo.badge}</Badge>
          <h3 className="font-semibold mt-2">{promo.title}</h3>
          <p className="text-sm text-gray-600">{promo.description}</p>
        </Card>
      ))}
    </div>
  </section>
);

export default { HeroSection, SearchEntry, CategoryGrid, FeaturedProducts, FeaturedVendors, PromotionsBanner };
