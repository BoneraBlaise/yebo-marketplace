import React, { useMemo } from "react";
import { HiOutlineStar } from "react-icons/hi";
import DashboardEmptyState from "../DashboardEmptyState";

const VendorReviewsPanel = ({ products = [] }) => {
  const reviews = useMemo(() => {
    if (!products?.length) return [];
    return products
      .flatMap((product) =>
        (product.reviews || []).map((review) => ({
          ...review,
          productName: product.name,
          productId: product._id,
        }))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [products]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <section id="vendor-reviews" className="space-y-4 scroll-mt-24 yebone-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-Poppins text-xl font-semibold dark:text-white">Reviews</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customer feedback on your products</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl yebone-surface">
          <HiOutlineStar className="text-yebone-accent" size={20} />
          <span className="font-semibold dark:text-white">{avgRating}</span>
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <DashboardEmptyState
          icon={HiOutlineStar}
          title="No reviews yet"
          message="Reviews from customers will appear here once products receive feedback."
        />
      ) : (
        <div className="space-y-3">
          {reviews.slice(0, 8).map((review, index) => (
            <div key={review._id || index} className="vendor-review-card dashboard-section yebone-surface">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        size={16}
                        className={i < (review.rating || 0) ? "text-yebone-accent fill-yebone-accent" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="font-medium dark:text-white">{review.user?.name || "Customer"}</p>
                  <p className="text-sm text-gray-500">{review.productName}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{review.comment}</p>
              )}
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" className="text-xs font-medium text-yebone-primary hover:underline">
                  Reply
                </button>
                <span className="text-xs text-gray-400">
                  {review.helpful || 0} found helpful
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default VendorReviewsPanel;
