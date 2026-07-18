import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import { PageMeta } from "../components/ui";

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

  return (
    <>
      <PageMeta
        title={searchTerm ? `Search: ${searchTerm}` : "Search products"}
        description="Search and discover products on Yebone marketplace."
      />
      <ProductsPage />
    </>
  );
};

export default SearchPage;
