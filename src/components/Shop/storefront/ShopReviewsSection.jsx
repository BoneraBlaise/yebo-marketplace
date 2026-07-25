import React, { useMemo, useState } from "react";
import Ratings from "../../Products/Ratings";
import ShopEmptyState from "./ShopEmptyState";
import { aggregateReviews } from "../../../utils/shopStorefrontUtils";

const ShopReviewsSection = ({ products = [], stats }) => {
  const [helpful, setHelpful] = useState({});
  const reviews = useMemo(() => aggregateReviews(products), [products]);

  if (!reviews.length) {
    return (
      <ShopEmptyState
        icon="⭐"
        title="No reviews yet"
        description="Customer reviews will appear here after verified purchases."
      />
    );
  }

  const maxCount = Math.max(...(stats?.ratingDistribution?.map((d) => d.count) || [1]), 1);

  return (
    <section aria-label="Customer reviews" className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="shop-about-card">
          <h3 className="text-2xl font-bold mb-1">{stats?.averageRating?.toFixed(1) || "—"}</h3>
          <Ratings rating={stats?.averageRating || 0} />
          <p className="text-sm text-gray-500 mt-2">{stats?.totalReviews || 0} total reviews</p>
        </div>

        <div className="shop-reviews__distribution">
          {(stats?.ratingDistribution || []).map(({ star, count }) => (
            <div key={star} className="shop-reviews__bar-row">
              <span>{star}★</span>
              <div className="shop-reviews__bar" aria-hidden="true">
                <div
                  className="shop-reviews__bar-fill"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, 12).map((review, index) => (
          <article key={`${review._id || index}-${review.createdAt}`} className="shop-review-card">
            <div className="flex gap-3">
              <img
                src={review.user?.avatar?.url || "https://via.placeholder.com/48"}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
                width={40}
                height={40}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm">{review.user?.name || "Customer"}</span>
                  <Ratings rating={review.rating} />
                  {review.productName && (
                    <span className="text-xs text-gray-500">· {review.productName}</span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Verified Purchase
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>
                )}
                <button
                  type="button"
                  className="text-xs text-gray-500 mt-2 hover:text-[var(--shop-accent)]"
                  onClick={() => setHelpful((h) => ({ ...h, [index]: !h[index] }))}
                >
                  {helpful[index] ? "✓ Helpful" : "Helpful?"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ShopReviewsSection;
