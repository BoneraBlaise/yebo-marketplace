import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const MobileCategories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Settings for react-slick slider
  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  return (
    <div className="dark:bg-[#1f1f1f]">
      <div className="w-[95%] bg-[#29625d] p-1 rounded-lg mt-3 mb-3 ml-auto mr-auto" id="categories">
        <h6 className="text-[18px] font-[500] text-[#fed592] m-3">Categories</h6>
        <Slider {...sliderSettings}>
          {categoriesData &&
            categoriesData.map((category) =>
              category.subcategories &&
              category.subcategories.map((subcategory) => {
                const handleSubmit = () => {
                  navigate(`/products?subcategory=${subcategory.title}`);
                };

                // Slice the title if it's more than 12 characters
                const title = subcategory.title.length > 10 ? `${subcategory.title.slice(0, 10)}...` : subcategory.title;
                
                return (
                  <div key={subcategory.id} className="px-2 mt-2 w-[80px]">
                    <div
                      className="w-100 h-[120px] block cursor-pointer overflow-hidden"
                      onClick={handleSubmit}
                    >
                      <img
                        src={subcategory.image_Url}
                        className="w-[70px] h-[70px] bg-white rounded-[100%] object-contain"
                        alt=""
                      />
                      <h5 className="w-20 gap-2 text-xs mt-1 text-[#fed592] hover:text-[#fed592] text-center leading-[1.3]">
                        {title}
                      </h5>
                    </div>
                  </div>
                );
              })
            )}
        </Slider>

        <Link to="/products">
          <span className="text-xs mr-2 flex items-end justify-end text-white hover:text-[#fed592]">See All</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileCategories;
