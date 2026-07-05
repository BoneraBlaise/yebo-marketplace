import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import { MdNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import MobileProductCard from "../ProductCard/MobileProductCard";
import Cookies from "js-cookie";
import Shopping from './1.jpg'

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const productsPerPage = 8;
  const isDesktop = useMediaQuery({ query: "(min-width: 901px)" });

  useEffect(() => {
    if (!allProducts) return; // Guard clause for undefined allProducts

    if (isAuthenticated) {
      try {
        const recentlyViewed = JSON.parse(Cookies.get('recentlyViewed') || '[]');
        
        if (recentlyViewed.length > 0) {
          const viewedCategories = new Set(recentlyViewed.map(p => p.category));
          
          // Filter products based on viewed categories
          let recommended = allProducts.filter(product => 
            viewedCategories.has(product.category) && 
            !recentlyViewed.some(viewed => viewed._id === product._id)
          );
          
          // Sort by most viewed categories
          const categoryCount = {};
          recentlyViewed.forEach(p => {
            categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
          });
          
          recommended.sort((a, b) => 
            (categoryCount[b.category] || 0) - (categoryCount[a.category] || 0)
          );

          // If recommended products are less than minimum, add featured products
          if (recommended.length < productsPerPage) {
            const featuredProducts = allProducts
              .filter(product => product.featured && !recommended.some(rec => rec._id === product._id))
              .slice(0, productsPerPage - recommended.length);
            recommended = [...recommended, ...featuredProducts];
          }
          
          setRecommendedProducts(recommended.slice(0, productsPerPage));
          setProductsToDisplay(recommended.slice(0, productsPerPage));
        } else {
          // If no viewing history, show featured products
          const featured = allProducts.filter(product => product.featured);
          setRecommendedProducts(featured);
          setProductsToDisplay(featured);
        }
      } catch (error) {
        console.error("Error processing recommendations:", error);
        const featured = allProducts.filter(product => product.featured);
        setRecommendedProducts(featured);
        setProductsToDisplay(featured);
      }
    } else {
      // Not authenticated - show featured products
      const featured = allProducts.filter(product => product.featured);
      setProductsToDisplay(featured);
    }
  }, [isAuthenticated, allProducts]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToDisplay.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productsToDisplay.length / productsPerPage);

  // Loading state
  if (!allProducts) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen dark:bg-[#1f1f1f] dark:text-gray-200">
      <div className={`${styles.section} mb-20`}>
        {/* Desktop - Only show banner */}
        {isDesktop ? (
          <div className="relative mb-5 h-[600px]">
            <div className="relative h-full">
              <img 
                src={Shopping} 
                alt="Shopping Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
                  {isAuthenticated ? "Personalized For You" : "Special Offer!"}
                </h1>
                <p className="text-white text-lg mb-6">
                  {isAuthenticated 
                    ? "Products picked just for you based on your interests"
                    : "Don't miss out on our featured products"}
                </p>
                <Link to='/best-selling'>
                  <button className="bg-[#29625d] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black mt-4">
                    Best Deals
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Mobile - Show title and products
          <>
            {/* Mobile Title Section */}
            <div className={`${styles.heading} text-center mb-6`}>
              {isAuthenticated ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {recommendedProducts.length > 0 
                      ? "Products You Might Like" 
                      : "Featured Products"}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {recommendedProducts.length > 0 
                      ? "Based on your interests and browsing history"
                      : "Our handpicked selection for you"}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Featured Products
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Discover our best selections
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Products Grid */}
            <div className="w-[90%] mx-auto grid grid-cols-2 justify-items-center gap-4 mb-8">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <div 
                    key={index} 
                    className={`${currentProducts.length === 1 ? 'col-span-2 justify-self-start' : ''}`}
                  >
                    <MobileProductCard data={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center h-40">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products available at the moment
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`
                    flex items-center gap-1 px-3 py-1 rounded-full
                    ${currentPage === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-[#29625d] hover:bg-[#29625d] hover:text-white'
                    }
                  `}
                >
                  <MdOutlineNavigateBefore />
                  Previous
                </button>
                
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`
                    flex items-center gap-1 px-3 py-1 rounded-full
                    ${currentPage === totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-[#29625d] hover:bg-[#29625d] hover:text-white'
                    }
                  `}
                >
                  Next
                  <MdNavigateNext />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
