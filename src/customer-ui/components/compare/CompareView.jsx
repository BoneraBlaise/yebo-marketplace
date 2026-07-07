import React from "react";
import { Card, Button, EmptyState, DataTable } from "../../../design-system/components";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const FeatureComparison = ({ products = [] }) => {
  const columns = [
    { key: "feature", label: "Feature" },
    ...products.map((p) => ({ key: p.id, label: p.name })),
  ];
  const rows = [
    { id: "price", feature: "Price", ...Object.fromEntries(products.map((p) => [p.id, `$${p.price}`])) },
    { id: "rating", feature: "Rating", ...Object.fromEntries(products.map((p) => [p.id, `⭐ ${p.rating}`])) },
    { id: "stock", feature: "Availability", ...Object.fromEntries(products.map((p) => [p.id, p.inStock ? "In Stock" : "Out of Stock"])) },
    { id: "vendor", feature: "Vendor", ...Object.fromEntries(products.map((p) => [p.id, p.vendor])) },
  ];
  return <DataTable columns={columns} rows={rows} />;
};

export const PriceComparison = ({ products = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {products.map((p) => (
      <Card key={p.id} className="text-center">
        <p className="font-medium truncate">{p.name}</p>
        <p className="text-2xl font-bold text-yebone-primary mt-2">${p.price}</p>
        {p.originalPrice && <p className="text-sm text-gray-400 line-through">${p.originalPrice}</p>}
      </Card>
    ))}
  </div>
);

export const SpecificationsComparison = ({ products = [] }) => (
  <Card>
    <h3 className="font-semibold mb-3">Specifications</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr><th className="text-left p-2">Spec</th>{products.map((p) => <th key={p.id} className="text-left p-2">{p.name}</th>)}</tr></thead>
        <tbody>
          <tr><td className="p-2 text-gray-500">Category</td>{products.map((p) => <td key={p.id} className="p-2">{p.category}</td>)}</tr>
          <tr><td className="p-2 text-gray-500">Reviews</td>{products.map((p) => <td key={p.id} className="p-2">{p.reviews}</td>)}</tr>
        </tbody>
      </table>
    </div>
  </Card>
);

export const CompareView = ({ products = [] }) => {
  logCustomerUIDiagnostics("component", { name: "CompareView", count: products.length });
  if (products.length < 2) {
    return <EmptyState title="Add products to compare" description="Select at least 2 products to compare features and prices." action={<Button>Browse Products</Button>} />;
  }
  return (
    <section aria-label="Compare products">
      <PriceComparison products={products} />
      <FeatureComparison products={products} />
      <div className="mt-6"><SpecificationsComparison products={products} /></div>
    </section>
  );
};

export default CompareView;
