import React, { useState } from "react";
import { Card, Button, Input, Select, Textarea, Badge, Tabs, DataTable, EmptyState } from "../../../design-system/components";
import { AI_PREVIEW_TYPE_OPTIONS } from "../../constants/aiPreviewTypes";
import { mockProducts } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState(product || {
    name: "", sku: "", price: "", stock: "", ai_preview_type: "body_tryon",
    description: "", category: "", shipping: "", seoTitle: "", seoDescription: "",
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Card aria-label={product ? "Edit product" : "Create product"}>
      <h3 className="font-semibold mb-4">{product ? "Edit Product" : "Create Product"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-sm text-gray-500">Name</label><Input value={form.name} onChange={(e) => update("name", e.target.value)} aria-label="Product name" /></div>
        <div><label className="text-sm text-gray-500">SKU</label><Input value={form.sku} onChange={(e) => update("sku", e.target.value)} aria-label="SKU" /></div>
        <div><label className="text-sm text-gray-500">Price</label><Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} aria-label="Price" /></div>
        <div><label className="text-sm text-gray-500">Inventory</label><Input type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} aria-label="Inventory" /></div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-500">AI Preview Type (ai_preview_type)</label>
          <Select value={form.ai_preview_type} onChange={(e) => update("ai_preview_type", e.target.value)} aria-label="AI preview type">
            {AI_PREVIEW_TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>)}
          </Select>
        </div>
        <div><label className="text-sm text-gray-500">Category</label><Input value={form.category} onChange={(e) => update("category", e.target.value)} aria-label="Category" /></div>
        <div><label className="text-sm text-gray-500">Shipping</label><Input value={form.shipping} onChange={(e) => update("shipping", e.target.value)} aria-label="Shipping" /></div>
        <div className="md:col-span-2"><label className="text-sm text-gray-500">Description</label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} aria-label="Description" /></div>
        <div><label className="text-sm text-gray-500">Variants</label><Input placeholder="Size, Color..." aria-label="Variants" /></div>
        <div><label className="text-sm text-gray-500">Attributes</label><Input placeholder="Material, Brand..." aria-label="Attributes" /></div>
        <div><label className="text-sm text-gray-500">SEO Title</label><Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} aria-label="SEO title" /></div>
        <div><label className="text-sm text-gray-500">SEO Description</label><Input value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} aria-label="SEO description" /></div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-500">Images</label>
          <div className="border border-dashed rounded-lg p-8 text-center text-gray-400">Drop images here (placeholder)</div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onSave?.(form)}>Save Product</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  );
};

export const ProductManagement = ({ products = mockProducts }) => {
  const [tab, setTab] = useState("list");
  const [editing, setEditing] = useState(null);
  logVendorUIDiagnostics("component", { name: "ProductManagement", tab });

  const columns = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "ai_preview_type", label: "AI Preview Type" },
    { key: "status", label: "Status" },
  ];
  const rows = products.map((p) => ({ ...p, price: `$${p.price}` }));

  return (
    <div aria-label="Product management">
      <Tabs tabs={[{ id: "list", label: "All Products" }, { id: "create", label: "Create Product" }]} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === "list" && !editing && (
          <>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-500">{products.length} products</p>
              <Button size="sm" onClick={() => setTab("create")}>Create Product</Button>
            </div>
            {products.length ? (
              <DataTable columns={columns} rows={rows} />
            ) : (
              <EmptyState title="No products" action={<Button onClick={() => setTab("create")}>Create Product</Button>} />
            )}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" onClick={() => setEditing(products[0])}>Edit</Button>
              <Button size="sm" variant="ghost">Delete</Button>
            </div>
          </>
        )}
        {(tab === "create" || editing) && (
          <ProductForm product={editing} onSave={() => { setEditing(null); setTab("list"); }} onCancel={() => { setEditing(null); setTab("list"); }} />
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
