import React, { useState } from "react";
import { Card, Badge, Button, Tabs, Progress } from "../../../design-system/components";
import { AIPreviewCard, AIRecommendationCard } from "../../../design-system/ai";
import { SectionHeader, PremiumCard, PolishedEmptyState } from "../../../ui-polish";
import { AI_POWERED_BY, MARKETPLACE_NAME } from "../../../ui-polish/brandConstants";
import { useCustomerExperience } from "../../hooks/useCustomerExperience";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const ProductGallery = ({ images = [], active = 0, onSelect }) => (
  <div aria-label="Product gallery" className="space-y-4">
    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center text-7xl border border-gray-200/80 dark:border-gray-700/80 shadow-yebo">
      🛍️
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {(images.length ? images : [0, 1, 2, 3]).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          className={`w-16 h-16 shrink-0 rounded-xl border-2 flex items-center justify-center text-xl transition-colors ${
            active === i ? "border-yebone-primary bg-yebone-primary/5" : "border-gray-200 dark:border-gray-700"
          }`}
          aria-label={`View image ${i + 1}`}
          aria-current={active === i}
        >
          🖼️
        </button>
      ))}
    </div>
  </div>
);

export const PurchasePanel = ({ product, onAddCart }) => {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <PremiumCard className="lg:sticky lg:top-24 space-y-4">
      <div className="flex flex-wrap gap-2">
        {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
        <Badge variant={product.inStock ? "success" : "error"}>{product.inStock ? "In Stock" : "Out of Stock"}</Badge>
        <Badge variant="default">Free returns</Badge>
      </div>
      <h1 className="text-2xl md:text-3xl font-Poppins font-bold">{product.name}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span aria-label={`Rating ${product.rating} out of 5`}>⭐ {product.rating}</span>
        <span>·</span>
        <span>{product.reviews || 0} reviews</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-yebone-primary">${product.price}</span>
        {product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>}
      </div>
      <p className="text-sm text-green-600 dark:text-green-400">Delivery estimate: 3–5 business days</p>
      <ProductVariants variants={product.variants} />
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button className="flex-1" onClick={onAddCart} disabled={!product.inStock}>Add to Cart</Button>
        <Button variant="secondary" className="flex-1">Buy Now</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">♡ Wishlist</Button>
        <Button variant="ghost" size="sm">⇄ Compare</Button>
        <Button variant="ghost" size="sm">Share</Button>
      </div>
    </PremiumCard>
  );
};

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

export const VendorInfo = ({ vendor, rating = 4.8 }) => (
  <Card aria-label="Vendor information">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-yebone-primary/10 flex items-center justify-center font-bold text-yebone-primary">{vendor?.[0] || "V"}</div>
        <div>
          <p className="font-semibold">{vendor}</p>
          <p className="text-xs text-gray-500">⭐ {rating} store rating · Verified Vendor</p>
        </div>
      </div>
      <Button size="sm" variant="ghost">Visit Store</Button>
    </div>
  </Card>
);

export const ProductQASection = () => (
  <section aria-label="Questions and answers" className="mt-6">
    <SectionHeader title="Questions & Answers" subtitle="Ask the vendor" action={<Button size="sm" variant="secondary">Ask a question</Button>} />
    <PolishedEmptyState preset="noResults" title="No questions yet" description="Be the first to ask about this product." />
  </section>
);

export const AIPreviewSection = ({ productId, userId = "demo-user" }) => {
  logCustomerUIDiagnostics("component", { name: "AIPreviewSection", productId });
  const { getPreviewSessions } = useCustomerExperience(userId);
  const sessions = getPreviewSessions()?.previewSessions || [];

  return (
    <PremiumCard accent aria-label="Preview with AI" className="yebone-surface">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-Poppins font-semibold text-lg">Preview with AI</h3>
          <p className="text-xs text-gray-500 mt-1">{AI_POWERED_BY}</p>
        </div>
        <Badge variant="warning">✨ AI</Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Visualize how this product looks on you before purchasing — exclusive to {MARKETPLACE_NAME}.
      </p>
      <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border flex items-center justify-center mb-4">
        {sessions.length ? (
          <div className="w-full max-w-xs px-4">
            <Progress value={65} />
            <p className="text-xs text-center mt-2 text-gray-500">Generating preview…</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No preview yet</p>
        )}
      </div>
      <Button className="w-full sm:w-auto">Preview with AI</Button>
      {sessions.slice(0, 2).map((s) => (
        <div key={s.sessionId} className="mt-3"><AIPreviewCard previewType={s.ai_preview_type} status={s.status} /></div>
      ))}
      <AIRecommendationCard message="AI recommends pairing this with complementary accessories." />
    </PremiumCard>
  );
};

export const ProductReviews = ({ reviews = [] }) => (
  <section aria-label="Product reviews">
    <SectionHeader title={`Reviews (${reviews.length})`} action={<Button size="sm" variant="ghost">Write a review</Button>} />
    <div className="space-y-3">
      {reviews.map((r) => (
        <Card key={r.id}>
          <div className="flex justify-between items-start">
            <p className="font-semibold">{r.author}</p>
            <span aria-label={`${r.rating} stars`}>⭐ {r.rating}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{r.text}</p>
          <p className="text-xs text-gray-400 mt-2">{r.date}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const RelatedProducts = ({ products = [], title = "Related Products" }) => (
  <section aria-label={title} className="mt-10">
    <SectionHeader title={title} />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="yebone-card-lift !p-4 cursor-pointer">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 flex items-center justify-center text-2xl">🛍️</div>
          <p className="text-sm font-semibold truncate">{p.name}</p>
          <p className="text-yebone-primary font-bold mt-1">${p.price}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const ProductDetailsView = ({ product, relatedProducts = [] }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-8 yebone-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery active={activeImage} onSelect={setActiveImage} />
        <PurchasePanel product={product} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VendorInfo vendor={product.vendor} />
          <AIPreviewSection productId={product.id} />
          <Tabs tabs={[
            { id: "description", label: "Description" },
            { id: "specs", label: "Specifications" },
            { id: "reviews", label: "Reviews" },
            { id: "shipping", label: "Shipping & Returns" },
          ]} active={activeTab} onChange={setActiveTab} />
          <div className="mt-4">
            {activeTab === "description" && (
              <Card><p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p></Card>
            )}
            {activeTab === "specs" && (
              <Card>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.specifications || {}).map(([k, v]) => (
                    <React.Fragment key={k}><dt className="text-gray-500 font-medium">{k}</dt><dd>{v}</dd></React.Fragment>
                  ))}
                </dl>
              </Card>
            )}
            {activeTab === "reviews" && <ProductReviews reviews={product.reviews} />}
            {activeTab === "shipping" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card><h3 className="font-semibold mb-2">Shipping</h3><p className="text-sm text-gray-600">Standard: {product.shipping?.standard}</p><p className="text-sm text-gray-600">Express: {product.shipping?.express}</p></Card>
                <Card><h3 className="font-semibold mb-2">Returns</h3><p className="text-sm text-gray-600">{product.returnPolicy}</p></Card>
              </div>
            )}
          </div>
          <ProductQASection />
        </div>
        <Card aria-label="Purchase confidence">
          <h3 className="font-semibold mb-4">Why shop on {MARKETPLACE_NAME}</h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li>🛡️ Buyer protection on every order</li>
            <li>✅ Verified vendor badge</li>
            <li>✨ {AI_POWERED_BY}</li>
            <li>🚚 Fast nationwide delivery</li>
          </ul>
        </Card>
      </div>

      <RelatedProducts products={relatedProducts} title="You may also like" />
      <RelatedProducts products={relatedProducts} title="Recently viewed" />
    </div>
  );
};

export default ProductDetailsView;
