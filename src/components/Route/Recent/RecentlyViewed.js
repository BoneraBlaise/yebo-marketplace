import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick'; // Import react-slick
import Cookies from 'js-cookie'; // Import js-cookie
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive'; // Import useMediaQuery
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import custom arrows from react-icons
import styles from '../../../styles/styles';

const RecentlyViewed = () => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current slide index
    const sliderRef = useRef(null); // Ref to control the slider manually

    // Fetch recently viewed products from cookies
    useEffect(() => {
        const viewedProducts = Cookies.get('recentlyViewed') ? JSON.parse(Cookies.get('recentlyViewed')) : [];
        setRecentlyViewed(viewedProducts);
    }, []);

    const formatPrice = (price) => {
        // Check if price is a valid number
        if (typeof price !== 'number' || isNaN(price)) {
            return 'N/A'; // Return 'N/A' if price is invalid
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format price with commas
    };

    // Media query for small devices (mobile)
    const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });

    // Slick carousel settings with custom arrows
    const settings = {
        infinite: false, // Set infinite to false so we can control the sliding manually
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        ref: sliderRef, // Attach ref to the slider
        beforeChange: (current, next) => {
            setCurrentIndex(next); // Update the current index when the slide changes
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };
    // Function to slide to the next product
    const slideNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    // Function to slide to the previous product
    const slidePrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    return (
        <div className='w-full  mt-10 mb-10'>
            <div className="p-2 md:max-w-[80%] mx-auto relative">
                <div className={`${styles.heading} text-sm md:text-base lg:text-lg text-start dark:text-gray-200`}>
                    <h1>Recently Viewed Products</h1>
                </div>
                {recentlyViewed.length > 0 ? (
                    <Slider {...settings}>
                        {recentlyViewed.map((product) => (
                            <div key={product._id} className="p-1 overflow-hidden">
                                <div className="bg-white dark:bg-[#2b2b2b] shadow-lg rounded-lg p-2">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full ${isSmallScreen ? 'h-[150px]' : 'h-[250px]'} object-cover rounded-lg bg-gray-300`}
                                        />
                                    </Link>
                                    <div className="p-3 flex flex-col justify-between h-full">
                                        <h4 className="text-sm font-medium dark:text-white truncate">
                                            {/* Conditionally slice product name */}
                                            {isSmallScreen
                                                ? product.name.length > 10
                                                    ? product.name.slice(0, 10) + "..."
                                                    : product.name
                                                : product.name.length > 40
                                                    ? product.name.slice(0, 30) + "..."
                                                    : product.name
                                            }
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">RWF {formatPrice(product.price)}</p>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p className="text-center">No recently viewed products</p>
                )}

                {/* Show arrows based on the number of products and screen size */}
                {(recentlyViewed.length > 6 || (isSmallScreen && recentlyViewed.length > 2)) && (
                    <>
                        {/* Right Arrow - for sliding forward, if we're not at the last product */}
                        {currentIndex < recentlyViewed.length - 1 && (
                            <div
                                className="absolute top-1/2 right-4 z-20 p-2 bg-black bg-opacity-40 text-white rounded-full cursor-pointer shadow-md transform -translate-y-1/2 hover:bg-opacity-70 transition duration-200"
                                onClick={slideNext}
                            >
                                <FaArrowRight size={32} />
                            </div>
                        )}

                        {/* Left Arrow - for sliding back, if we're not at the beginning */}
                        {currentIndex > 0 && (
                            <div
                                className="absolute top-1/2 left-4 z-20 p-2 bg-black bg-opacity-40 text-white rounded-full cursor-pointer shadow-md transform -translate-y-1/2 hover:bg-opacity-70 transition duration-200"
                                onClick={slidePrev}
                            >
                                <FaArrowLeft size={32} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentlyViewed;
