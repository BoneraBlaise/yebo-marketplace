import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import MobileCategories from "./MobileCategories";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return <MobileCategories />;
  }

  // Function to handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    navigate(`/products?category=${subcategory.title}`);
  };

  // Flatten the categories into a single array of subcategories
  const allSubcategories = categoriesData.reduce((acc, category) => {
    return acc.concat(category.subcategories || []);
  }, []);

  // Slice the first 12 subcategories for initial display
  const first12Subcategories = allSubcategories.slice(0, 12);
  const remainingSubcategories = allSubcategories.slice(12);

  return (
    <div className="bg-transparent dark:bg-[#1f1f1f] max-w-screen">
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding border p-2 my-12 flex justify-between w-full shadow-sm bg-white dark:bg-black dark:text-gray-200 p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {/* Display the first 12 subcategories with images */}
          {first12Subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="w-[100%] flex flex-col items-center justify-center cursor-pointer p-4 rounded-lg transition-all"
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {/* Display image for subcategories */}
              <img
                src={subcategory.image_Url} // Assuming subcategories have an image_Url property
                className="w-[100px] h-[100px] object-contain filter brightness-100"
                alt={subcategory.title}
              />
              <h5 className="text-sm mt-2 text-center leading-[1.3] text-gray-700 dark:text-gray-300 font-medium hover:text-green-500">
                {subcategory.title}
              </h5>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {remainingSubcategories.length > 0 && (
          <div className="text-center mt-4">
            <button
              className="text-blue-400 text-sm hover:text-blue-700"
              onClick={() => setShowModal(true)}
            >
              Show More
            </button>
          </div>
        )}

        {/* Modal for Remaining Subcategories */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="bg-white h-[90vh] dark:bg-gray-800 p-6 rounded-lg w-4/5 md:w-2/3 lg:w-1/2 overflow-y-auto hide-scrollbar shadow-lg">
              <h3 className="text-lg font-bold mb-6 text-center text-gray-800 dark:text-white">
                More Categories
              </h3>
              <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px] mb-8">
                {/* Display remaining subcategories without images */}
                {remainingSubcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="w-[100%] flex flex-col items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-4 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <h5 className="text-sm mt-2 text-center leading-[1.3] text-gray-700 dark:text-gray-300 font-medium">
                      {subcategory.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
