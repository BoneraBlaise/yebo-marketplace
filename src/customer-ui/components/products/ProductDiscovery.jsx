import React, { useState } from "react";
import { Card, Select, Pagination, EmptyState } from "../../../design-system/components";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const ProductCard = ({ product }) => (
  <Card className="cursor-pointer" role="article" aria-label={product.name}>
    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-3xl">🛍️</div>
    <p className="text-sm font-medium truncate">{product.name}</p>
    <p className="text-xs text-gray-500">{product.vendor}</p>
    <div className="flex items-center justify-between mt-2">
      <p className="text-yebone-primary font-bold">${product.price}</p>
      <span className="text-xs text-gray-400">⭐ {product.rating}</span>
    </div>
    {!product.inStock && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
  </Card>
);

export const ProductGrid = ({ products = [] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label="Products">
    {products.map((p) => <div key={p.id} role="listitem"><ProductCard product={p} /></div>)}
  </div>
);

export const ProductFilters = ({ filters = {}, onChange }) => {
  logCustomerUIDiagnostics("component", { name: "ProductFilters" });
  return (
    <aside aria-label="Filters" className="space-y-4 p-4 border rounded-xl">
      <h3 className="font-semibold text-sm">Filters</h3>
      <div>
        <label className="text-xs text-gray-500">Category</label>
        <Select value={filters.category || ""} onChange={(e) => onChange?.({ ...filters, category: e.target.value })} aria-label="Filter by category">
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
        </Select>
      </div>
      <div>
        <label className="text-xs text-gray-500">Price Range</label>
        <Select value={filters.price || ""} onChange={(e) => onChange?.({ ...filters, price: e.target.value })} aria-label="Filter by price">
          <option value="">Any</option>
          <option value="0-50">Under $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={filters.inStock || false} onChange={(e) => onChange?.({ ...filters, inStock: e.target.checked })} />
        In stock only
      </label>
    </aside>
  );
};

export const ProductSort = ({ value = "popular", onChange }) => (
  <Select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-40" aria-label="Sort products">
    <option value="popular">Most Popular</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="rating">Top Rated</option>
    <option value="newest">Newest</option>
  </Select>
);

export const ProductPagination = ({ page = 1, totalPages = 5, onChange }) => (
  <div className="flex justify-center mt-8"><Pagination page={page} totalPages={totalPages} onChange={onChange} /></div>
);

export const RecentlyViewed = ({ products = [] }) => (
  <section aria-label="Recently Viewed" className="mb-8">
    <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>
    {products.length === 0 ? <EmptyState title="No recently viewed items" /> : (
      <div className="flex gap-3 overflow-x-auto pb-2">{products.map((p) => <div key={p.id} className="min-w-[140px]"><ProductCard product={p} /></div>)}</div>
    )}
  </section>
);

export const TrendingProducts = ({ products = [] }) => (
  <section aria-label="Trending Products" className="mb-8">
    <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
    <ProductGrid products={products.slice(0, 4)} />
  </section>
);

export const ProductListing = ({ products, filters, onFilterChange, sort, onSortChange, page, onPageChange }) => {
  const [localFilters, setLocalFilters] = useState(filters || {});
  const [localSort, setLocalSort] = useState(sort || "popular");
  const [localPage, setLocalPage] = useState(page || 1);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <ProductFilters filters={localFilters} onChange={(f) => { setLocalFilters(f); onFilterChange?.(f); }} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{products?.length || 0} products</p>
          <ProductSort value={localSort} onChange={(v) => { setLocalSort(v); onSortChange?.(v); }} />
        </div>
        <ProductGrid products={products} />
        <ProductPagination page={localPage} onChange={(p) => { setLocalPage(p); onPageChange?.(p); }} />
      </div>
    </div>
  );
};

export default { ProductCard, ProductGrid, ProductFilters, ProductSort, ProductPagination, RecentlyViewed, TrendingProducts, ProductListing };
