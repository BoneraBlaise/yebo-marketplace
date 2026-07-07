import React from "react";
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
  <EmptyState title="Your wishlist is empty" description="Save items you love for later." action={<Button>Browse Products</Button>} />
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
