import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../../styles/styles";

const initialCategories = [
  {
    title: "Electronics",
    image:
      "https://manofmany.com/wp-content/uploads/2021/01/Tech-Essentials.png",
    subcategories: [
      {
        title: "Computers",
        image:
          "https://th.bing.com/th/id/OIP.aaPVjKoD59ebkEeYAwtUXAHaE9?rs=1&pid=ImgDetMain",
      },
      {
        title: "Phones",
        image:
          "https://www.telstra.com.au/content/dam/tcom/devices/mobile/mhdwhst-px9px/porcelain/landscape-google-pixel9ProXL-porcelain-03-900x1200.jpg",
      },
      {
        title: "Headphones",
        image: "https://media.graphassets.com/Ge4V4qo0TGuG9Tna0e4g",
      },
    ],
  },
  {
    title: "Clothing",
    image:
      "https://images.pexels.com/photos/3812433/pexels-photo-3812433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    subcategories: [
      {
        title: "Shoes",
        image:
          "https://img.freepik.com/free-photo/fashion-pink-glamour-women-heels_1203-6509.jpg?t=st=1729869025~exp=1729872625~hmac=0e90e35dd67664a5c2927ed4737f33478a161216527521fa6abb2306293b5dab&w=1380",
      },
      {
        title: "Sweaters",
        image:
          "https://img.freepik.com/free-photo/white-red-knitted-christmas-jumper-isolated-white-background_125540-5392.jpg?t=st=1729869554~exp=1729873154~hmac=ffc0b77d00de6583e21863962372a79288b91dad41f3fb3d260617a2fad5316d&w=1380",
      },
      {
        title: "Hats",
        image:
          "https://img.freepik.com/free-photo/set-two-trucker-hats-with-mesh-back_23-2149410050.jpg?t=st=1729869609~exp=1729873209~hmac=1def032968679e08da3132771ddec577880aee57322e8dc6f12852871991a2c7&w=1380",
      },
    ],
  },
  {
    title: "Home",
    image:
      "https://images.pexels.com/photos/4700383/pexels-photo-4700383.jpeg?auto=compress&cs=tinysrgb&w=600",
    subcategories: [
      {
        title: "Refrigerators",
        image:
          "https://s3.amazonaws.com/productuploader-uploads/staging/2/Image/9369674_1719300231_LG_Electronics-123019763-md07500055-zoom-02-jpg",
      },
      {
        title: "Furniture",
        image: "https://m.media-amazon.com/images/I/61X6up+dzrL.jpg",
      },
      {
        title: "Microwaves",
        image:
          "https://img.freepik.com/free-vector/microwave-oven-with-light-inside-isolated-white-background-kitchen-appliances_134830-658.jpg?t=st=1729868962~exp=1729872562~hmac=a6e1d386538e547c0946933841df4648a0b4ccd64a984c900200c445f93c36fe&w=826",
      },
    ],
  },
  {
    title: "HealthCare",
    image:
      "https://s3.us-east-2.amazonaws.com/s3.zerustproducts.com/wp-content/uploads/2021/07/28193021/AdobeStock_294620656.jpeg",
    subcategories: [
      {
        title: "Vitamins",
        image:
          "https://img.freepik.com/free-vector/realistic-vitamin-complex-package_23-2148484944.jpg?t=st=1729869130~exp=1729872730~hmac=2dcf29e10d63569a187ad87dfa9b5bc825c2c9a3211d3004eaf369cf39a25bdf&w=826",
      },
      {
        title: "Skin Care",
        image:
          "https://img.freepik.com/free-photo/women-s-cosmetic-products-placed-blue_1150-17130.jpg?t=st=1729869257~exp=1729872857~hmac=ad73ce051fd8740d5dc135db6d809eaa7bb5db8fa99759f90c5c8fb2326acf7e&w=1380",
      },
      {
        title: "Fitness",
        image:
          "https://img.freepik.com/premium-photo/vitamin-mineral-supplements_967966-26096.jpg?w=826",
      },
    ],
  },
];

// Desktop slider settings
const desktopSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0",
  autoplay: true,
  prevArrow: false,
  nextArrow: false,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        centerPadding: "20px",
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        centerPadding: "10px",
      },
    },
  ],
};

// Mobile slider settings for subcategories
const mobileSubcategorySettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 2.5, // Show 2.5 cards to hint at more content
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "20px",
  autoplay: true,
  prevArrow: false,
  nextArrow: false,
  autoplaySpeed: 3000,
};

const BestDeals = () => {
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("Recommended"); // Default tab
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setCategories(initialCategories);
    };

    fetchData();

    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Bids":
        navigate("/bids");
        break;
      case "Flash Sales":
        navigate("/flash-sales");
        break;
      case "Best Selling":
        navigate("/best-selling");
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-screen dark:bg-[#1f1f1f]">
      <div className={`${styles.section}`}>
        <div
          className={`${styles.heading} text-sm md:text-base lg:text-lg text-start dark:text-gray-200`}
        >
          <h1>Hot Categories</h1>
        </div>

        {/* Desktop Layout (unchanged) */}
        {!isMobile && (
          <Slider {...desktopSettings} className="mt-4 w-full ml-auto mr-auto">
            {categories.map((category, index) => (
              <div key={index} className="px-2">
                <div className="relative p-4 w-full h-full bg-white dark:bg-[#2b2b2b] dark:text-gray-200 dark:shadow-lg dark:shadow-[#1b1a1a] rounded-lg overflow-hidden">
                  <Link
                    to={`/products?category=${encodeURIComponent(
                      category.title
                    )}`}
                  >
                    <div className="w-full h-40 flex items-center justify-center bg-gray-200">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onError={(e) => {
                          e.target.src = "path/to/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  </Link>
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex flex-col items-center"
                      >
                        <Link
                          to={`/products?search=${encodeURIComponent(
                            subcategory.title
                          )}`}
                        >
                          <div className="w-full h-24 flex items-center justify-center bg-gray-200 border">
                            <img
                              src={subcategory.image}
                              alt={subcategory.title}
                              className="w-full h-full object-cover rounded cursor-pointer"
                              onError={(e) => {
                                e.target.src = "path/to/placeholder-image.jpg";
                              }}
                            />
                          </div>
                        </Link>
                        <Link
                          to={`/products?search=${encodeURIComponent(
                            subcategory.title
                          )}`}
                          className="text-sm text-center dark:text-gray-200 cursor-pointer hover:underline"
                        >
                          {subcategory.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="text-black dark:text-gray-200 text-center py-2">
                    <Link
                      to={`/products?search=${encodeURIComponent(
                        category.title
                      )}`}
                      className="text-sm text-center cursor-pointer hover:underline"
                    >
                      <h2 className="text-lg font-semibold">
                        {category.title}
                      </h2>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}

        {/* Mobile Layout (subcategories slider) */}
        {isMobile && (
          <>
            <Slider
              {...mobileSubcategorySettings}
              className="mt-4 w-full ml-auto mr-auto"
            >
              {categories.map((category) =>
                category.subcategories.map((subcategory, subIndex) => (
                  <div key={subIndex} className="px-2">
                    <div className="relative h-20 rounded-lg overflow-hidden shadow-lg">
                      <Link
                        to={`/products?search=${encodeURIComponent(
                          subcategory.title
                        )}`}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${subcategory.image})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-[#29625d]">
                            <h2 className="text-white text-lg font-semibold text-start p-1">
                              {subcategory.title}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </Slider>

            {/* Mobile Tabs */}
            <div className="flex justify-between gap-2 mt-4 px-1">
              {["Recommended", "Bids", "Flash Sales", "Best Selling"].map(
                (tab) => (
                  <div
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`flex-1 text-center py-1 rounded-full cursor-pointer transition-all text-xs ${
                      activeTab === tab
                        ? "bg-[#29625d] text-white"
                        : "bg-black bg-opacity-10 dark:bg-gray-700 dark:bg-opacity-50 backdrop-blur-sm text-black dark:text-gray-200"
                    }`}
                  >
                    {tab}
                  </div>
                )
              )}
            </div>

            <style jsx>{`
              @media (max-width: 600px) {
                .flex-1 {
                  flex: 0 0 22%; /* Make tabs smaller */
                }
                .text-xs {
                  font-size: 12px; /* Smaller font size */
                }
                .px-1 {
                  padding-left: 4px; /* Reduce horizontal padding */
                  padding-right: 4px;
                }
                .py-1 {
                  padding-top: 6px; /* Reduce vertical padding */
                  padding-bottom: 6px;
                }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
