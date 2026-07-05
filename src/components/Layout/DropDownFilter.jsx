import React, { useState } from 'react';
import { categoriesData } from '../../static/data';
const DropDownFilter = ({ categoryData, handleCategoryChange }) => {
  const [priceRange, setPriceRange] = useState([100, 10000000]); // Keeping for later use
  const [condition, setCondition] = useState(""); // Keeping condition for later use
  const [isWholesale, setIsWholesale] = useState(false); // Keeping for later use
  const [isFlashSale, setIsFlashSale] = useState(false); // Keeping for later use
  const [isDailyDeal, setIsDailyDeal] = useState(false); // Keeping for later use

  return (
    <div className="w-full p-6 bg-white dark:bg-[#1f1f1f] shadow-lg">
      <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Filter Options</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-2 dark:text-gray-200">Category</h3>
        <div className="flex flex-col">
          {categoriesData.map((category) => (
            <div key={category.id} className="mb-4">
              {/* Category checkbox */}
              <span className="text-gray-600 dark:text-gray-200 font-bold p-1 text-[14px]">
                {category.title}
              </span>
              {/* Subcategories checkboxes */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="pl-6"> {/* Indentation for subcategories */}
                  {category.subcategories.map((subcategory) => (
                    <label key={subcategory.id} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoriesData === subcategory.title}
                        onChange={() => handleCategoryChange(subcategory.title)}
                        className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-[#1f1f1f]"
                      />
                      <span className="text-gray-600 dark:text-gray-200 text-[14px]">
                        {subcategory.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* Price Range Filter (Disabled for now) */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Price Range (Disabled)</h3>
        <input
          type="range"
          min="0"
          max="10000000"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          className="w-full mb-2"
          disabled
        />
        <input
          type="range"
          min="0"
          max="10000000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full mb-4"
          disabled
        />
      </div>

      {/* Condition Filter (Disabled for now) */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Condition (Disabled)</h3>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full mb-2 border rounded-md shadow-sm dark:bg-[#1f1f1f]"
          disabled
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      {/* Wholesale Filter (Disabled for now) */}
      <div className="mb-6">
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isWholesale}
            onChange={() => setIsWholesale(!isWholesale)}
            className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            disabled
          />
          <span className="text-gray-600 dark:text-gray-200 text-[14px]">Wholesale (Disabled)</span>
        </label>
      </div>

      {/* Flash Sale Filter (Disabled for now) */}
      <div className="mb-6">
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFlashSale}
            onChange={() => setIsFlashSale(!isFlashSale)}
            className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            disabled
          />
          <span className="text-gray-600 dark:text-gray-200 text-[14px]">Flash Sale (Disabled)</span>
        </label>
      </div>

      {/* Daily Deal Filter (Disabled for now) */}
      <div className="mb-6">
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDailyDeal}
            onChange={() => setIsDailyDeal(!isDailyDeal)}
            className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            disabled
          />
          <span className="text-gray-600 dark:text-gray-200 text-[14px]">Daily Deal (Disabled)</span>
        </label>
      </div>
    </div>
  );
};

export default DropDownFilter;
