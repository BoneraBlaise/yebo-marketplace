import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, EmptyState } from "../../../design-system/components";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const WishlistItem = ({ item, onMoveToCart, onRemove }) => (
  <Card className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">🛍️</div>
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-yebone-primary font-bold">${item.price}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button size="sm" onClick={() => onMoveToCart?.(item)}>Move to Cart</Button>
      <Button size="sm" variant="ghost" onClick={() => onRemove?.(item)} aria-label={`Remove ${item.name} from wishlist`}>Remove</Button>
    </div>
  </Card>
);

export const WishlistEmpty = () => (
  <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900/50 text-center">
    <span className="text-4xl mb-4 block" aria-hidden="true">💝</span>
    <EmptyState
      title="Your wishlist is empty"
      description="Save items you love and come back to them anytime."
      action={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/products">
            <Button className="min-h-[44px]">Browse products</Button>
          </Link>
          <Link to="/best-selling">
            <Button variant="outline" className="min-h-[44px]">View best sellers</Button>
          </Link>
        </div>
      }
    />
  </div>
);

export const WishlistView = ({ items = [], onMoveToCart, onRemove }) => {
  logCustomerUIDiagnostics("component", { name: "WishlistView", count: items.length });
  if (!items.length) return <WishlistEmpty />;
  return (
    <section aria-label="Wishlist" className="space-y-3">
      {items.map((item) => (
        <WishlistItem key={item.id} item={item} onMoveToCart={onMoveToCart} onRemove={onRemove} />
      ))}
    </section>
  );
};

export default WishlistView;
