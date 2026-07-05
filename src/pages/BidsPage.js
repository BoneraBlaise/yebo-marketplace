import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getAllBids, getMyWinningBids } from "../redux/actions/bids";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { Helmet } from "react-helmet";
import BidList from "../components/Route/Bids/BidList";
import DropDownFilter from "../components/Layout/DropDownFilter";
import { RiEqualizerLine } from "react-icons/ri";
import { categoriesData } from "../static/data";
import { addTocart } from "../redux/actions/cart";
import { toast } from "react-toastify";

const BidsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allBids, winningBids, isLoading } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const searchTerm = searchParams.get("search") || "";
  const [filteredData, setFilteredData] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 10000000]);
  const [selectedCategory, setSelectedCategory] = useState(categoryData || "");
  const [condition, setCondition] = useState("");
  const [isWholesale, setIsWholesale] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isDailyDeal, setIsDailyDeal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [sortBy, setSortBy] = useState("");
  const [showActive, setShowActive] = useState(true);

  // Fetch bids
  useEffect(() => {
    dispatch(getAllBids());
    if (isAuthenticated) {
      dispatch(getMyWinningBids());
    }
  }, [dispatch, isAuthenticated]);

  // Filter the bids based on selected filters
  useEffect(() => {
    if (!Array.isArray(allBids)) {
      setFilteredData([]);
      return;
    }

    const filtered = allBids.filter((bid) => {
      if (!bid || !bid.auctionProduct) return false;

      const now = new Date();
      const endTime = new Date(bid.auctionEndTime);
      const isActive = endTime > now;

      // Filter active/ended bids
      if (showActive && !isActive) return false;
      if (!showActive && isActive) return false;

      // Improved search matching
      const matchesSearch = searchTerm ? (
        bid.auctionProduct.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.auctionProduct.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.auctionProduct.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.auctionProduct.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) : true;

      const matchesCategory = selectedCategory
        ? bid.category === selectedCategory
        : true;

      const matchesPrice = bid.startingBid
        ? bid.startingBid >= priceRange[0] && bid.startingBid <= priceRange[1]
        : true;

      const matchesCondition = condition
        ? bid.condition === condition
        : true;

      const matchesWholesale = isWholesale ? bid.isWholesale === isWholesale : true;
      const matchesFlashSale = isFlashSale ? bid.isFlashSale === isFlashSale : true;
      const matchesDailyDeal = isDailyDeal ? bid.isDailyDeal === isDailyDeal : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesCondition &&
        matchesWholesale &&
        matchesFlashSale &&
        matchesDailyDeal
      );
    });

    setFilteredData(filtered);
  }, [
    allBids,
    searchTerm,
    selectedCategory,
    priceRange,
    condition,
    isWholesale,
    isFlashSale,
    isDailyDeal,
    showActive
  ]);

  // Handlers for each filter option
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  const handleConditionChange = (value) => {
    setCondition(value);
  };

  const handleWholesaleChange = () => {
    setIsWholesale(!isWholesale);
  };

  const handleFlashSaleChange = () => {
    setIsFlashSale(!isFlashSale);
  };

  const handleDailyDealChange = () => {
    setIsDailyDeal(!isDailyDeal);
  };

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Add function to truncate name
  const truncateName = (name, maxLength = 19) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  // Add breadcrumb navigation similar to ProductsPage
  const sections = [
    { name: "Products", path: "/products" },
    { name: "Auctions", path: "/bids" },
    { name: "Flash Sales", path: "/flash-sales" }
  ];

  const handleSectionChange = (path) => {
    const currentParams = new URLSearchParams(searchParams);
    navigate(`${path}${currentParams.toString() ? '?' + currentParams.toString() : ''}`);
  };

  // Add sorting options
  const sortOptions = [
    { value: "active", label: "Active Bids" },
    { value: "ended", label: "Closed Bids" },
    { value: "endingSoon", label: "Ending Soon" },
    { value: "lowestBids", label: "Lowest Bids" },
    { value: "mostWanted", label: "Most Wanted" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" }
  ];

  // Add this function to handle sorting
  const handleSort = (value) => {
    setSortBy(value);
    let sortedData = [...filteredData];

    // Handle active/ended filter first
    if (value === "active") {
      setShowActive(true);
      return;
    } else if (value === "ended") {
      setShowActive(false);
      return;
    }

    switch (value) {
      case "endingSoon":
        sortedData.sort((a, b) => 
          new Date(a.auctionEndTime) - new Date(b.auctionEndTime)
        );
        break;
      case "lowestBids":
        sortedData.sort((a, b) => 
          (a.bids?.length || 0) - (b.bids?.length || 0)
        );
        break;
      case "mostWanted":
        sortedData.sort((a, b) => 
          (b.bids?.length || 0) - (a.bids?.length || 0)
        );
        break;
      case "newest":
        sortedData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedData.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        break;
    }

    setFilteredData(sortedData);
  };

  return (
    <>
      <Helmet>
        <title>Bids - Guriraline Bids</title>
        <meta name="description" content="Browse a wide range of bids at Guriraline." />
      </Helmet>
      <div className="bg-white dark:bg-[#1f1f1f] dark:text-gray-200 min-h-screen">
        <Header activeHeading={3} />

        <div className="w-full mx-auto px-2 sm:px-4">
          {/* Show the loader only once */}
          {isLoading ? (
            <div className="flex justify-center items-center w-full min-h-screen">
              <Loader />
            </div>
          ) : (
            <div>
              {/* Add Breadcrumb Navigation */}
              <div className="w-full px-4 py-2 mb-4 mt-2">
                <div className="max-w-[1200px] mx-auto">
                  <div className="flex items-center space-x-2">
                    {sections.map((section, index) => (
                      <React.Fragment key={section.path}>
                        <button
                          onClick={() => handleSectionChange(section.path)}
                          className={`text-sm font-medium transition-colors ${
                            location.pathname === section.path
                              ? "text-white bg-[#29625d] rounded-xl px-2 py-1"
                              : "text-gray-600 dark:text-gray-400 hover:text-[#29625d] dark:hover:text-[#29625d]"
                          }`}
                        >
                          {section.name}
                        </button>
                        {index < sections.length - 1 && (
                          <span className="text-gray-400"></span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Show search term if present */}
              {searchTerm && (
                <div className="w-full px-4 py-2 bg-white dark:bg-[#1f1f1f] mb-4">
                  <div className="max-w-[1200px] mx-auto">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Showing auction results for "{searchTerm}"
                    </div>
                  </div>
                </div>
              )}

              {/* Display different scenarios */}
              {!allBids?.length && !winningBids?.length ? (
                // No bids at all
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <img 
                    src="/no-bids.png" 
                    alt="No bids" 
                    className="w-64 h-64 object-contain mb-4"
                  />
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    No active bids available at the moment
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Please check back later for new auctions
                  </p>
                </div>
              ) : (
                <>
                  {/* Winning Bids Section - Only show if user is authenticated */}
                  {isAuthenticated && winningBids?.length > 0 && (
                    <div className="mb-6 max-w-7xl mx-auto">
                      <h2 className="text-xl mt-10 font-semibold text-gray-900 dark:text-white mb-3 px-2">
                        Your Winning Bids
                      </h2>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
                        {winningBids.map((bid) => (
                          <div key={bid?._id} className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="relative w-full aspect-square">
                              <Link to={`/bid/${bid?._id}`} className="block w-full">
                                <img
                                  src={bid?.auctionProduct?.images?.[0]?.url}
                                  alt={bid?.auctionProduct?.name}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                              </Link>
                              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Won
                              </div>
                            </div>
                            <div className="p-3 flex flex-col flex-grow">
                              <Link to={`/bid/${bid?._id}`} className="block w-full">
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                                  {truncateName(bid?.auctionProduct?.name)}
                                </h3>
                              </Link>
                              <div className="text-[#29625d] font-semibold text-sm">
                                RWF {formatPrice(bid?.highestBid)}
                              </div>
                              <div className="text-xs text-gray-500 mb-2">
                                Ended: {new Date(bid?.auctionEndTime).toLocaleDateString()}
                              </div>
                              <div className="flex flex-col gap-1.5 mt-auto">
                                <button
                                  onClick={() => {
                                    const cartItem = {
                                      _id: bid.auctionProduct._id,
                                      name: bid.auctionProduct.name,
                                      description: bid.auctionProduct.description,
                                      price: bid.highestBid,
                                      discountPrice: bid.highestBid,
                                      qty: 1,
                                      images: bid.auctionProduct.images,
                                      shopId: bid.seller,
                                      shop: bid.shop,
                                      isWonBid: true,
                                      auctionId: bid._id,
                                    };
                                    dispatch(addTocart(cartItem));
                                    toast.success("Added to cart successfully!");
                                    navigate("/checkout");
                                  }}
                                  className="w-full bg-[#29625d] hover:bg-[#1f4f4a] text-white text-sm py-1.5 rounded-lg transition-colors"
                                >
                                  Purchase Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Bids Section */}
                  {filteredData.length > 0 ? (
                    <div className="flex justify-center items-start flex-wrap w-full mb-10">
                      {/* Button to toggle Dropdown Filter for Mobile */}
                      <div className="block lg:hidden w-full p-4">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="bg-[#29625d] text-white py-2 px-4 rounded"
                        >
                          <RiEqualizerLine />
                        </button>
                        {dropdownOpen && (
                          <DropDownFilter
                            categoryData={categoryData}
                            handleCategoryChange={handleCategoryChange}
                          />
                        )}
                      </div>
                      {/* Filter Sidebar for Desktop */}
                      <div className="hidden lg:block w-[20%] p-6 mx-2 lg:mx-0">
                        <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                          Filter Options
                        </h2>

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


                        {/* Price Range Filter */}
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 dark:bg-[#1f1f1f]">
                            Price Range
                          </h3>
                          <input
                            type="range"
                            min="0"
                            max="10000000"
                            value={priceRange[0]}
                            onChange={(e) =>
                              handlePriceChange([+e.target.value, priceRange[1]])
                            }
                            className="range-input w-full mb-2"
                          />
                          <input
                            type="range"
                            min="0"
                            max="10000000"
                            value={priceRange[1]}
                            onChange={(e) =>
                              handlePriceChange([priceRange[0], +e.target.value])
                            }
                            className="range-input w-full mb-4"
                          />
                          <p className="text-black text-[14px] dark:text-gray-200">
                            Selected Price: RWF {priceRange[0]} - RWF {priceRange[1]}
                          </p>
                        </div>

                        {/* Condition Filter */}
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 dark:bg-[#1f1f1f]">
                            Condition
                          </h3>
                          <select
                            value={condition}
                            onChange={(e) => handleConditionChange(e.target.value)}
                            className="w-full mb-2 border rounded-md shadow-sm dark:text-gray-200 dark:bg-[#1f1f1f]"
                          >
                            <option value="">All Conditions</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                          </select>
                        </div>

                        {/* Wholesale Checkbox */}
                        <div className="mb-6">
                          <label className="flex items-center mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isWholesale}
                              onChange={handleWholesaleChange}
                              className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 text-[14px]">Wholesale</span>
                          </label>
                        </div>

                        {/* Flash Sale Checkbox */}
                        <div className="mb-6">
                          <label className="flex items-center mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isFlashSale}
                              onChange={handleFlashSaleChange}
                              className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 text-[14px]">Flash Sale</span>
                          </label>
                        </div>

                        {/* Daily Deal Checkbox */}
                        <div className="mb-6">
                          <label className="flex items-center mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isDailyDeal}
                              onChange={handleDailyDealChange}
                              className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-gray-600 text-[14px]">Daily Deal</span>
                          </label>
                        </div>
                      </div>

                      {/* Bids List Area */}
                      <div className="flex-grow w-full lg:w-[70%] p-4 mx-2 lg:mx-0">
                        <div className="flex justify-end mb-4 px-4">
                          <div className="relative inline-block">
                            <select
                              value={sortBy}
                              onChange={(e) => handleSort(e.target.value)}
                              className="appearance-none bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 cursor-pointer text-sm"
                            >
                              <option value="">Sort By</option>
                              {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <BidList bids={filteredData} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[200px] mt-4">
                      <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                        No active bids available
                      </p>
                      {winningBids?.length > 0 && (
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                          But you can view your winning bids above
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BidsPage;
