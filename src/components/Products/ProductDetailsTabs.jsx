import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import { AiOutlineMessage } from "react-icons/ai";
import { HiOutlineThumbUp } from "react-icons/hi";
import {
  MdVerified,
} from "react-icons/md";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";
import Ratings from "./Ratings";
import verified from "../verify/verified.png";

const TABS = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "seller", label: "Seller" },
];


const ProductDetailsTabs = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
  shopVerify,
  handleMessageSubmit,
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const [sortBy, setSortBy] = useState("recent");
  const [reviewPage, setReviewPage] = useState(1);
  const [helpful, setHelpful] = useState({});
  const perPage = 5;

  const reviews = data.reviews || [];
  const reviewCount = reviews.length;
  const showRating = reviewCount > 0 && (data.ratings || 0) > 0;

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || data.ratings || 0)));
      dist[star - 1]++;
    });
    return dist.reverse();
  }, [reviews, data.ratings]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "highest") copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "lowest") copy.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    return copy;
  }, [reviews, sortBy]);

  const paginatedReviews = sortedReviews.slice(
    (reviewPage - 1) * perPage,
    reviewPage * perPage
  );
  const totalPages = Math.ceil(sortedReviews.length / perPage) || 1;

  const toggleHelpful = (index) => {
    setHelpful((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const specRows = useMemo(() => {
    const rows = [];
    if (data.brand) rows.push({ label: "Brand", value: data.brand });
    if (data.category) rows.push({ label: "Category", value: data.category });
    if (data.subcategory) rows.push({ label: "Subcategory", value: data.subcategory });
    if (data.condition) rows.push({ label: "Condition", value: data.condition });
    if (data.location) rows.push({ label: "Location", value: data.location });
    if (data.productType) rows.push({ label: "Type", value: data.productType });
    if (data.stock != null) rows.push({ label: "Stock", value: String(data.stock) });
    return rows;
  }, [data]);

  return (
    <section className="pdp-section pdp-tabs">
      <div className="pdp-tabs__shell">
        <div className="pdp-tabs__nav" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pdp-tabs__tab${activeTab === tab.id ? " is-active" : ""}`}
            >
              {tab.label}
              {tab.id === "reviews" && reviewCount > 0 && (
                <span className="pdp-tabs__count">({reviewCount})</span>
              )}
            </button>
          ))}
        </div>

        <div className="pdp-tabs__body">
          {activeTab === "description" && (
            <div className="pdp-tabs__panel">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactQuill value={data.description} readOnly theme="bubble" />
              </div>
              {data.details && (
                <div className="pdp-tabs__details">
                  <h3 className={typography.subheading}>Details</h3>
                  <p>{data.details}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="pdp-fade-in">
              <h3 className={`${typography.subheading} mb-6`}>Specifications</h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map((row, i) => (
                      <tr
                        key={row.label}
                        className={i % 2 === 0 ? "bg-yebone-light-gray/40 dark:bg-gray-800/30" : ""}
                      >
                        <td className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 w-1/3">
                          {row.label}
                        </td>
                        <td className="px-5 py-3.5 dark:text-white">{row.value}</td>
                      </tr>
                    ))}
                    {data.details && (
                      <tr>
                        <td className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">
                          Details
                        </td>
                        <td className="px-5 py-3.5 dark:text-white">{data.details}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="pdp-fade-in">
              {showRating ? (
                <>
                  <div className="flex flex-col lg:flex-row gap-8 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-center lg:text-left">
                      <p className="font-Poppins text-5xl font-bold text-yebone-primary">
                        {data.ratings?.toFixed(1)}
                      </p>
                      <Ratings rating={data.ratings} size={20} />
                      <p className="text-sm text-gray-500 mt-2">{reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star, i) => {
                        const count = distribution[i];
                        const pct = reviewCount ? (count / reviewCount) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3 text-sm">
                            <span className="w-8 text-gray-500">{star}★</span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-yebone-gold transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-gray-400 text-xs">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h3 className={`${typography.subheading}`}>Customer Reviews</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setReviewPage(1);
                      }}
                      className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 bg-white dark:bg-gray-900"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {paginatedReviews.map((item, index) => {
                      const globalIndex = (reviewPage - 1) * perPage + index;
                      return (
                        <div
                          key={globalIndex}
                          className="pdp-card-lift p-5 rounded-2xl border border-gray-100 dark:border-gray-800 yebone-card-lift bg-white/80 dark:bg-gray-900/60"
                        >
                          <div className="flex gap-4">
                            <img
                              src={item.user?.avatar?.url}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-sm dark:text-white">
                                  {item.user?.name}
                                </span>
                                <Ratings rating={item.rating || data.ratings} size={14} />
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yebone-primary/10 text-yebone-primary font-semibold">
                                  Verified Purchase
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.comment}
                              </p>
                              <button
                                type="button"
                                onClick={() => toggleHelpful(globalIndex)}
                                className={`mt-3 flex items-center gap-1.5 text-xs font-medium transition ${
                                  helpful[globalIndex]
                                    ? "text-yebone-primary"
                                    : "text-gray-400 hover:text-yebone-primary"
                                }`}
                              >
                                <HiOutlineThumbUp size={14} />
                                Helpful
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={reviewPage <= 1}
                        onClick={() => setReviewPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center text-sm text-gray-500 px-4">
                        {reviewPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={reviewPage >= totalPages}
                        onClick={() => setReviewPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-yebone-light-gray dark:bg-gray-800 flex items-center justify-center mb-4">
                    <span className="text-2xl">★</span>
                  </div>
                  <h3 className="font-Poppins text-xl font-semibold dark:text-white mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                    Be the first to share your experience with this product on Yebone. Your review
                    helps other shoppers buy with confidence.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Seller */}
          {activeTab === "seller" && (
            <div className="pdp-fade-in">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={data.shop.avatar?.url}
                      alt=""
                      className="w-16 h-16 rounded-2xl border-2 border-gray-100 dark:border-gray-800 object-cover shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-Poppins text-xl font-semibold dark:text-white">
                          {data.shop.name}
                        </h3>
                        {shopVerify && (
                          <img src={verified} alt="Verified" className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {products?.length || 0} products · Joined{" "}
                        {data.shop.createdAt?.slice(0, 10) || "—"}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-yebone-primary/10 text-yebone-primary font-semibold">
                          <MdVerified size={14} /> Verified on Yebone
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {averageRating}/5 shop rating
                        </span>
                      </div>
                    </div>
                  </div>

                  {data.shop.description && (
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                      <ReactQuill value={data.shop.description} readOnly theme="bubble" />
                    </div>
                  )}

                  {data.shop.paymentInfo && (
                    <p className="text-sm text-gray-500 mb-4">
                      <span className="font-semibold">Payment:</span> {data.shop.paymentInfo}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link to={`/shop/preview/${data.shop._id}`}>
                      <Button size="md" className="pdp-btn-lift">Visit Store</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="md"
                      className="pdp-btn-lift gap-2"
                      onClick={handleMessageSubmit}
                    >
                      <AiOutlineMessage size={18} />
                      Contact Seller
                    </Button>
                  </div>
                </div>

                <div className="lg:w-64 space-y-4">
                  {[
                    { label: "Products", value: products?.length || 0 },
                    { label: "Total Reviews", value: totalReviewsLength || 0 },
                    { label: "Response", value: "Typically within 24h" },
                    { label: "Member Since", value: data.shop.createdAt?.slice(0, 10) || "—" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-2xl bg-yebone-light-gray/60 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                    >
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="font-Poppins font-semibold text-lg dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsTabs;
