import React from "react";
import { Pagination } from "../../design-system/components";

const SearchResultsPagination = ({ page = 1, totalPages = 1, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 mb-4">
      <Pagination page={Number(page)} totalPages={Number(totalPages)} onChange={onPageChange} />
    </div>
  );
};

export default SearchResultsPagination;
