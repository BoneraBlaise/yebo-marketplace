import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { ProductDetailsView } from "../components/product-details/ProductDetailsView";
import { mockProductDetail, mockProducts } from "../data/mockCustomerData";

export const CustomerProductDetailsPage = () => (
  <CustomerPageShell pageName="product-details" activeNavId="products" title="Product Details" breadcrumbs={[{ label: "Products" }, { label: mockProductDetail.name }]}>
    <ProductDetailsView product={mockProductDetail} relatedProducts={mockProducts} />
  </CustomerPageShell>
);

export default CustomerProductDetailsPage;
