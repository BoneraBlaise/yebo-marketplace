import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  // Function to check similarity in product name (using first 5 characters)
  const checkNameSimilarity = (product, referenceProduct) => {
    const referenceNameSubstring = referenceProduct.name.slice(0, 5).toLowerCase();
    return product.name.toLowerCase().includes(referenceNameSubstring) && product.category === referenceProduct.category;
  };

  useEffect(() => {
    if (data && allProducts) {
      // Filter products by category
      const filteredProducts = allProducts.filter(
        (product) => product.category === data.category
      );

      // Get products with name similarity based on the first 5 characters
      const similarProducts = filteredProducts.filter((product) =>
        checkNameSimilarity(product, data)
      );

      // If no similar products, display other products in the same category
      if (similarProducts.length === 0) {
        setProductData(filteredProducts.slice(0, 8)); // Display up to 8 products from the same category
      } else {
        setProductData(similarProducts.slice(0, 8)); // Display up to 8 similar products
      }
    }
  }, [data, allProducts]);

  // Handle the Load More button click
  const handleLoadMore = () => {
    setVisibleCount(visibleCount + 4); // Load 4 more products
  };

  return (
    <div className="bg-slate-50 dark:bg-[#1f1f1f] dark:text-gray-200">
      {data ? (
        <div className={`p-4 ${styles.section} mb-20 w-[85%]`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Products
          </h2>
          {/* Switch to flex layout */}
          <div className="flex flex-wrap justify-start gap-4 mb-12 ml-auto mr-auto">
            {productData.slice(0, visibleCount).map((product, index) => (
              <ProductCard data={product} key={index} />
            ))}
          </div>

          {/* Show "Load More" button if there are more products */}
          {productData.length > visibleCount && (
            <div className="text-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-[#29625d] text-white hover:bg-black py-2 px-4 rounded"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
