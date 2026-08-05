import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ProductList from "../components/Route/ProductList/ProductList";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import { IoSearchOutline } from "react-icons/io5";
import { Container, SectionTitle } from "../components/ui";
import {
  MarketplaceActiveFilters,
  MarketplaceSectionTabs,
  MarketplaceSortSelect,
  MarketplaceListingSkeleton,
  MarketplaceMobileFilterButton,
  MarketplaceEmptyState,
  ShoppingPageHeader,
  CategoryLandingHero,
  CategoryShortcuts,
  CategoryFeaturedCollections,
  CategoryFilterSidebar,
  CategoryFilterDrawer,
  CategoryEmptyState,
  resolveCategoryContext,
  getCategoryBaseProducts,
  matchesCategoryScope,
} from "../components/Marketplace";
import "../components/Marketplace/categoryLanding/categoryLanding.css";
import "../components/Marketplace/shopping-ui.css";
import useProductSearch from "../hooks/useProductSearch";
import SearchResultsPagination from "../components/Search/SearchResultsPagination";
import SearchStateViews from "../components/Search/SearchStateViews";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const chipParam = searchParams.get("chip");
  const brandParam = searchParams.get("brand");
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

  const {
    useServerSearch,
    serverProducts,
    serverMeta,
    serverLoading,
    serverError,
    slowNetwork,
    retrySearch,
  } = useProductSearch({
    searchParams,
    sortBy,
    selectedRating,
    inStock,
    productType,
  });

  const handleSearchPageChange = (nextPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (nextPage <= 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", String(nextPage));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryContext = useMemo(
    () => resolveCategoryContext(categoryData, chipParam),
    [categoryData, chipParam]
  );

  const categoryBaseProducts = useMemo(() => {
    if (!categoryContext || !Array.isArray(allProducts)) return [];
    return getCategoryBaseProducts(allProducts, categoryContext.matchTitles);
  }, [allProducts, categoryContext]);

  const categoryBrands = useMemo(() => {
    const brands = new Set();
    categoryBaseProducts.forEach((product) => {
      if (product?.brand) brands.add(product.brand);
    });
    return [...brands].sort((a, b) => a.localeCompare(b));
  }, [categoryBaseProducts]);

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
    if (useServerSearch) {
      setData(serverProducts || []);
      return;
    }

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
      const minPriceParam = searchParams.get("minPrice") || searchParams.get("priceMin");
      const maxPriceParam = searchParams.get("maxPrice") || searchParams.get("priceMax");

      const matchesCategory = categoryContext
        ? matchesCategoryScope(product, categoryContext.matchTitles)
        : categoryData
        ? product.category === categoryData
        : true;

      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      const matchesBrand = brandParam
        ? product.brand === brandParam
        : true;

      // Price range filter from URL parameters
      const matchesPriceFromUrl = (() => {
        const productPrice = Number(product.discountPrice);
        const categoryFromUrl = searchParams.get("category");

        if (!categoryFromUrl) return true;

        if (categoryContext) {
          if (!matchesCategoryScope(product, categoryContext.matchTitles)) return false;
        } else if (product.category !== categoryFromUrl) {
          return false;
        }

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
        matchesBrand &&
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
    categoryContext,
    brandParam,
    useServerSearch,
    serverProducts,
  ]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === categoryData) {
      newParams.delete("category");
      newParams.delete("chip");
      newParams.delete("brand");
    } else {
      newParams.set("category", category);
      newParams.delete("chip");
      newParams.delete("brand");
    }
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand) => {
    const newParams = new URLSearchParams(searchParams);
    if (!brand || brand === brandParam) {
      newParams.delete("brand");
    } else {
      newParams.set("brand", brand);
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setIsPriceFiltered(true); // Mark that the price filter has been adjusted

    const newParams = new URLSearchParams(searchParams);
    newParams.set("minPrice", newRange[0]);
    newParams.set("maxPrice", newRange[1]);
    newParams.delete("priceMin");
    newParams.delete("priceMax");
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
      const chipLabel = categoryContext?.activeChipId && categoryContext.activeChipId !== "all"
        ? categoryContext.title
        : null;
      filters.push({
        type: 'category',
        label: chipLabel ? `${categoryData} · ${chipLabel}` : `Category: ${categoryData}`,
        value: categoryData
      });
    }

    if (brandParam) {
      filters.push({
        type: 'brand',
        label: `Brand: ${brandParam}`,
        value: brandParam
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
        newParams.delete('chip');
        newParams.delete('brand');
        break;
      case 'brand':
        newParams.delete('brand');
        break;
      case 'price':
        setIsPriceFiltered(false);
        setPriceRange([1, 10000000]);
        newParams.delete('priceMin');
        newParams.delete('priceMax');
        newParams.delete('minPrice');
        newParams.delete('maxPrice');
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
    : categoryContext
    ? categoryContext.displayTitle || categoryContext.title
    : "Shopping";

  const pageSubtitle = searchTerm
    ? null
    : categoryContext
    ? null
    : "Discover products from verified sellers across Africa.";

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Shopping", to: "/products" },
    ...(categoryContext?.breadcrumbs?.slice(2) || (searchTerm ? [{ label: "Search" }] : [])),
  ];

  const resultCount = useServerSearch ? serverMeta?.total || serverMeta?.count || 0 : data?.length || 0;

  const clearAllFilters = () => {
    const preservedCategory = new URLSearchParams();
    if (categoryData) {
      preservedCategory.set("category", categoryData);
      if (chipParam) preservedCategory.set("chip", chipParam);
    }
    setSearchParams(preservedCategory);
    setPriceRange([1, 10000000]);
    setSelectedRating(0);
    setInStock(true);
    setProductType("all");
    setIsPriceFiltered(false);
  };

  const filterProps = {
    sortBy,
    onSortChange: setSortBy,
    sortOptions,
    selectedRating,
    onRatingChange: setSelectedRating,
    minPriceInput,
    maxPriceInput,
    onMinPriceChange: setMinPriceInput,
    onMaxPriceChange: setMaxPriceInput,
    onPriceSubmit: handlePriceInputSubmit,
    priceRange,
    onPriceRangeChange: handlePriceChange,
    condition,
    onConditionChange: handleConditionChange,
    inStock,
    onInStockChange: setInStock,
    productType,
    onProductTypeChange: setProductType,
    categoryData,
    onCategoryChange: handleCategoryChange,
    brandOptions: categoryBrands,
    selectedBrand: brandParam || "",
    onBrandChange: handleBrandChange,
    hideLegacyCategories: Boolean(categoryContext?.mainCategory),
  };

  return (
    <>
      {isLoading ? (
        <div className="marketplace-page yebone-premium-screen min-h-screen dark:bg-gray-950">
          <Container className="py-8 lg:py-10">
            <MarketplaceListingSkeleton />
          </Container>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>
              {categoryContext
                ? `${categoryContext.title} | Yebone`
                : searchTerm
                ? `Search: ${searchTerm} | Yebone`
                : "Products | Yebone"}
            </title>
            <meta
              name="description"
              content={
                categoryContext
                  ? categoryContext.description
                  : "Browse a wide range of products at Yebone."
              }
            />
            <script type="application/ld+json">{JSON.stringify(structuredDataString)}</script>
          </Helmet>
          <div className="marketplace-page marketplace-page--shop yebone-premium-screen dark:text-gray-200 min-h-screen">
            <Container className="shop-content">
              {!categoryContext && (
                <ShoppingPageHeader
                  title={pageTitle}
                  subtitle={pageSubtitle}
                  breadcrumbs={location.pathname === "/search" || searchTerm ? breadcrumbs : []}
                  count={searchTerm || location.pathname === "/search" ? resultCount : undefined}
                  searchTerm={searchTerm}
                />
              )}

              {categoryContext && (
                <>
                  <CategoryLandingHero
                    context={categoryContext}
                    count={categoryBaseProducts.length}
                  />
                  <CategoryShortcuts
                    shortcuts={categoryContext.shortcuts}
                    activeChipId={categoryContext.activeChipId || "all"}
                    activeTitle={categoryContext.type === "sub" ? categoryContext.title : null}
                  />
                  <CategoryFeaturedCollections
                    products={categoryBaseProducts}
                    allProducts={allProducts}
                    matchTitles={categoryContext.matchTitles}
                    isLoading={isLoading}
                  />
                  <div className="cat-landing-divider" />
                </>
              )}

              <MarketplaceActiveFilters
                filters={getActiveFilters()}
                onRemove={removeFilter}
                onClearAll={clearAllFilters}
              />

              <div className="cat-landing-layout">
                <div className="cat-landing-layout__sidebar">
                  <CategoryFilterSidebar sticky {...filterProps} />
                </div>

                <MarketplaceMobileFilterButton
                  open={dropdownOpen}
                  onToggle={() => setDropdownOpen(!dropdownOpen)}
                />
                <CategoryFilterDrawer
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  filterProps={filterProps}
                />

                <div className="cat-landing-layout__main">
                  <div className="shop-results-bar">
                    <p className="shop-results-bar__count">
                      Showing {useServerSearch ? serverMeta?.count || 0 : data?.length || 0} results
                      {useServerSearch && serverMeta?.total ? ` of ${serverMeta.total}` : ""}
                    </p>
                    <div className="shop-results-bar__actions">
                      {!searchTerm && location.pathname !== "/search" && (
                        <MarketplaceSectionTabs
                          sections={sections}
                          activePath={location.pathname}
                          onChange={handleSectionChange}
                        />
                      )}
                      <MarketplaceSortSelect
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={sortOptions}
                      />
                    </div>
                  </div>

                  {searchTerm && getRelatedProducts().length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-xs font-semibold text-yebone-primary w-full mb-1">
                        Similar searches
                      </span>
                      {getRelatedProducts().map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set("search", product.name);
                            setSearchParams(newParams);
                          }}
                          className="marketplace-filter-chip cursor-pointer hover:scale-[1.02]"
                        >
                          <span className="truncate max-w-[200px]">{product.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {slowNetwork && useServerSearch && serverLoading && (
                    <p className="text-sm text-yebone-muted mb-3" role="status">
                      Search is taking longer than usual. Please wait or try again.
                    </p>
                  )}

                  {useServerSearch ? (
                    <SearchStateViews
                      isLoading={serverLoading}
                      error={serverError}
                      hasResults={Boolean(data?.length)}
                      searchTerm={searchTerm}
                      onRetry={retrySearch}
                    >
                      <>
                        <ProductList products={data} />
                        <SearchResultsPagination
                          page={serverMeta?.page || 1}
                          totalPages={serverMeta?.totalPages || 1}
                          onPageChange={handleSearchPageChange}
                        />
                      </>
                    </SearchStateViews>
                  ) : isLoading ? (
                    <MarketplaceListingSkeleton count={8} />
                  ) : data && data.length > 0 ? (
                    <ProductList products={data} />
                  ) : categoryContext ? (
                    <CategoryEmptyState
                      context={categoryContext}
                      searchTerm={searchTerm}
                      onClearFilters={clearAllFilters}
                    />
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

                  {!searchTerm && recommendations.length > 0 && (
                    <div className="recommended-products mt-10 pt-8 border-t border-gray-200/80 dark:border-gray-800">
                      <SectionTitle
                        title="Recommended for you"
                        subtitle="Based on your recent browsing"
                        align="left"
                      />
                      <ProductList products={recommendations.slice(0, 8)} />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;