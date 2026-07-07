import React, { useState } from "react";
import { Card, Button, Input, Badge } from "../../../design-system/components";
import { SectionHeader, PolishedEmptyState, PremiumCard } from "../../../ui-polish";
import { MARKETPLACE_NAME } from "../../../ui-polish/brandConstants";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const CartItem = ({ item, onQuantityChange, onRemove }) => (
  <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4 yebone-card-lift">
    <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center shrink-0 text-3xl">🛍️</div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold truncate">{item.name}</p>
      <p className="text-yebone-primary font-bold text-lg mt-1">${item.price}</p>
      <Badge variant="success" className="mt-2">In stock</Badge>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost" onClick={() => onQuantityChange?.(item, Math.max(1, item.quantity - 1))} aria-label="Decrease quantity">−</Button>
      <span className="w-8 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
      <Button size="sm" variant="ghost" onClick={() => onQuantityChange?.(item, item.quantity + 1)} aria-label="Increase quantity">+</Button>
    </div>
    <Button size="sm" variant="ghost" onClick={() => onRemove?.(item)} aria-label={`Remove ${item.name}`}>Remove</Button>
  </Card>
);

export const CouponArea = ({ onApply }) => {
  const [code, setCode] = useState("");
  return (
    <Card aria-label="Coupon code">
      <p className="text-sm font-semibold mb-2">Have a coupon?</p>
      <div className="flex gap-2">
        <Input placeholder="Enter coupon code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" />
        <Button variant="secondary" onClick={() => onApply?.(code)}>Apply</Button>
      </div>
    </Card>
  );
};

export const ShippingSummary = ({ subtotal = 0, threshold = 50 }) => (
  <Card aria-label="Shipping summary">
    <p className="text-sm font-semibold mb-1">Shipping</p>
    <p className="text-sm text-gray-600 dark:text-gray-400">{subtotal >= threshold ? "🎉 Free shipping unlocked!" : `Add $${(threshold - subtotal).toFixed(2)} for free shipping`}</p>
  </Card>
);

export const OrderSummary = ({ items = [] }) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  return (
    <PremiumCard aria-label="Order summary" className="lg:sticky lg:top-24">
      <h3 className="font-Poppins font-semibold text-lg mb-4">Order Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Tax (est.)</dt><dd>${tax.toFixed(2)}</dd></div>
        <div className="flex justify-between font-bold text-base border-t border-gray-200 dark:border-gray-700 pt-3 mt-2"><dt>Total</dt><dd className="text-yebone-primary">${total.toFixed(2)}</dd></div>
      </dl>
      <Button className="w-full mt-4 yebone-btn-lift">Proceed to Checkout</Button>
      <p className="text-xs text-gray-500 text-center mt-3">Secure checkout on {MARKETPLACE_NAME}</p>
    </PremiumCard>
  );
};

export const CartRecommendations = ({ products = [] }) => (
  <section aria-label="Cart recommendations" className="mt-6">
    <SectionHeader title="You might also like" subtitle="Complete your order" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.slice(0, 4).map((p) => (
        <Card key={p.id} className="!p-3 text-center yebone-card-lift cursor-pointer">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center">🛍️</div>
          <p className="text-xs font-medium truncate">{p.name}</p>
          <p className="text-yebone-primary font-bold text-sm">${p.price}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const CartView = ({ items = [], recommendations = [], onQuantityChange, onRemove }) => {
  logCustomerUIDiagnostics("component", { name: "CartView", count: items.length });
  if (!items.length) {
    return (
      <PolishedEmptyState preset="noProducts" title="Your cart is empty" description={`Discover amazing products on ${MARKETPLACE_NAME}.`} action={<Button>Browse Products</Button>} />
    );
  }
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <div>
      <SectionHeader title="Shopping Cart" subtitle={`${items.length} item${items.length !== 1 ? "s" : ""} in your cart`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3" aria-label="Cart items">
          {items.map((item) => <CartItem key={item.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />)}
          <CouponArea />
        </div>
        <div className="space-y-4">
          <ShippingSummary subtotal={subtotal} />
          <OrderSummary items={items} />
        </div>
      </div>
      {recommendations.length > 0 && <CartRecommendations products={recommendations} />}
    </div>
  );
};

export default CartView;
