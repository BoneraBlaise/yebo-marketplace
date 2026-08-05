import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchSuggestions } from "../redux/actions/search";
import {
  isPropertyMobilitySearchTerm,
  matchPropertySearchSuggestions,
} from "../utils/propertySearchSuggestions";
import { searchPropertyListings } from "../services/propertyMobilityService";
import { addRecentSearch, getRecentSearches } from "../utils/siteSearchMemory";
import {
  SEARCH_DEBOUNCE_MS,
  TRENDING_MARKETPLACE_SEARCHES,
} from "../constants/marketplaceSearchConstants";

const mergeSuggestions = (items, limit = 8) => {
  const seen = new Set();
  const merged = [];
  items.forEach((item) => {
    const key = `${item.type || "product"}-${item._id || item.name}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });
  return merged.slice(0, limit);
};

const useSiteSearch = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { flashSales } = useSelector((state) => state.flashSales);
  const { activeBids } = useSelector((state) => state.bids);
  const { allEvents } = useSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => getRecentSearches(5));

  const navigate = useNavigate();
  const suggestionRequestRef = useRef(0);
  const debounceRef = useRef(null);

  const filterLocalSuggestions = useCallback(
    (term) => {
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

      const filteredEvents = (allEvents || [])
        .filter((event) => {
          const title = event.title?.toLowerCase() || "";
          const description = event.description?.toLowerCase() || "";
          const location = event.location?.toLowerCase() || "";
          return title.includes(term) || description.includes(term) || location.includes(term);
        })
        .slice(0, 3)
        .map((item) => ({ ...item, type: "event", name: item.title }));

      const curatedProperty = matchPropertySearchSuggestions(term, 4);

      return mergeSuggestions(
        [
          ...curatedProperty,
          ...filteredEvents,
          ...filteredProducts,
          ...filteredFlashSales,
          ...filteredBids,
        ],
        8
      );
    },
    [allProducts, flashSales, activeBids, allEvents]
  );

  const fetchPropertySuggestions = useCallback(async (term) => {
    try {
      const result = await searchPropertyListings({ q: term, limit: 4 });
      const listings = result?.data?.listings || result?.listings || [];
      return listings.slice(0, 4).map((listing) => ({
        ...listing,
        type: "property_listing",
        name: listing.title,
        _id: listing.listingId,
        query: term,
      }));
    } catch {
      return [];
    }
  }, []);

  const fetchSuggestions = useCallback(
    async (rawTerm) => {
      const term = rawTerm.trim().toLowerCase();
      if (!term) {
        setSearchData(null);
        setSuggestionsLoading(false);
        setActiveIndex(-1);
        return;
      }

      const requestId = ++suggestionRequestRef.current;
      setSuggestionsLoading(true);

      const curatedProperty = isPropertyMobilitySearchTerm(term)
        ? matchPropertySearchSuggestions(term, 4)
        : [];

      try {
        const [apiSuggestions, propertyListings] = await Promise.all([
          fetchSearchSuggestions(term, { limit: 6 }).catch(() => []),
          fetchPropertySuggestions(term),
        ]);

        if (requestId !== suggestionRequestRef.current) return;

        const productItems = (apiSuggestions || []).map((item) => ({ ...item, type: "product" }));
        const combined = mergeSuggestions([
          ...curatedProperty,
          ...propertyListings,
          ...productItems,
        ]);

        if (combined.length) {
          setSearchData(combined);
          setActiveIndex(-1);
          setSuggestionsLoading(false);
          return;
        }
      } catch {
        /* fall through to local */
      }

      if (requestId !== suggestionRequestRef.current) return;
      setSearchData(filterLocalSuggestions(term));
      setActiveIndex(-1);
      setSuggestionsLoading(false);
    },
    [fetchPropertySuggestions, filterLocalSuggestions]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setSearchData(null);
        setSuggestionsLoading(false);
        setActiveIndex(-1);
        return;
      }

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchSuggestions]
  );

  const navigateToSearch = useCallback(
    (query, extraParams = {}) => {
      const trimmed = query?.trim();
      if (!trimmed) return;

      addRecentSearch(trimmed);
      setRecentSearches(getRecentSearches(5));

      const params = new URLSearchParams({ search: trimmed, ...extraParams });
      navigate(`/search?${params.toString()}`);
      setSearchData(null);
      setIsSearchFocused(false);
      setActiveIndex(-1);
    },
    [navigate]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (activeIndex >= 0 && searchData?.[activeIndex]) {
        const item = searchData[activeIndex];
        if (item.type === "property_listing") {
          navigate(`/property-mobility/listing/${item._id || item.listingId}`);
        } else if (item.type === "property_curated") {
          navigateToSearch(item.query || item.name);
        } else if (item.type === "event") {
          navigate(`/product/${item._id}?isEvent=true`);
        } else {
          navigate(`/product/${item._id}`);
        }
        setSearchData(null);
        return;
      }

      if (searchTerm.trim()) {
        navigateToSearch(searchTerm);
      }
    },
    [activeIndex, searchData, navigate, navigateToSearch, searchTerm]
  );

  const handleQuerySelect = useCallback(
    (query) => {
      setSearchTerm(query);
      navigateToSearch(query);
    },
    [navigateToSearch]
  );

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    setRecentSearches(getRecentSearches(5));
  }, []);

  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      setIsSearchFocused(false);
      setActiveIndex(-1);
    }, 180);
  }, []);

  const handleSearchKeyDown = useCallback(
    (e) => {
      const count = searchData?.length || 0;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (count > 0) {
          setActiveIndex((prev) => (prev + 1) % count);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (count > 0) {
          setActiveIndex((prev) => (prev <= 0 ? count - 1 : prev - 1));
        }
      } else if (e.key === "Escape") {
        setSearchData(null);
        setActiveIndex(-1);
        setIsSearchFocused(false);
      }
    },
    [searchData]
  );

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchTerm("");
    setSearchData(null);
    setActiveIndex(-1);
    setSuggestionsLoading(false);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  return {
    searchTerm,
    searchData,
    recentSearches,
    trendingSearches: TRENDING_MARKETPLACE_SEARCHES,
    isSearchFocused,
    suggestionsLoading,
    activeIndex,
    showDiscovery: isSearchFocused && !searchTerm.trim(),
    handleSearchChange,
    handleSearchSubmit,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchKeyDown,
    handleQuerySelect,
    navigateToSearch,
    clearSearch,
    setSearchData,
    setSearchTerm,
  };
};

export default useSiteSearch;
