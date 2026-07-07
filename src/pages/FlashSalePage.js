import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import FlashSaleList from "../components/Route/FlashSaleList/FlashSaleList";
import { getAllFlashSales } from "../redux/actions/flashSale"; // Ensure the action is imported
import DropDownFilter from "../components/Layout/DropDownFilter";
import { categoriesData } from "../static/data";
import { Container } from "../components/ui";
import { IoFlashOutline } from "react-icons/io5";
import {
  MarketplacePageHero,
  MarketplaceListingSkeleton,
  MarketplaceEmptyState,
  MarketplaceMobileFilterButton,
  MarketplaceSectionTabs,
} from "../components/Marketplace";
const FlashSalePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryData = searchParams.get("category");
    const searchTerm = searchParams.get("search") || "";
    const { flashSales, isLoading, error } = useSelector(
        (state) => state.flashSales || {}
    );
    const [filteredData, setFilteredData] = useState([]);
    const [priceRange, setPriceRange] = useState([1, 10000000]);
    const [selectedCategory, setSelectedCategory] = useState(categoryData || "");
    const [condition, setCondition] = useState("");
    const [isWholesale, setIsWholesale] = useState(false);
    const [isFlashSale, setIsFlashSale] = useState(false);
    const [isDailyDeal, setIsDailyDeal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Mobile dropdown state

    // Fetch flash sales data when the component mounts
    useEffect(() => {
        if (!flashSales.length) {
            dispatch(getAllFlashSales()); // Fetch only if data is not already present
        }
    }, [dispatch, flashSales.length]); // Run only once when component mounts

    // Filter the flash sales based on selected filters
    useEffect(() => {
        if (isLoading || !Array.isArray(flashSales)) {
            return;
        }

        const filtered = flashSales.filter((flashSale) => {
            const matchesCategory =
                selectedCategory ? flashSale.category === selectedCategory : true;
            const matchesSearch =
                flashSale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flashSale.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice =
                flashSale.flashSalePrice >= priceRange[0] &&
                flashSale.flashSalePrice <= priceRange[1];
            const matchesCondition = condition
                ? flashSale.condition === condition
                : true;
            const matchesWholesale = isWholesale
                ? flashSale.isWholesale === isWholesale
                : true;
            const matchesFlashSale = isFlashSale
                ? flashSale.isFlashSale === isFlashSale
                : true;
            const matchesDailyDeal = isDailyDeal
                ? flashSale.isDailyDeal === isDailyDeal
                : true;

            return (
                matchesCategory &&
                matchesSearch &&
                matchesPrice &&
                matchesCondition &&
                matchesWholesale &&
                matchesFlashSale &&
                matchesDailyDeal
            );
        });

        setFilteredData(filtered);
    }, [
        flashSales,
        selectedCategory,
        searchTerm,
        isLoading,
        priceRange,
        condition,
        isWholesale,
        isFlashSale,
        isDailyDeal,
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

    const sections = [
        { name: "Products", path: "/products" },
        { name: "Auctions", path: "/bids" },
        { name: "Flash", path: "/flash-sales" },
    ];

    return (
        <>
            {isLoading || !flashSales ? (
                <div className="marketplace-page min-h-screen dark:bg-[#1f1f1f]">
                    <Container className="py-8 lg:py-10">
                        <MarketplaceListingSkeleton />
                    </Container>
                </div>
            ) : (
                <div>
                    <Helmet>
                        <title>Flash Sale | Yebone</title>
                        <meta
                            name="description"
                            content="Browse a wide range of flash sale products at Yebone."
                        />
                    </Helmet>
                    <div className="marketplace-page dark:text-gray-200 min-h-screen">
                        <Container className="pt-6 lg:pt-8 pb-4">
                            <MarketplacePageHero
                                title="Flash Sales"
                                subtitle="Limited-time deals with countdown urgency — grab them before they're gone."
                                breadcrumbs={[
                                    { label: "Home", to: "/" },
                                    { label: "Flash Sales" },
                                ]}
                                count={filteredData.length}
                                badge="Limited time"
                            />
                            <MarketplaceSectionTabs
                                sections={sections}
                                activePath="/flash-sales"
                                onChange={(path) => {
                                    const params = searchParams.toString();
                                    navigate(`${path}${params ? `?${params}` : ""}`);
                                }}
                            />
                        </Container>
                        <Container className="flex justify-center items-start flex-wrap w-full mb-10 gap-6 lg:gap-8">
                            <div className="hidden lg:block w-full lg:w-[22%] marketplace-filter-panel yebone-surface">
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
                                    <label className="flex items-center mb-2 cursor-pointer ">
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

                            <div className="flex-grow w-full lg:w-[72%]">
                                <p className="marketplace-results-count mb-4">
                                    {filteredData.length} flash sale{filteredData.length === 1 ? "" : "s"}
                                </p>
                                {filteredData.length > 0 ? (
                                    <FlashSaleList flashSales={filteredData} />
                                ) : (
                                    <MarketplaceEmptyState
                                        icon={IoFlashOutline}
                                        title="No flash sales found"
                                        message="No deals match your filters right now. Check back soon or browse all products."
                                        actionLabel="Browse products"
                                        actionTo="/products"
                                    />
                                )}
                            </div>
                        </Container>
                    </div>
                </div>
            )}

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
        </>
    );
};

export default FlashSalePage;
