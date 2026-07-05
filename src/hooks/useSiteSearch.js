import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useSiteSearch = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { flashSales } = useSelector((state) => state.flashSales);
  const { activeBids } = useSelector((state) => state.bids);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setSearchData(null);
      return;
    }

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

    setSearchData([
      ...filteredProducts,
      ...filteredFlashSales,
      ...filteredBids,
    ]);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
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
