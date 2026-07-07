import React from "react";
import { Card, Badge, Button, Tabs } from "../../../design-system/components";
import { AIPreviewCard, AIRecommendationCard } from "../../../design-system/ai";
import { useCustomerExperience } from "../../hooks/useCustomerExperience";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const ProductGallery = ({ images = [] }) => (
  <div aria-label="Product gallery" className="space-y-3">
    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-6xl">🛍️</div>
    {images.length > 1 && (
      <div className="flex gap-2">{images.map((_, i) => (
        <button key={i} type="button" className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800" aria-label={`View image ${i + 1}`} />
      ))}</div>
    )}
  </div>
);

export const ProductInfo = ({ product }) => (
  <div>
    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
    <div className="flex items-baseline gap-2 mb-4">
      <span className="text-2xl font-bold text-yebone-primary">${product.price}</span>
      {product.originalPrice && <span className="text-gray-400 line-through">${product.originalPrice}</span>}
    </div>
    <Badge variant={product.inStock ? "success" : "error"}>{product.inStock ? "In Stock" : "Out of Stock"}</Badge>
    <p className="mt-4 text-gray-600">{product.description}</p>
  </div>
);

export const VendorInfo = ({ vendor }) => (
  <Card aria-label="Vendor information">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-yebone-primary/10 flex items-center justify-center font-bold">{vendor?.[0] || "V"}</div>
      <div>
        <p className="font-medium">{vendor}</p>
        <p className="text-xs text-gray-500">Verified Vendor</p>
      </div>
    </div>
  </Card>
);

export const ProductVariants = ({ variants = [] }) => (
  <div aria-label="Product variants">
    <p className="text-sm font-medium mb-2">Select Variant</p>
    <div className="flex gap-2 flex-wrap">
      {variants.map((v) => (
        <Button key={v.id} size="sm" variant={v.available ? "secondary" : "ghost"} disabled={!v.available}>{v.name}</Button>
      ))}
    </div>
  </div>
);

export const ShippingInfo = ({ shipping }) => (
  <Card aria-label="Shipping information">
    <h3 className="font-medium mb-2">Shipping</h3>
    <ul className="text-sm space-y-1 text-gray-600">
      <li>Standard: {shipping?.standard}</li>
      <li>Express: {shipping?.express}</li>
      <li>Free shipping on orders over ${shipping?.freeThreshold}</li>
    </ul>
  </Card>
);

export const ReturnPolicy = ({ policy }) => (
  <Card aria-label="Return policy"><h3 className="font-medium mb-1">Returns</h3><p className="text-sm text-gray-600">{policy}</p></Card>
);

export const ProductReviews = ({ reviews = [] }) => (
  <section aria-label="Product reviews">
    <h3 className="font-semibold mb-4">Reviews ({reviews.length})</h3>
    <div className="space-y-3">
      {reviews.map((r) => (
        <Card key={r.id}>
          <div className="flex justify-between"><p className="font-medium">{r.author}</p><span>⭐ {r.rating}</span></div>
          <p className="text-sm text-gray-600 mt-1">{r.text}</p>
          <p className="text-xs text-gray-400 mt-1">{r.date}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const RelatedProducts = ({ products = [] }) => (
  <section aria-label="Related products" className="mt-8">
    <h3 className="font-semibold mb-4">Related Products</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="text-center"><p className="text-sm truncate">{p.name}</p><p className="text-yebone-primary font-bold">${p.price}</p></Card>
      ))}
    </div>
  </section>
);

export const RecommendedProducts = ({ products = [] }) => (
  <section aria-label="Recommended products" className="mt-8">
    <h3 className="font-semibold mb-4">Recommended for You</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="text-center"><p className="text-sm truncate">{p.name}</p><p className="text-yebone-primary font-bold">${p.price}</p></Card>
      ))}
    </div>
  </section>
);

export const AIPreviewPlaceholder = ({ productId, userId = "demo-user" }) => {
  logCustomerUIDiagnostics("component", { name: "AIPreviewPlaceholder", productId });
  const { getPreviewSessions } = useCustomerExperience(userId);
  const sessions = getPreviewSessions()?.previewSessions || [];

  return (
    <Card className="border-l-4 border-yebone-accent" aria-label="Preview with AI">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold">Preview with AI</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Visualize this product with AI-powered preview (placeholder — no generation).</p>
      {sessions.length > 0 ? (
        sessions.slice(0, 2).map((s) => <AIPreviewCard key={s.sessionId} previewType={s.ai_preview_type} status={s.status} />)
      ) : (
        <Button variant="secondary" size="sm">Start AI Preview</Button>
      )}
      <AIRecommendationCard message="AI recommendations will appear here based on your preferences." />
    </Card>
  );
};

export const ProductDetailsView = ({ product, relatedProducts = [] }) => {
  const [activeTab, setActiveTab] = React.useState("details");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProductGallery />
      <div className="space-y-4">
        <ProductInfo product={product} />
        <VendorInfo vendor={product.vendor} />
        <ProductVariants variants={product.variants} />
        <div className="flex gap-2">
          <Button>Add to Cart</Button>
          <Button variant="secondary">Add to Wishlist</Button>
        </div>
        <AIPreviewPlaceholder productId={product.id} />
      </div>
      <div className="lg:col-span-2">
        <Tabs tabs={[{ id: "details", label: "Details" }, { id: "reviews", label: "Reviews" }, { id: "shipping", label: "Shipping & Returns" }]} active={activeTab} onChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === "details" && (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(product.specifications || {}).map(([k, v]) => (
                <React.Fragment key={k}><dt className="text-gray-500">{k}</dt><dd>{v}</dd></React.Fragment>
              ))}
            </dl>
          )}
          {activeTab === "reviews" && <ProductReviews reviews={product.reviews} />}
          {activeTab === "shipping" && (
            <div className="grid md:grid-cols-2 gap-4">
              <ShippingInfo shipping={product.shipping} />
              <ReturnPolicy policy={product.returnPolicy} />
            </div>
          )}
        </div>
        <RelatedProducts products={relatedProducts} />
        <RecommendedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetailsView;
