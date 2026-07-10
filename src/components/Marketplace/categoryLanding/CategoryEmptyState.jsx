import React from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "../../ui";
import { typography } from "../../../design-system/typography";
import { getAlternativeCategories } from "./categoryLandingUtils";
import "./categoryLanding.css";

const CategoryEmptyState = ({
  context,
  searchTerm,
  onClearFilters,
}) => {
  const alternatives = getAlternativeCategories(context?.parent?.title || context?.title);

  return (
    <div className="cat-landing-empty yebone-fade-up">
      <div className="cat-landing-empty__icon" aria-hidden="true">
        <IoSearchOutline size={28} />
      </div>
      <h2 className={`cat-landing-empty__title ${typography.heading}`}>
        No products in {context?.title || "this category"} yet
      </h2>
      <p className="cat-landing-empty__message">
        {searchTerm
          ? `We couldn't find matches for "${searchTerm}" in this category. Try different keywords or explore related departments.`
          : "This category doesn't have listings right now. Browse popular alternatives or return to the full marketplace."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/products">
          <Button size="lg" className="yebone-btn-lift">
            Browse marketplace
          </Button>
        </Link>
        {onClearFilters && (
          <button type="button" onClick={onClearFilters} className="home-btn-outline home-btn-lift px-5 py-2.5 rounded-xl text-sm font-semibold">
            Clear filters
          </button>
        )}
      </div>

      {alternatives.length > 0 && (
        <div className="cat-landing-empty__alternatives max-w-2xl mx-auto">
          <p className="cat-landing-empty__alt-title">Popular categories</p>
          <div className="cat-landing-empty__alt-grid">
            {alternatives.map((alt) => (
              <Link key={alt.title} to={alt.to} className="cat-landing-empty__alt-card">
                {alt.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEmptyState;
