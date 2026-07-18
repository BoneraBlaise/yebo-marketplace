import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchSuggestions } from "../redux/actions/search";

const useSiteSearch = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { flashSales } = useSelector((state) => state.flashSales);
  const { activeBids } = useSelector((state) => state.bids);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const navigate = useNavigate();
  const suggestionRequestRef = useRef(0);

  const filterLocalSuggestions = (term) => {
    const filteredProducts = (allProducts || [])
      .filter((product) => {
        const productName = product.name?.toLowerCase() || "";
        const shopName = product.shop?.name?.toLowerCase() || "";
        const productCategory = product.category?.toLowerCase() || "";
        return (
          productName.includes(term) ||
          shopName.includes(term) ||
          productCategory.includes(term)
        );
      })
      .map((item) => ({ ...item, type: "product" }));

    const filteredFlashSales = (flashSales || [])
      .filter((item) => {
        const flashSaleName = item.name?.toLowerCase() || "";
        const flashShopName = item.shop?.name?.toLowerCase() || "";
        const flashCategory = item.category?.toLowerCase() || "";
        return (
          flashSaleName.includes(term) ||
          flashShopName.includes(term) ||
          flashCategory.includes(term)
        );
      })
      .map((item) => ({ ...item, type: "flashsale" }));

    const filteredBids = (activeBids || [])
      .filter((item) => {
        const bidName = item.name?.toLowerCase() || "";
        const bidShopName = item.shop?.name?.toLowerCase() || "";
        const bidCategory = item.category?.toLowerCase() || "";
        return (
          bidName.includes(term) ||
          bidShopName.includes(term) ||
          bidCategory.includes(term)
        );
      })
      .map((item) => ({ ...item, type: "bid" }));

    return [...filteredProducts, ...filteredFlashSales, ...filteredBids].slice(0, 8);
  };

  const handleSearchChange = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setSearchData(null);
      return;
    }

    const requestId = ++suggestionRequestRef.current;

    try {
      const suggestions = await fetchSearchSuggestions(term, { limit: 8 });
      if (requestId !== suggestionRequestRef.current) return;

      if (suggestions.length) {
        setSearchData(suggestions.map((item) => ({ ...item, type: "product" })));
        return;
      }
    } catch (_error) {
      // Fall back to local catalog suggestions.
    }

    setSearchData(filterLocalSuggestions(term));
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchData(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchData(null);
  };

  return {
    searchTerm,
    searchData,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
    setSearchData,
  };
};

export default useSiteSearch;
