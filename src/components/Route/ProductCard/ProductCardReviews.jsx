import React from "react";

const ProductCardReviews = ({ rating = 0, reviewCount = 0 }) => {
  const showRating = reviewCount > 0 && rating > 0;

  if (!showRating) {
    return <p className="ypc__reviews-empty">No reviews yet</p>;
  }

  const rounded = Math.round(rating);

  return (
    <div
      className="ypc__reviews"
      aria-label={`${rating} out of 5 stars, ${reviewCount} reviews`}
    >
      <span className="ypc__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`ypc__star ${
              i <= rounded ? "ypc__star--filled" : "ypc__star--empty"
            }`}
          >
            ★
          </span>
        ))}
      </span>
      <span className="ypc__review-count">({reviewCount})</span>
    </div>
  );
};

export default ProductCardReviews;
