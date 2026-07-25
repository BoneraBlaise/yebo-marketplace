import React from "react";

const STAT_ITEMS = [
  { key: "averageRating", icon: "⭐", label: "Avg Rating", format: (v) => (v ? v.toFixed(1) : "—") },
  { key: "productCount", icon: "📦", label: "Products" },
  { key: "favoriteCount", icon: "❤️", label: "Favorites", fromShop: true },
  { key: "followerCount", icon: "👥", label: "Followers", fromShop: true },
  { key: "totalOrders", icon: "🛒", label: "Total Orders" },
  { key: "completedOrders", icon: "✔", label: "Completed" },
  { key: "deliverySuccess", icon: "🚚", label: "Delivery Success", format: (v) => (v != null ? `${v}%` : "—") },
  { key: "joined", icon: "🗓", label: "Joined Since", fromShop: true, field: "createdAt", format: (v) =>
    v ? new Date(v).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "—" },
];

const ShopStatsBar = ({ stats, shop }) => (
  <section className="shop-stats" aria-label="Shop statistics">
    {STAT_ITEMS.map(({ key, icon, label, format, fromShop, field }) => {
      let value = fromShop ? shop?.[field || key] : stats?.[key];
      if (format) value = format(value);
      else if (value == null) value = "—";
      return (
        <article key={key} className="shop-stat-card">
          <span className="shop-stat-card__icon" aria-hidden="true">{icon}</span>
          <span className="shop-stat-card__value">{value}</span>
          <span className="shop-stat-card__label">{label}</span>
        </article>
      );
    })}
  </section>
);

export default ShopStatsBar;
