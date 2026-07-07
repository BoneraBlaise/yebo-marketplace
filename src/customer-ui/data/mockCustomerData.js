/** Placeholder UI data — no business logic — Phase 8H.2 */

export const mockCategories = [
  { id: "cat-1", name: "Electronics", image: null, count: 128 },
  { id: "cat-2", name: "Fashion", image: null, count: 256 },
  { id: "cat-3", name: "Home & Garden", image: null, count: 89 },
  { id: "cat-4", name: "Sports", image: null, count: 64 },
  { id: "cat-5", name: "Beauty", image: null, count: 112 },
  { id: "cat-6", name: "Books", image: null, count: 45 },
];

export const mockProducts = [
  { id: "p-1", name: "Wireless Headphones", price: 79.99, originalPrice: 99.99, rating: 4.5, reviews: 128, category: "Electronics", vendor: "TechHub", inStock: true, image: null },
  { id: "p-2", name: "Smart Watch Pro", price: 199.99, originalPrice: 249.99, rating: 4.8, reviews: 256, category: "Electronics", vendor: "TechHub", inStock: true, image: null },
  { id: "p-3", name: "Organic Cotton T-Shirt", price: 29.99, originalPrice: 39.99, rating: 4.2, reviews: 89, category: "Fashion", vendor: "StyleCo", inStock: true, image: null },
  { id: "p-4", name: "Ceramic Plant Pot", price: 24.99, originalPrice: null, rating: 4.6, reviews: 45, category: "Home & Garden", vendor: "GreenLiving", inStock: true, image: null },
  { id: "p-5", name: "Running Shoes", price: 89.99, originalPrice: 119.99, rating: 4.7, reviews: 312, category: "Sports", vendor: "FitGear", inStock: false, image: null },
  { id: "p-6", name: "Skincare Set", price: 49.99, originalPrice: 59.99, rating: 4.4, reviews: 167, category: "Beauty", vendor: "GlowUp", inStock: true, image: null },
];

export const mockVendors = [
  { id: "v-1", name: "TechHub", rating: 4.8, products: 156, verified: true },
  { id: "v-2", name: "StyleCo", rating: 4.5, products: 89, verified: true },
  { id: "v-3", name: "GreenLiving", rating: 4.6, products: 45, verified: false },
];

export const mockPromotions = [
  { id: "promo-1", title: "Summer Sale", description: "Up to 40% off selected items", badge: "Hot" },
  { id: "promo-2", title: "Free Shipping", description: "On orders over $50", badge: "New" },
];

export const mockProductDetail = {
  ...mockProducts[0],
  description: "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
  variants: [{ id: "var-1", name: "Black", available: true }, { id: "var-2", name: "White", available: true }],
  shipping: { standard: "3-5 business days", express: "1-2 business days", freeThreshold: 50 },
  returnPolicy: "30-day hassle-free returns",
  specifications: { brand: "TechHub", model: "WH-200", weight: "250g", connectivity: "Bluetooth 5.0" },
  reviews: [
    { id: "r-1", author: "Alex M.", rating: 5, text: "Excellent sound quality!", date: "2026-06-01" },
    { id: "r-2", author: "Jordan K.", rating: 4, text: "Great value for money.", date: "2026-05-15" },
  ],
};

export const mockCartItems = [
  { id: "c-1", productId: "p-1", name: "Wireless Headphones", price: 79.99, quantity: 1, image: null },
  { id: "c-2", productId: "p-3", name: "Organic Cotton T-Shirt", price: 29.99, quantity: 2, image: null },
];

export const mockOrders = [
  { id: "ord-1", date: "2026-06-28", status: "delivered", total: 109.98, items: 2 },
  { id: "ord-2", date: "2026-07-02", status: "shipped", total: 199.99, items: 1 },
  { id: "ord-3", date: "2026-07-05", status: "processing", total: 49.99, items: 1 },
];

export const mockOrderDetail = {
  ...mockOrders[1],
  timeline: [
    { id: "t-1", status: "Order Placed", date: "2026-07-02", completed: true },
    { id: "t-2", status: "Processing", date: "2026-07-02", completed: true },
    { id: "t-3", status: "Shipped", date: "2026-07-03", completed: true },
    { id: "t-4", status: "Delivered", date: null, completed: false },
  ],
  shippingAddress: { name: "Jane Doe", line1: "123 Main St", city: "Cape Town", postal: "8001" },
  items: [{ name: "Smart Watch Pro", quantity: 1, price: 199.99 }],
};

export const mockAddresses = [
  { id: "addr-1", label: "Home", line1: "123 Main St", city: "Cape Town", postal: "8001", default: true },
  { id: "addr-2", label: "Work", line1: "456 Office Park", city: "Johannesburg", postal: "2000", default: false },
];

export const mockWishlist = [
  { id: "w-1", productId: "p-2", name: "Smart Watch Pro", price: 199.99 },
  { id: "w-2", productId: "p-4", name: "Ceramic Plant Pot", price: 24.99 },
];

export const mockCompareProducts = [mockProducts[0], mockProducts[1], mockProducts[4]];

export default {
  mockCategories, mockProducts, mockVendors, mockPromotions, mockProductDetail,
  mockCartItems, mockOrders, mockOrderDetail, mockAddresses, mockWishlist, mockCompareProducts,
};
