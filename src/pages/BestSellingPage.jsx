import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import ProductList from "../components/Route/ProductList/ProductList";
import { categoriesData } from "../static/data";
import { RiEqualizerLine } from "react-icons/ri";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 10000000]); // Default price range
  const [condition, setCondition] = useState('');
  const [isWholesale, setIsWholesale] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isDailyDeal, setIsDailyDeal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900); // Set initial state based on window width
  const [isPriceFiltered, setIsPriceFiltered] = useState(false); // To track if the price filter has been adjusted

  const { allProducts = [], isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (Array.isArray(allProducts) && allProducts.length > 0) {
      const filteredData = allProducts.filter(product => {
        const isBestSeller = product.bestdeal === true;
        const matchesCategory = activeCategories.length ? activeCategories.includes(product.category) : true;
        const matchesPrice =
          !isPriceFiltered || (product.discountPrice >= priceRange[0] && product.discountPrice <= priceRange[1]);

        return isBestSeller && matchesCategory && matchesPrice;
      });

      const sortedData = filteredData.sort((a, b) => b.sold_out - a.sold_out);
      setData(sortedData);
    } else {
      setData([]);
    }
  }, [allProducts, activeCategories, priceRange, isPriceFiltered]);

  const featuredProducts = Array.isArray(allProducts) ? allProducts.filter(product => product.featured) : [];

  const toggleCategory = (category) => {
    setActiveCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="marketplace-page yebone-premium-screen bg-white dark:text-gray-200 dark:bg-gray-950 min-h-screen">
          <div className="flex flex-col lg:flex-row justify-center items-start">
            {/* Button to toggle filters on mobile */}
            {isMobile && (
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="p-2 bg-[#29625d] text-white rounded m-4 lg:hidden"
              >
                <RiEqualizerLine />
              </button>
            )}

            {/* Filter Sidebar */}
            {(isMobile ? showFilters : true) && (
              <div className="w-full lg:w-[15%] p-6 mx-2 lg:mx-0">
                <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">Filter Options</h2>
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-2 dark:text-gray-200">Category</h3>
                  <div className="flex flex-col">
                    {categoriesData.map((category) => (
                      <label key={category.id} className="flex items-center mb-2 cursor-pointer dark:text-gray-200">
                        <input
                          type="checkbox"
                          checked={activeCategories.includes(category.title)}
                          onChange={() => toggleCategory(category.title)}
                          className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-gray-600 text-[14px] dark:text-gray-200">{category.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 ">Price Range</h3>
                  <input
                    type="range"
                    max="10000000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      setPriceRange([+e.target.value, priceRange[1]]);
                      setIsPriceFiltered(true);
                    }}
                    className="range-input  w-full mb-2"
                  />
                  <input
                    type="range"
                    max="10000000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], +e.target.value]);
                      setIsPriceFiltered(true);
                    }}
                    className="range-input w-full mb-4"
                  />

                  <p className="text-black text-[14px] dark:text-gray-200">Selected Price: RWF {priceRange[0]} - RWF {priceRange[1]}</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 dark:bg-[#1f1f1f]">Condition</h3>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full mb-2 border rounded-md shadow-sm dark:text-gray-200 dark:bg-[#1f1f1f]"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWholesale}
                      onChange={() => setIsWholesale((prev) => !prev)}
                      className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 text-[14px] dark:text-gray-200 dark:bg-[#1f1f1f]">Wholesale</span>
                  </label>
                </div>
                <div className="mb-6">
                  <label className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFlashSale}
                      onChange={() => setIsFlashSale((prev) => !prev)}
                      className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 text-[14px] dark:text-gray-200 dark:bg-[#1f1f1f]">Flash Sale</span>
                  </label>
                </div>
                <div className="mb-6">
                  <label className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDailyDeal}
                      onChange={() => setIsDailyDeal((prev) => !prev)}
                      className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 text-[14px] dark:text-gray-200 dark:bg-[#1f1f1f]">Daily Deal</span>
                  </label>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="px-1 py-4 w-full lg:w-[85%]">
              <div className={`${styles.section} flex flex-col items-center justify-center`}>
                <h2 className="text-2xl font-bold mb-4 text-start">Best Selling Products</h2>
                <div className="marketplace-product-grid mpc-grid--page mb-12">
                  {data.length > 0 ? (
                    data.map((product) => (
                      <div key={product._id} className="mpc-card-slot">
                        <ProductCard data={product} />
                      </div>
                    ))
                  ) : (
                     
                     <span className="dark:text-white text-center">No Products found!</span>
                    
                    )}
                </div>
              </div>

              {/* Featured Products Section */}
              <h2 className="text-2xl font-bold mb-4 text-center">Recommended Products</h2>
              <div className="flex justify-center items-start mb-12 w-[85%] ml-auto mr-auto">
                <div className="w-full">
                  {featuredProducts.length > 0 ? (
                    <ProductList products={featuredProducts} />
                  ) : (
                    <div className="flex justify-center items-center h-40 w-full">
                      <p>No featured products available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
