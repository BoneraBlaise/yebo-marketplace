import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import { AiOutlineMessage } from "react-icons/ai";
import { HiOutlineThumbUp, HiOutlineSparkles } from "react-icons/hi";
import {
  MdVerified,
  MdLocalShipping,
  MdReplay,
  MdOutlineDescription,
  MdOutlineInventory2,
  MdOutlineWash,
  MdOutlineGppGood,
} from "react-icons/md";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";
import Ratings from "./Ratings";
import verified from "../verify/verified.png";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "seller", label: "Seller" },
];

const ACCORDION_SECTIONS = [
  { key: "features", label: "Features", icon: MdOutlineDescription },
  { key: "materials", label: "Materials", icon: MdOutlineInventory2 },
  { key: "care", label: "Care Instructions", icon: MdOutlineWash },
  { key: "shipping", label: "Shipping", icon: MdLocalShipping },
  { key: "returns", label: "Returns", icon: MdReplay },
  { key: "warranty", label: "Warranty", icon: MdOutlineGppGood },
];

const ProductDetailsTabs = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
  shopVerify,
  handleMessageSubmit,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openAccordion, setOpenAccordion] = useState("features");
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

  const accordionContent = {
    features: data.details || "Product features will appear here when provided by the seller.",
    materials: "Material information provided by the seller on Yebone.",
    care: "Follow seller care instructions included with your purchase.",
    shipping: "Standard delivery across Africa — typically 3–7 business days depending on location.",
    returns: "Easy returns within the seller's return window. Contact the seller via Yebone messaging.",
    warranty: data.condition?.toLowerCase() === "new"
      ? "Manufacturer warranty may apply for new items — confirm with seller."
      : "Warranty terms vary by seller — message before purchase.",
  };

  return (
    <section className="pdp-section">
      <div className="yebone-surface rounded-[1.75rem] overflow-hidden">
        {/* Premium tab nav */}
        <div
          className="relative flex overflow-x-auto hide-scrollbar border-b border-gray-100/80 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50"
          role="tablist"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 px-6 lg:px-8 py-4 text-sm font-semibold transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-yebone-primary"
                  : "text-gray-500 hover:text-yebone-primary/80"
              }`}
            >
              {tab.label}
              {tab.id === "reviews" && reviewCount > 0 && (
                <span className="ml-1.5 text-xs opacity-70">({reviewCount})</span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-yebone-primary rounded-full yebone-tab-indicator" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-10">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8 pdp-fade-in">
              <div>
                <h3 className={`${typography.subheading} mb-4`}>Product Overview</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactQuill value={data.description} readOnly theme="bubble" />
                </div>
              </div>

              <div className="space-y-2">
                {ACCORDION_SECTIONS.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-gray-100/80 dark:border-gray-800 overflow-hidden yebone-card-lift bg-white/60 dark:bg-gray-900/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === key ? "" : key)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-Poppins font-semibold text-sm hover:bg-yebone-light-gray/40 dark:hover:bg-gray-800/40 transition"
                      aria-expanded={openAccordion === key}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-yebone-primary/10 flex items-center justify-center">
                          <Icon className="text-yebone-primary" size={18} />
                        </span>
                        {label}
                      </span>
                      <span className={`text-yebone-primary text-xl transition-transform duration-300 ${openAccordion === key ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    {openAccordion === key && (
                      <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4 yebone-accordion-content">
                        {key === "features" && data.details ? (
                          <p>{data.details}</p>
                        ) : (
                          accordionContent[key]
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
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
