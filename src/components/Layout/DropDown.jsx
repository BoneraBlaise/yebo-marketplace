import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/styles";
import { useTranslation } from "react-i18next";

const DropDown = ({ categoriesData, setDropDown }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const submitHandle = (category, subcategory) => {
    // Use navigate to handle the routing
    navigate(`/products?category=${category}&subcategory=${subcategory}`);
    setDropDown(false);
  };

  return (
    <div className="pb-6 w-[900px] h-[60vh] bg-white dark:bg-[#0f0f0f] text-gray-600 dark:text-gray-200 absolute z-[2000] dark:border-2 dark:border-gray-500 rounded-b-md shadow-lg dark:shadow-lg overflow-hidden overflow-y-auto hide-scrollbar">
      <div className="grid grid-cols-3 gap-4 h-full"> {/* Ensuring grid has equal column width */}
        {categoriesData &&
          categoriesData.map((category, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center h-full p-4"
            >
              {/* Category Title with bold font */}
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.title)}`} >
                <h3 className="cursor-pointer select-none text-start font-bold">
                  {category.title}
                </h3>
              </Link>
              {/* Subcategories listed under the category */}
              <div className="flex flex-col items-start flex-grow">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/products?category=${encodeURIComponent(subcategory.title)}`} // Using the specified link format
                    className="text-sm text-center dark:text-gray-200 hidden md:block cursor-pointer hover:underline"
                    onClick={() => setDropDown(false)} // Close dropdown on link click
                  >
                    {t(`categories.sub.${subcategory.title.toLowerCase().replace(/\s+/g, '')}`, subcategory.title)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DropDown;
