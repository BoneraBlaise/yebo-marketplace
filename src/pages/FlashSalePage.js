import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { Helmet } from "react-helmet";
import FlashSaleList from "../components/Route/FlashSaleList/FlashSaleList";
import { getAllFlashSales } from "../redux/actions/flashSale"; // Ensure the action is imported
import DropDownFilter from "../components/Layout/DropDownFilter"; // Import DropDownFilter
import { RiEqualizerLine } from "react-icons/ri"; // Icon for dropdown
import { categoriesData } from "../static/data";
const FlashSalePage = () => {
    const dispatch = useDispatch();
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

    return (
        <>
            {isLoading || !flashSales ? (
                <Loader />
            ) : (
                <div>
                    <Helmet>
                        <title>Flash Sale | Guriraline</title>
                        <meta
                            name="description"
                            content="Browse a wide range of flash sale flashsales at Guriraline."
                        />
                    </Helmet>
                    <div className="bg-white dark:bg-[#1f1f1f] dark:text-gray-200 min-h-screen">
                        <Header activeHeading={4} />
                        <div className="flex justify-center items-start flex-wrap w-full mb-10">
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

                            <div className="flex-grow w-full lg:w-[70%] p-4 mx-2 lg:mx-0">
                                {filteredData.length > 0 ? (
                                    <FlashSaleList flashSales={filteredData} />
                                ) : (
                                    <h1 className="text-center w-full pb-[100px] text-[20px]">
                                        No Flash Sale Found!
                                    </h1>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            )}

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
        </>
    );
};

export default FlashSalePage;
