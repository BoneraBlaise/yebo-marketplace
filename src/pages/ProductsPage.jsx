import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductList from "../components/Route/ProductList/ProductList";
import DropDownFilter from "../components/Layout/DropDownFilter";
import { categoriesData } from "../static/data"; // Import your categories data
import { Helmet } from "react-helmet";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { Container, SectionTitle } from "../components/ui";
import {
  MarketplacePageHero,
  MarketplaceActiveFilters,
  MarketplaceSectionTabs,
  MarketplaceSortSelect,
  MarketplaceListingSkeleton,
  MarketplaceAISection,
  MarketplaceMobileFilterButton,
  MarketplaceEmptyState,
} from "../components/Marketplace";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const searchTerm = searchParams.get("search") || ""; // Extract search term
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // New filter states
  const [priceRange, setPriceRange] = useState([1, 10000000]);
  const [condition, setCondition] = useState("new");
  const [isWholesale, setIsWholesale] = useState("wholesale");
  const [isFlashSale, setIsFlashSale] = useState("flashsale");
  const [isDailyDeal, setIsDailyDeal] = useState("DailyDeal");
  const [isPriceFiltered, setIsPriceFiltered] = useState(false); // Track if price filter has been adjusted

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);

  // Add new state variables
  const [sortBy, setSortBy] = useState(""); // For price sorting
  const [minPriceInput, setMinPriceInput] = useState(""); // For price range input
  const [maxPriceInput, setMaxPriceInput] = useState(""); // For price range input
  const [selectedRating, setSelectedRating] = useState(0); // For rating filter
  const [inStock, setInStock] = useState(true); // For stock filter
  const [productType, setProductType] = useState("all"); // For product type (wholesale, flash sale, daily deal)

  // Add this near your other state variables
  const sortOptions = [
    { value: "almostGone", label: "Almost Gone" },
    { value: "newest", label: "Newest First" },
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "bestSelling", label: "Best Selling" }
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Add this near the top of the component
  const sections = [
    { name: "Products", path: "/products" },
    { name: "Auctions", path: "/bids" },
    { name: "Flash", path: "/flash-sales" }
  ];

  // Add this function to handle section changes
  const handleSectionChange = (path) => {
    const currentParams = new URLSearchParams(searchParams);
    navigate(`${path}${currentParams.toString() ? '?' + currentParams.toString() : ''}`);
  };

  // Handle recently viewed products from cookies
  const getRecentlyViewedProducts = () => {
    const recentlyViewed = Cookies.get("recentlyViewed");
    if (recentlyViewed) {
      return JSON.parse(recentlyViewed); // Parse the cookie data into an array
    }
    return []; // Return an empty array if no data in cookies
  };

  const getRecommendations = (recentlyViewed) => {
    // Match categories of recently viewed products
    const viewedCategories = recentlyViewed.map(product => product.category);

    const recommendedProducts = allProducts.filter((product) =>
      viewedCategories.includes(product.category) && !recentlyViewed.some(vp => vp._id === product._id)
    );

    // Randomize recommendations
    return shuffleArray(recommendedProducts);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(allProducts)) {
      console.error("allProducts is not an array");
      return;
    }

    // Fetch recently viewed products from cookies
    const recentlyViewed = getRecentlyViewedProducts();
    const recommendations = getRecommendations(recentlyViewed);

    // Set the recommendations state
    setRecommendations(recommendations); // Now set the recommendations state properly

    // Filter products based on search parameters
    let filteredData = allProducts.filter((product) => {
      // Get URL parameters
      const locationParam = searchParams.get("location");
      const conditionParam = searchParams.get("condition");
      const productTypeParam = searchParams.get("productType");
      const shopParam = searchParams.get("shop");
      const minPriceParam = searchParams.get("minPrice");
      const maxPriceParam = searchParams.get("maxPrice");

      // Basic filters
      const matchesCategory = categoryData
        ? product.category === categoryData
        : true;

      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      // Price range filter from URL parameters
      const matchesPriceFromUrl = (() => {
        const productPrice = Number(product.discountPrice);
        const categoryFromUrl = searchParams.get("category");

        // Only filter products from the same category
        if (!categoryFromUrl) return true;
        if (product.category !== categoryFromUrl) return false;

        if (minPriceParam && maxPriceParam) {
          return productPrice >= Number(minPriceParam) &&
            productPrice <= Number(maxPriceParam);
        }
        if (maxPriceParam) {
          return productPrice <= Number(maxPriceParam);
        }
        if (minPriceParam) {
          return productPrice >= Number(minPriceParam);
        }
        return true;
      })();

      // Other price range filter (from slider)
      const matchesPriceFromSlider =
        !isPriceFiltered ||
        (product.discountPrice >= priceRange[0] && product.discountPrice <= priceRange[1]);

      // Other filters remain the same...
      const matchesLocation = locationParam
        ? product.location === locationParam
        : true;

      const matchesCondition = conditionParam
        ? product.condition === conditionParam
        : true;

      const matchesProductType = productTypeParam
        ? product.productType === productTypeParam
        : true;

      const matchesShop = shopParam
        ? product.shop._id === shopParam
        : true;

      // Add rating filter
      const matchesRating = selectedRating === 0 || (product.ratings && product.ratings >= selectedRating);

      // Stock filter
      const matchesStock = !inStock || (product.stock && product.stock > 0);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesLocation &&
        matchesCondition &&
        matchesShop &&
        matchesPriceFromUrl &&
        matchesPriceFromSlider &&
        matchesRating &&
        matchesStock &&
        matchesProductType
      );
    });

    // Add sorting logic
    if (sortBy) {
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case "almostGone":
            // Put products with stock < 2 at the top
            if (a.stock < 2 && b.stock >= 2) return -1;
            if (b.stock < 2 && a.stock >= 2) return 1;
            // If both products have low stock, sort by lowest stock first
            if (a.stock < 2 && b.stock < 2) return a.stock - b.stock;
            return 0;
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "priceLowToHigh":
            return a.discountPrice - b.discountPrice;
          case "priceHighToLow":
            return b.discountPrice - a.discountPrice;
          case "rating":
            return (b.ratings || 0) - (a.ratings || 0);
          case "bestSelling":
            return (b.sold_out || 0) - (a.sold_out || 0);
          default:
            return 0;
        }
      });
    }

    setData(filteredData);

  }, [
    allProducts,
    categoryData,
    searchTerm,
    isLoading,
    priceRange,
    isPriceFiltered,
    searchParams,
    sortBy,
    selectedRating,
    inStock,
    productType,
  ]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === categoryData) {
      newParams.delete("category"); // Remove category if it's already selected
    } else {
      newParams.set("category", category); // Set the new category
    }
    setSearchParams(newParams); // Update the URL parameters
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setIsPriceFiltered(true); // Mark that the price filter has been adjusted

    const newParams = new URLSearchParams(searchParams);
    newParams.set("priceMin", newRange[0]); // Add or update min price
    newParams.set("priceMax", newRange[1]); // Add or update max price
    setSearchParams(newParams); // Update the URL parameters
  };

  const handleConditionChange = (condition) => {
    const newParams = new URLSearchParams(searchParams);
    if (condition) {
      newParams.set("condition", condition); // Set condition if it exists
    } else {
      newParams.delete("condition"); // Remove condition if it's empty
    }
    setCondition(condition);
    setSearchParams(newParams); // Update the URL parameters
  };

  const handleWholesaleChange = () => {
    const newWholesaleState = !isWholesale;
    setIsWholesale(newWholesaleState);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("wholesale", newWholesaleState); // Update wholesale filter
    setSearchParams(newParams); // Update the URL parameters
  };

  const handleFlashSaleChange = () => {
    const newFlashSaleState = !isFlashSale;
    setIsFlashSale(newFlashSaleState);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("flashSale", newFlashSaleState); // Update flash sale filter
    setSearchParams(newParams); // Update the URL parameters
  };

  const handleDailyDealChange = () => {
    const newDailyDealState = !isDailyDeal;
    setIsDailyDeal(newDailyDealState);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("dailyDeal", newDailyDealState); // Update daily deal filter
    setSearchParams(newParams); // Update the URL parameters
  };

  // Add handler for price input submission
  const handlePriceInputSubmit = (e) => {
    e.preventDefault();
    const min = Number(minPriceInput) || 0;
    const max = Number(maxPriceInput) || 10000000;
    handlePriceChange([min, max]);
  };

  //SEO products indexing

  const productList = [
    {
      name: "Google Pixel 6",
      description:
        "The Google Pixel 6 is an innovative smartphone that combines cutting-edge technology, premium design, and exceptional performance. Powered by Google's custom Tensor processor, the Pixel 6 delivers smooth performance, AI-driven features, and enhanced security—making it a perfect choice for those seeking a device that's fast, smart, and secure. The 6.4-inch AMOLED display offers stunning visuals with rich colors and sharp detail, while the dual-camera system takes your photography to the next level. Whether you're capturing the perfect shot or multitasking, the Pixel 6 is designed to keep up with your busy life.",
      price: "260,000 RWF",
      url: "https://yebone.com/product/6737694fba5952d4be3c08c4",
    },
    {
      name: "Switzerland Nesun Women's Watches Luxury",
      description:
        "New Switzerland Nesun Women's Watches Luxury Brand Quartz Watch Women Six-leaf grass design Clock Diamond Wristwatches N9065-4",
      price: "105,000 RWF",
      url: "https://yebone.com/product/67493fbdac42e5077b3e6adc",
    },
    {
      name: "Promot Rubber Wristband for adults (Multiple colors)",
      description:
        "Promot Merch Rubber Wristband. Designed for adults, this durable, flexible wristband offers a simple yet impactful way to share your message, whether for charity events, brand promotions, or team spirit. Lightweight and comfortable, it's perfect for everyday wear, making it easy to show off your cause wherever you go.",
      price: "1,000 RWF",
      url: "https://yebone.com/product/673e099bc4616e4cffdab559",
    },
    {
      name: "Promot T-shirt (Promot Merch -All sizes) for Men, women and Children",
      description:
        "Promot T-Shirt, a high-quality and stylish garment designed for comfort and durability. Whether you're promoting your business, event, or cause, this t-shirt is the perfect choice to make your message stand out. Crafted with care and attention to detail, the Promot T-Shirt offers a perfect blend of style, comfort, and flexibility for any occasion.",
      price: "12,000 RWF",
      url: "https://yebone.com/product/673df8435b00468530178095",
    },
    // Add more products...
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Yebone Products",
    "description": "Browse a wide selection of products on Yebone.",
    "offers": productList.map(product => ({
      "@type": "Offer",
      "priceCurrency": "RWF", // Assuming RWF is the currency
      "price": product.price,
      "url": product.url,
      "itemOffered": {
        "@type": "Product",
        "name": product.name,
        "description": product.description
      }
    }))
  };

  // Optionally, you can stringify the structured data if you want to insert it directly into your HTML
  const structuredDataString = JSON.stringify(structuredData);

  // Add this helper component for star rating
  const StarRating = ({ rating, onRatingClick }) => {
    return (
      <div className="flex items-center cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onRatingClick(star)}
            className="text-xl"
          >
            {star <= rating ? (
              <AiFillStar className="text-yellow-400" />
            ) : (
              <AiOutlineStar className="text-gray-400" />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Function to get active filters
  const getActiveFilters = () => {
    const filters = [];

    // Add search term filter
    if (searchTerm) {
      filters.push({
        type: 'search',
        label: `Search: ${searchTerm}`,
        value: searchTerm
      });
    }

    // Add category filter
    if (categoryData) {
      filters.push({
        type: 'category',
        label: `Category: ${categoryData}`,
        value: categoryData
      });
    }

    // Add price range filter
    if (isPriceFiltered) {
      filters.push({
        type: 'price',
        label: `Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} RWF`,
        value: priceRange
      });
    }

    // Add rating filter
    if (selectedRating > 0) {
      filters.push({
        type: 'rating',
        label: `${selectedRating}+ Stars`,
        value: selectedRating
      });
    }

    // Add stock filter
    if (!inStock) {
      filters.push({
        type: 'stock',
        label: 'Include Out of Stock',
        value: 'outOfStock'
      });
    }

    // Add product type filter
    if (productType !== 'all') {
      filters.push({
        type: 'productType',
        label: `Type: ${productType}`,
        value: productType
      });
    }

    return filters;
  };

  // Function to remove a filter
  const removeFilter = (filterType, filterValue) => {
    const newParams = new URLSearchParams(searchParams);

    switch (filterType) {
      case 'search':
        newParams.delete('search');
        break;
      case 'category':
        newParams.delete('category');
        break;
      case 'price':
        setIsPriceFiltered(false);
        setPriceRange([1, 10000000]);
        newParams.delete('priceMin');
        newParams.delete('priceMax');
        break;
      case 'rating':
        setSelectedRating(0);
        break;
      case 'stock':
        setInStock(true);
        break;
      case 'productType':
        setProductType('all');
        break;
      default:
        break;
    }

    setSearchParams(newParams);
  };

  // Function to get related products based on name and category
  const getRelatedProducts = () => {
    if (!searchTerm || searchTerm.length < 3) return [];

    const searchWords = searchTerm.toLowerCase();
    const currentCategory = categoryData;

    return allProducts.filter(product => {
      // Skip the exact same product
      if (product.name.toLowerCase() === searchTerm.toLowerCase()) return false;

      // Check if product name contains the search term or vice versa
      const nameMatch = product.name.toLowerCase().includes(searchWords) ||
        searchWords.includes(product.name.toLowerCase());

      // Check category match if category filter is active
      const categoryMatch = !currentCategory || product.category === currentCategory;

      return nameMatch && categoryMatch;
    }).slice(0, 5); // Limit to 5 related products
  };

  const pageTitle = searchTerm
    ? "Search Results"
    : categoryData
    ? categoryData
    : "All Products";

  const pageSubtitle = searchTerm
    ? "Find exactly what you need across the Yebone marketplace."
    : categoryData
    ? `Browse premium ${categoryData.toLowerCase()} from verified sellers.`
    : "Discover fashion, tech, home, and more from sellers across Africa.";

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Marketplace", to: "/products" },
    ...(categoryData ? [{ label: categoryData }] : searchTerm ? [{ label: "Search" }] : []),
  ];

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange([1, 10000000]);
    setSelectedRating(0);
    setInStock(true);
    setProductType("all");
    setIsPriceFiltered(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="marketplace-page min-h-screen dark:bg-[#1f1f1f]">
          <Header activeHeading={3} />
          <Container className="py-8 lg:py-10">
            <MarketplaceListingSkeleton />
          </Container>
          <Footer />
        </div>
      ) : (
        <div>
          <Helmet>
            <title>Products | Yebone</title>
            <meta name="description" content="Browse a wide range of products at Yebone." />
            <script type="application/ld+json">{JSON.stringify(structuredDataString)}</script>
          </Helmet>
          <div className="marketplace-page dark:text-gray-200 min-h-screen">
            <Header activeHeading={3} />

            <Container className="pt-6 lg:pt-8 pb-4">
              <MarketplacePageHero
                title={pageTitle}
                subtitle={pageSubtitle}
                breadcrumbs={breadcrumbs}
                count={data?.length || 0}
                searchTerm={searchTerm}
                badge={categoryData ? "Category" : searchTerm ? "Search" : "Marketplace"}
              />
            </Container>

            {/* Related Products Section */}
            {searchTerm && getRelatedProducts().length > 0 && (
              <Container className="pb-2">
                <div className="yebone-surface rounded-2xl p-4">
                  <span className="text-sm font-semibold text-yebone-primary mb-3 block">
                    Similar searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {getRelatedProducts().map((product) => (
                      <button
                        key={product._id}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set("search", product.name);
                          setSearchParams(newParams);
                        }}
                        className="marketplace-filter-chip cursor-pointer hover:scale-[1.02]"
                      >
                        <span className="truncate max-w-[200px]">{product.name}</span>
                        {product.stock === 0 && (
                          <span className="text-xs text-red-500">(Sold Out)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Container>
            )}

            <Container>
              <MarketplaceActiveFilters
                filters={getActiveFilters()}
                onRemove={removeFilter}
                onClearAll={clearAllFilters}
              />
            </Container>
            <Container className="flex justify-center items-start flex-wrap w-full mb-10 gap-6 lg:gap-8">
              {/* Filter Sidebar for Desktop */}
              <div className="hidden lg:block w-full lg:w-[22%] marketplace-filter-panel yebone-surface">
                <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                  Filters
                </h2>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-md shadow-sm dark:bg-[#1f1f1f] dark:text-gray-200"
                  >
                    <option value="">Default</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* Rating Filter with Stars */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        className={`flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedRating === rating ? 'bg-gray-100 dark:bg-gray-800' : ''
                          }`}
                        onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                      >
                        <StarRating rating={rating} onRatingClick={() => { }} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{rating} Stars</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter with Input Fields */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">Price Range</h3>
                  <form onSubmit={handlePriceInputSubmit} className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <div className="w-1/2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPriceInput}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          className="w-full p-2 border rounded-md dark:bg-[#1f1f1f] dark:text-gray-200"
                        />
                      </div>
                      <div className="w-1/2">
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPriceInput}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          className="w-full p-2 border rounded-md dark:bg-[#1f1f1f] dark:text-gray-200"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#29625d] text-white py-2 px-4 rounded hover:bg-[#1f4f4a]"
                    >
                      Apply Price
                    </button>
                  </form>

                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange([+e.target.value, priceRange[1]])}
                      className="range-input w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange([priceRange[0], +e.target.value])}
                      className="range-input w-full"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      RWF {priceRange[0].toLocaleString()} - RWF {priceRange[1].toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Condition Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">Condition</h3>
                  <select
                    value={condition}
                    onChange={(e) => handleConditionChange(e.target.value)}
                    className="w-full p-2 border rounded-md shadow-sm dark:bg-[#1f1f1f] dark:text-gray-200"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 dark:text-gray-200 text-[14px]">In Stock Only</span>
                  </label>
                </div>

                {/* Product Type Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">Product Type</h3>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full p-2 border rounded-md shadow-sm dark:bg-[#1f1f1f] dark:text-gray-200"
                  >
                    <option value="all">All Products</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="flash-sale">Flash Sale</option>
                    <option value="daily-deal">Daily Deal</option>
                  </select>
                </div>

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
                                  checked={categoryData === subcategory.title}
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
              </div>

              <MarketplaceMobileFilterButton
                open={dropdownOpen}
                onToggle={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div id="marketplace-mobile-filters" className="lg:hidden px-4 pb-4">
                  <DropDownFilter
                    categoryData={categoryData}
                    handleCategoryChange={handleCategoryChange}
                  />
                </div>
              )}

              {/* Product List Area */}
              <div className="flex-grow w-full lg:w-[72%]">
                <div className="marketplace-results-toolbar">
                  <MarketplaceSectionTabs
                    sections={sections}
                    activePath={location.pathname}
                    onChange={handleSectionChange}
                  />
                  <MarketplaceSortSelect
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={sortOptions}
                  />
                </div>

                <p className="marketplace-results-count mb-4">
                  Showing {data?.length || 0} products
                </p>

                {data && data.length > 0 ? (
                  <ProductList products={data} />
                ) : (
                  <MarketplaceEmptyState
                    icon={IoSearchOutline}
                    title="No products found"
                    message={
                      searchTerm
                        ? `We couldn't find matches for "${searchTerm}". Try different keywords or clear your filters.`
                        : "No products match your current filters. Adjust filters or browse the full marketplace."
                    }
                    actionLabel="Browse all products"
                    actionTo="/products"
                  />
                )}
                <div className="md:block hidden">
                  <div class="bg-gradient-to-r from-[#29625d] to-[#ffd496] h-[320px] flex items-center justify-center p-6 rounded-xl mt-3 shadow-lg">
                    <div class="flex items-center gap-12 max-w-3xl w-full">           
                      <div class="flex-shrink-0 mr-8 flex flex-col items-center justify-center">
                        <img src="https://res.cloudinary.com/djughivxs/image/upload/v1732432017/avatars/cwn1r7anqmdra57zxelr.png" alt="yebone official shop icon" class="h-20 w-20 object-cover rounded-full mb-4" />
                        <h3 class="text-white text-xl font-semibold mb-2">Yebone Shop</h3>
                        <p class="text-white text-sm font-medium opacity-80">Sponsored</p>
                      </div>
                      <div class="text-white flex-grow">
                        <h2 class="text-2xl font-semibold mb-4">Discover Great Deals on Used Products at Yebone Shop</h2>
                        <p class="text-md mb-6">Looking for quality used items at great prices? Search for the best deals today!</p>
                        <a href="https://www.yebone.com/shop/preview/6742d0af9c4de357667dc0ea" target="_blank" class="bg-[#29625d] text-white text-sm py-2 px-4 rounded-md hover:bg-[#1a4c47] transition duration-300 shadow-md transform hover:scale-105">
                          Visit Store
                        </a>
                      </div>

                    </div>
                  </div>

                </div>
                <MarketplaceAISection searchTerm={searchTerm} />

                {/* Recommended Products Section */}
                <div className="recommended-products mt-10">
                  <SectionTitle title="Recommended for you" subtitle="Based on your recent browsing" align="left" />
                  <ProductList products={recommendations} />
                </div>
              </div>
            </Container>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;