import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { WishlistView } from "../components/wishlist/WishlistView";
import { mockWishlist } from "../data/mockCustomerData";

export const CustomerWishlistPage = () => (
  <CustomerPageShell pageName="wishlist" activeNavId="profile" title="Wishlist" breadcrumbs={[{ label: "Wishlist" }]}>
    <WishlistView items={mockWishlist} />
  </CustomerPageShell>
);

export default CustomerWishlistPage;
