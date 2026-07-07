/** Placeholder vendor UI data — no business logic — Phase 8H.3 */

export const mockVendorStats = {
  revenue: 12450.00,
  orders: 342,
  products: 89,
  customers: 156,
};

export const mockProducts = [
  { id: "vp-1", name: "Wireless Headphones", sku: "WH-001", price: 79.99, stock: 45, ai_preview_type: "body_tryon", status: "active" },
  { id: "vp-2", name: "Smart Watch", sku: "SW-002", price: 199.99, stock: 12, ai_preview_type: "wrist_tryon", status: "active" },
  { id: "vp-3", name: "Wall Art Canvas", sku: "WA-003", price: 49.99, stock: 30, ai_preview_type: "wall_preview", status: "draft" },
  { id: "vp-4", name: "Floor Rug", sku: "FR-004", price: 129.99, stock: 8, ai_preview_type: "floor_preview", status: "active" },
];

export const mockOrders = [
  { id: "VO-1001", customer: "Jane Doe", status: "pending", total: 79.99, date: "2026-07-07" },
  { id: "VO-1002", customer: "John Smith", status: "confirmed", total: 199.99, date: "2026-07-06" },
  { id: "VO-1003", customer: "Alex Lee", status: "processing", total: 49.99, date: "2026-07-06" },
  { id: "VO-1004", customer: "Sam Wilson", status: "shipping", total: 129.99, date: "2026-07-05" },
  { id: "VO-1005", customer: "Chris Brown", status: "delivered", total: 89.99, date: "2026-07-01" },
  { id: "VO-1006", customer: "Pat Taylor", status: "cancelled", total: 59.99, date: "2026-06-28" },
  { id: "VO-1007", customer: "Jordan Kim", status: "returned", total: 149.99, date: "2026-06-25" },
  { id: "VO-1008", customer: "Morgan Fox", status: "refund_requested", total: 39.99, date: "2026-07-04" },
];

export const mockCustomers = [
  { id: "vc-1", name: "Jane Doe", email: "jane@example.com", orders: 12, totalSpent: 1240.00, repeat: true },
  { id: "vc-2", name: "John Smith", email: "john@example.com", orders: 8, totalSpent: 890.00, repeat: true },
  { id: "vc-3", name: "Alex Lee", email: "alex@example.com", orders: 1, totalSpent: 49.99, repeat: false },
];

export const mockFinance = {
  revenue: 12450.00, commission: 1245.00, payouts: 11205.00,
  statements: [{ id: "st-1", period: "June 2026", amount: 4200.00 }, { id: "st-2", period: "May 2026", amount: 3800.00 }],
  refunds: [{ id: "rf-1", orderId: "VO-1008", amount: 39.99, status: "pending" }],
};

export const mockShipping = {
  partners: [{ id: "sp-1", name: "FastShip", active: true }, { id: "sp-2", name: "EcoDelivery", active: true }],
  rates: [{ id: "sr-1", zone: "Local", rate: 5.99 }, { id: "sr-2", zone: "National", rate: 12.99 }],
  zones: [{ id: "sz-1", name: "Western Cape" }, { id: "sz-2", name: "Gauteng" }],
};

export const mockMarketing = {
  coupons: [{ id: "cp-1", code: "SUMMER20", discount: "20%", active: true }],
  discounts: [{ id: "dc-1", name: "Bulk Discount", value: "10%" }],
  promotions: [{ id: "pr-1", title: "Summer Sale", status: "active" }],
  flashSales: [{ id: "fs-1", name: "Weekend Flash", ends: "2026-07-08" }],
  featured: [{ id: "vp-1", name: "Wireless Headphones" }],
};

export const mockAffiliate = {
  links: [{ id: "al-1", url: "https://yebo.shop/ref/abc", clicks: 245 }],
  referrals: [{ id: "rl-1", code: "REF-JANE", signups: 12 }],
  couponCodes: [{ id: "ac-1", code: "AFF15", commission: "15%" }],
  sales: 34, commissionTotal: 510.00,
  topAffiliates: [{ id: "ta-1", name: "Influencer A", sales: 18, commission: 270.00 }],
};

export default {
  mockVendorStats, mockProducts, mockOrders, mockCustomers,
  mockFinance, mockShipping, mockMarketing, mockAffiliate,
};
