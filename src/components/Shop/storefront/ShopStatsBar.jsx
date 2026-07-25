import React, { useMemo } from "react";
import { formatCompactNumber, deriveProductViews } from "../../../utils/shopStorefrontUtils";

const ShopStatsBar = ({ stats, shop, products = [] }) => {
  const productViews = useMemo(() => deriveProductViews(products), [products]);

  const items = [
    {
      label: "Followers",
      value: formatCompactNumber(shop?.followerCount ?? 0),
    },
    {
      label: "Favorites",
      value: formatCompactNumber(shop?.favoriteCount ?? 0),
    },
    {
      label: "Views",
      value: formatCompactNumber(productViews),
    },
    {
      label: "Products",
      value: formatCompactNumber(stats?.productCount ?? 0),
    },
    {
      label: "Rating",
      value: stats?.averageRating > 0 ? `${stats.averageRating.toFixed(1)}★` : "—",
    },
  ];

  return (
    <section className="shop-social-stats" aria-label="Shop highlights">
      {items.map(({ label, value }) => (
        <article key={label} className="shop-social-stat">
          <span className="shop-social-stat__value">{value}</span>
          <span className="shop-social-stat__label">{label}</span>
        </article>
      ))}
    </section>
  );
};

export default ShopStatsBar;
