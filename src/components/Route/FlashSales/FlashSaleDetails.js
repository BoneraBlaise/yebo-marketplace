import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFlashSaleDetails } from "../../../redux/actions/flashSale";
import ReactQuill from "react-quill";
import { useNavigate, Link } from "react-router-dom";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";

const FlashSaleDetails = () => {
    const { flashSaleId } = useParams(); // Get the flashSaleId from the route parameters
    const dispatch = useDispatch();
    const [select, setSelect] = useState(0); // To manage image selection
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for full description
    const { flashSale, isLoading, error } = useSelector((state) => state.flashSales); // Getting data from Redux
    const { allProducts } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user); // Add user selector
    const navigate = useNavigate();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [tags, setTags] = useState([
        'All Products', 'Flash Sales', 'Best Deals', 'New Arrivals', 
        'Popular', 'Most Viewed', 'Featured', 'Trending', 'Discounted'
    ]);

    // Log flashSaleId and the initial state
    useEffect(() => {
        console.log("Component mounted, flashSaleId:", flashSaleId);
        if (flashSaleId) {
            console.log("Dispatching action to fetch flash sale details for ID:", flashSaleId);
            dispatch(getFlashSaleDetails(flashSaleId));
        }
    }, [dispatch, flashSaleId]);

    useEffect(() => {
        if (flashSale && allProducts) {
            // First try to find related flash sale products
            const relatedFlashSales = allProducts.filter(product => 
                product.category === flashSale.category && 
                product._id !== flashSale._id &&
                product.flashSale === true
            );

            // If no flash sale products found, get regular products
            const relatedRegular = allProducts.filter(product => 
                product.category === flashSale.category && 
                product._id !== flashSale._id
            );

            // Use flash sale products if available, otherwise use regular products
            const related = relatedFlashSales.length > 0 ? relatedFlashSales : relatedRegular;
            setRelatedProducts(related.slice(0, 4));
        }
    }, [flashSale, allProducts]);

    const formatPrice = (price) => {
        if (price == null || isNaN(price)) {
            console.log("Invalid price:", price);
            return "N/A"; // Return a fallback value if the price is invalid
        }
        const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        console.log("Formatted price:", formattedPrice);
        return formattedPrice; // Format the price with commas
    };
    const handleBuyNow = () => {
        if (!user) {
            toast.error("Please login to purchase");
            navigate('/login');
            return;
        }

        const flashSaleItem = {
            _id: flashSale._id,
            name: flashSale.name,
            discountPrice: flashSale.flashSalePrice,
            originalPrice: flashSale.originalPrice,
            images: flashSale.images,
            qty: 1,
            shopId: flashSale.shop._id,
            isFlashSale: true,
            stock: flashSale.stock
        };

        dispatch(addTocart(flashSaleItem));

        navigate("/checkout", { 
            state: { 
                flashSale: flashSaleItem,
                orderType: 'flash_sale'
            }
        });
    };

    // Add scroll handler for tags
    const handleTagScroll = (direction) => {
        const container = document.querySelector('.tags-scroll-container');
        const scrollAmount = 200;
        if (container) {
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Log loading state
    if (isLoading) {
        console.log("Loading flash sale details...");
        return (
            <div className="flex h-[100vh] justify-center items-center p-2">
                <div className="border-t-4 border-[#29625d] animate-spin rounded-full h-16 w-16"></div>
            </div>
        );
    }

    // Log error state
    if (error) {
        console.error("Error fetching flash sale details:", error);
        return (
            <div className="flex h-[100vh] justify-center items-center p-2">
                <div className="text-red-600 block w-full">{error}</div>
                <button
                    className="bg-[#29625d] block px-4 py-2 text-white rounded-full"
                    onClick={window.location.reload}
                >
                    Refresh
                </button>
            </div>
        );
    }

    if (!flashSale) {
        console.log("Flash sale not found for ID:", flashSaleId);
        return <div>Flash sale not found</div>;
    }

    // Log flashSale object
    console.log("Fetched flash sale details:", flashSale);

    // Fallback description if not available
    const description = flashSale.description || "No description available.";
    const isDescriptionLong = description.length > 350;
    const truncatedDescription =
        description.slice(0, 350) + (isDescriptionLong ? "..." : "");

    // Log description info
    console.log("Description length:", description.length);
    console.log("Truncated description:", truncatedDescription);

    // Modal functionality to see the full description
    const openModal = () => {
        console.log("Opening modal to see full description");
        setIsModalOpen(true);
    };
    const closeModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
    };

    // Log selected image index and URL
    const selectedImage =
        flashSale.images && flashSale.images.length > 0 ? flashSale.images[select]?.url : null;
    console.log("Selected image index:", select);
    console.log("Selected image URL:", selectedImage);

    return (
        <div className="bg-white dark:bg-[#1f1f1f]">
            {/* Tags Navigation */}
            <div className="w-full dark:bg-[#2b2b2b] bg-white sticky top-0">
                <div className="max-w-[1200px] mx-auto relative px-4 py-3">
                    {/* Left scroll button */}
                    <button 
                        onClick={() => handleTagScroll('left')}
                        className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-[41] bg-[#29625d] hover:bg-black rounded-full p-1.5 shadow-md opacity-70 hover:opacity-100"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Tags container with proper spacing */}
                    <div className="overflow-x-auto tags-scroll-container hide-scrollbar mx-8">
                        <div className="flex gap-3 whitespace-nowrap justify-between min-w-full">
                            {tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    to={`/products?tag=${tag}`}
                                    className="px-4 py-1.5 dark:bg-[#1f1f1f] bg-[#f5f5f5] text-sm rounded-full dark:text-white hover:bg-[#29625d] hover:text-white transition-colors flex-shrink-0"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right scroll button */}
                    <button 
                        onClick={() => handleTagScroll('right')}
                        className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-[41] bg-[#29625d] hover:bg-black rounded-full p-1.5 shadow-md opacity-70 hover:opacity-100"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Add this CSS */}
            <style jsx>{`
                .tags-scroll-container {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    scroll-behavior: smooth;
                }
                .tags-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                .tags-scroll-container > div {
                    padding-left: calc((100% - min(1200px, 100%)) / 2);
                    padding-right: calc((100% - min(1200px, 100%)) / 2);
                }
            `}</style>

            <div className="p-6 shadow-lg rounded-lg">
                <div className="flex flex-col w-[95%] mx-auto md:flex-row gap-6 mb-10">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/2 py-6">
                        {/* Main Image */}
                        <div className="w-full mb-4">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={flashSale.name}
                                    className="w-full h-[500px] object-contain rounded-md"
                                />
                            ) : (
                                <div className="w-full h-[500px] bg-gray-300 flex justify-center items-center rounded-md">
                                    <p className="text-white">No Image Available</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex justify-center gap-3 mb-6">
                            {flashSale.images?.map((img, index) => (
                                <div
                                    key={index}
                                    className={`relative cursor-pointer transition-all duration-300 ${
                                        select === index ? 'ring-2 ring-[#29625d] ring-offset-1' : ''
                                    }`}
                                    onClick={() => setSelect(index)}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="h-[60px] w-[60px] object-cover rounded-md hover:opacity-80"
                                    />
                                    {select === index && (
                                        <div className="absolute inset-0 bg-[#29625d] opacity-10 rounded-md"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FlashSale Information */}
                    <div className="flex-grow md:w-1/2">
                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                            {flashSale.name}
                        </h2>

                        <div>
                            <ReactQuill
                                value={truncatedDescription}
                                className="dark:text-gray-400"
                                readOnly
                                theme="bubble"
                            />
                            {isDescriptionLong && (
                                <button
                                    className="text-[#27b3a7] block cursor-pointer"
                                    onClick={openModal} // Open modal to see full description
                                >
                                    Read More
                                </button>
                            )}
                        </div>

                        <div className="mb-4">
                            <h4 className="text-lg dark:text-white my-2 font-semibold">
                                Discount
                            </h4>
                            <p className="text-2xl font-bold text-green-600 dark:text-[#29625d]">
                                RWF {formatPrice(flashSale.flashSalePrice)}
                            </p>
                        </div>

                        {/* Original Price (optional) */}
                        {flashSale.originalPrice && flashSale.originalPrice !== flashSale.flashSalePrice && (
                            <div>
                                <h4 className="text-lg dark:text-white my-2 font-semibold">
                                    Original Price
                                </h4>
                                <p className="text-xl font-bold text-red-700 line-through">
                                    RWF {formatPrice(flashSale.originalPrice)}
                                </p>
                            </div>
                        )}
                        <button
                            className="bg-[#29625d] mt-4 text-white py-2 px-4 rounded-full transition duration-300 hover:bg-black"
                            onClick={handleBuyNow}
                            title="Make an offer"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="w-full dark:bg-[#1f1f1f] bg-white py-8 md:py-12">
                    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
                        <div className="w-full md:max-w-[1200px] md:mx-auto">
                            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                            {relatedProducts[0]?.flashSale ? 'Related Flash Sales' : 'Related Products'}
                        </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-2 sm:px-0">
                            {relatedProducts.map((product) => (
                                <Link 
                                    key={product._id} 
                                    to={product.flashSale ? `/flash-sale/${product._id}` : `/product/${product._id}`}
                                    className="block group"
                                >
                                    <div className="relative overflow-hidden rounded-lg dark:bg-[#2b2b2b] bg-[#f5f5f5] h-full transition-transform duration-300 hover:-translate-y-1">
                                        <div className="aspect-square w-full">
                                            <img
                                                src={product.images[0]?.url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                            />
                                            {product.flashSale && (
                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                    Flash Sale
                                                </span>
                                            )}
                                        </div>
                                            <div className="p-2.5 md:p-3 dark:bg-[#2b2b2b] bg-[#f5f5f5]">
                                                <h4 className="text-xs md:text-sm font-medium text-gray-800 dark:text-white truncate mb-1.5 md:mb-2" 
                                                title={product.name}>
                                                    {product.name.length > 35 
                                                        ? `${product.name.substring(0, 35)}...` 
                                                    : product.name}
                                            </h4>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[#29625d] font-medium text-xs md:text-sm">
                                                    RWF {formatPrice(product.flashSale ? product.flashSalePrice : product.discountPrice)}
                                                </span>
                                                {product.originalPrice && (
                                                        <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                                        RWF {formatPrice(product.originalPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal for Full description */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal} // Close modal on outside click
                >
                    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg w-[80%] h-[80%] overflow-y-auto hide-scrollbar">
                        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                            Full Description
                        </h2>
                        <div className="mb-4">
                            <ReactQuill
                                value={description}
                                readOnly
                                theme="bubble"
                                className="quill-description dark:text-gray-200"
                            />
                        </div>
                        <button
                            onClick={closeModal} // Close the modal
                            className="bg-red-600 text-white py-2 px-6 rounded-full mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashSaleDetails;
