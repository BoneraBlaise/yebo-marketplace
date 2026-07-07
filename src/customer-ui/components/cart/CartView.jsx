import React, { useState } from "react";
import { Card, Button, Input, EmptyState } from "../../../design-system/components";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const CartItem = ({ item, onQuantityChange, onRemove }) => (
  <Card className="flex items-center gap-4">
    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">🛍️</div>
    <div className="flex-1 min-w-0">
      <p className="font-medium truncate">{item.name}</p>
      <p className="text-yebone-primary font-bold">${item.price}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost" onClick={() => onQuantityChange?.(item, Math.max(1, item.quantity - 1))} aria-label="Decrease quantity">−</Button>
      <span className="w-8 text-center" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
      <Button size="sm" variant="ghost" onClick={() => onQuantityChange?.(item, item.quantity + 1)} aria-label="Increase quantity">+</Button>
    </div>
    <Button size="sm" variant="ghost" onClick={() => onRemove?.(item)} aria-label={`Remove ${item.name}`}>Remove</Button>
  </Card>
);

export const CouponArea = ({ onApply }) => {
  const [code, setCode] = useState("");
  return (
    <Card aria-label="Coupon code">
      <p className="text-sm font-medium mb-2">Have a coupon?</p>
      <div className="flex gap-2">
        <Input placeholder="Enter coupon code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" />
        <Button variant="secondary" onClick={() => onApply?.(code)}>Apply</Button>
      </div>
    </Card>
  );
};

export const ShippingSummary = ({ subtotal = 0, threshold = 50 }) => (
  <Card aria-label="Shipping summary">
    <p className="text-sm font-medium mb-1">Shipping</p>
    <p className="text-sm text-gray-600">{subtotal >= threshold ? "Free shipping" : `Add $${(threshold - subtotal).toFixed(2)} for free shipping`}</p>
  </Card>
);

export const OrderSummary = ({ items = [] }) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  return (
    <Card aria-label="Order summary">
      <h3 className="font-semibold mb-4">Order Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
        <div className="flex justify-between font-bold text-base border-t pt-2"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
      </dl>
      <Button className="w-full mt-4">Proceed to Checkout</Button>
    </Card>
  );
};

export const CartView = ({ items = [], onQuantityChange, onRemove }) => {
  logCustomerUIDiagnostics("component", { name: "CartView", count: items.length });
  if (!items.length) return <EmptyState title="Your cart is empty" description="Add items to get started." action={<Button>Browse Products</Button>} />;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
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
  );
};

export default CartView;
