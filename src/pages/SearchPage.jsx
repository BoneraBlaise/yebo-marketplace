import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import GlobalPropertySearchSection from "../components/Search/GlobalPropertySearchSection";
import GlobalEventsSearchSection from "../components/Search/GlobalEventsSearchSection";
import GlobalMarketplaceSearchToolbar, {
  shouldShowVertical,
} from "../components/Search/GlobalMarketplaceSearchToolbar";
import { PageMeta } from "../components/ui";
import "../components/Search/global-marketplace-search.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !searchParams.get("search")) {
      const next = new URLSearchParams(searchParams);
      next.set("search", q);
      next.delete("q");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const searchTerm = searchParams.get("search") || searchParams.get("q") || "";
  const vertical = searchParams.get("vertical") || "all";

  const showProducts = shouldShowVertical("products", vertical);
  const showProperty = shouldShowVertical("property", vertical);
  const showMobility = shouldShowVertical("mobility", vertical);
  const showEvents = shouldShowVertical("events", vertical);
  const showAllProperty = vertical === "all";

  const metaTitle = searchTerm
    ? `Search: ${searchTerm} — Products, Property, Mobility & Events`
    : "Search the Yebone marketplace";

  return (
    <>
      <PageMeta
        title={metaTitle}
        description="Search and discover products, properties, vehicles, and events on Yebone marketplace."
      />

      <GlobalMarketplaceSearchToolbar searchTerm={searchTerm} />

      {searchTerm && showEvents ? <GlobalEventsSearchSection searchTerm={searchTerm} /> : null}

      {searchTerm && showAllProperty ? (
        <GlobalPropertySearchSection searchTerm={searchTerm} vertical="all" />
      ) : null}

      {searchTerm && showProperty && !showAllProperty ? (
        <GlobalPropertySearchSection searchTerm={searchTerm} vertical="property" />
      ) : null}

      {searchTerm && showMobility && !showAllProperty ? (
        <GlobalPropertySearchSection searchTerm={searchTerm} vertical="mobility" />
      ) : null}

      {showProducts ? <ProductsPage /> : null}
    </>
  );
};

export default SearchPage;
