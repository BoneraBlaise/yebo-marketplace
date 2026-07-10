import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { categoriesData } from "../../../static/data";
import "./categoryLanding.css";

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className="text-lg">
        {star <= rating ? (
          <AiFillStar className="text-yellow-400" />
        ) : (
          <AiOutlineStar className="text-gray-400" />
        )}
      </span>
    ))}
  </div>
);

const FilterGroup = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`cat-filter__group${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="cat-filter__group-head"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {title}
        <IoChevronDown size={16} className="cat-filter__group-chevron" aria-hidden="true" />
      </button>
      {open && <div className="cat-filter__group-body">{children}</div>}
    </div>
  );
};

const CategoryFilterSidebar = ({
  sticky = false,
  embedded = false,
  className = "",
  sortBy,
  onSortChange,
  sortOptions = [],
  selectedRating,
  onRatingChange,
  minPriceInput,
  maxPriceInput,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceSubmit,
  priceRange,
  onPriceRangeChange,
  condition,
  onConditionChange,
  inStock,
  onInStockChange,
  productType,
  onProductTypeChange,
  categoryData,
  onCategoryChange,
  brandOptions = [],
  selectedBrand = "",
  onBrandChange,
  hideLegacyCategories = false,
}) => (
  <aside
    className={`cat-filter ${embedded ? "cat-filter--embedded" : "yebone-surface"} ${
      sticky ? "cat-filter--sticky" : ""
    } ${className}`}
  >
    {!embedded && <h2 className="cat-filter__title">Filters</h2>}

    <FilterGroup title="Sort by">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="cat-filter__select"
      >
        <option value="">Default</option>
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FilterGroup>

    <FilterGroup title="Rating">
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`flex items-center gap-2 w-full p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedRating === rating ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
            onClick={() => onRatingChange(rating === selectedRating ? 0 : rating)}
          >
            <StarRating rating={rating} />
            <span className="text-sm text-gray-600 dark:text-gray-300">{rating} Stars</span>
          </button>
        ))}
      </div>
    </FilterGroup>

    <FilterGroup title="Price range">
      <form onSubmit={onPriceSubmit}>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="cat-filter__input"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="cat-filter__input"
          />
        </div>
        <button type="submit" className="cat-filter__btn">
          Apply price
        </button>
      </form>
      <div className="space-y-3 mt-3">
        <input
          type="range"
          min="0"
          max="10000000"
          value={priceRange[0]}
          onChange={(e) => onPriceRangeChange([+e.target.value, priceRange[1]])}
          className="range-input w-full"
        />
        <input
          type="range"
          min="0"
          max="10000000"
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], +e.target.value])}
          className="range-input w-full"
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          RWF {priceRange[0].toLocaleString()} - RWF {priceRange[1].toLocaleString()}
        </p>
      </div>
    </FilterGroup>

    <FilterGroup title="Condition">
      <select
        value={condition}
        onChange={(e) => onConditionChange(e.target.value)}
        className="cat-filter__select"
      >
        <option value="">All conditions</option>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>
    </FilterGroup>

    <FilterGroup title="Availability">
      <label className="cat-filter__check">
        <input type="checkbox" checked={inStock} onChange={(e) => onInStockChange(e.target.checked)} />
        <span>In stock only</span>
      </label>
    </FilterGroup>

    <FilterGroup title="Product type">
      <select
        value={productType}
        onChange={(e) => onProductTypeChange(e.target.value)}
        className="cat-filter__select"
      >
        <option value="all">All products</option>
        <option value="wholesale">Wholesale</option>
        <option value="flash-sale">Flash sale</option>
        <option value="daily-deal">Daily deal</option>
      </select>
    </FilterGroup>

    {brandOptions.length > 0 && (
      <FilterGroup title="Brand">
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="cat-filter__select"
        >
          <option value="">All brands</option>
          {brandOptions.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </FilterGroup>
    )}

    {!hideLegacyCategories && (
    <FilterGroup title="Categories" defaultOpen={Boolean(categoryData)}>
      {categoriesData.map((category) => (
        <div key={category.id}>
          <span className="cat-filter__parent-label">{category.title}</span>
          {category.subcategories?.length > 0 && (
            <div className="cat-filter__sub-list">
              {category.subcategories.map((subcategory) => (
                <label key={subcategory.id} className="cat-filter__check">
                  <input
                    type="checkbox"
                    checked={categoryData === subcategory.title}
                    onChange={() => onCategoryChange(subcategory.title)}
                  />
                  <span>{subcategory.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </FilterGroup>
    )}
  </aside>
);

export default CategoryFilterSidebar;
